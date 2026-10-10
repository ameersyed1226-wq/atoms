// Face Recognition utility using @vladmandic/face-api
// Runs entirely in the browser — no backend needed

import * as faceapi from '@vladmandic/face-api';
import type { Student } from './store';

let modelsLoaded = false;
let modelsLoading = false;

/**
 * Load the 3 AI models needed for face recognition.
 * Call this once when the app/component mounts.
 * Models are cached by the browser after first load.
 */
export async function loadModels(): Promise<void> {
  if (modelsLoaded) return;
  if (modelsLoading) {
    // Wait for ongoing loading
    while (modelsLoading) {
      await new Promise(r => setTimeout(r, 100));
    }
    return;
  }

  modelsLoading = true;
  try {
    const MODEL_URL = '/models';
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    console.log('✅ Face recognition models loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load face recognition models:', error);
    throw new Error('Failed to load AI models. Please refresh the page.');
  } finally {
    modelsLoading = false;
  }
}

/**
 * Check if models are loaded
 */
export function areModelsLoaded(): boolean {
  return modelsLoaded;
}

/**
 * Extract a 128-dimensional face embedding from an image element.
 * Returns null if no face is detected.
 */
export async function extractFaceEmbedding(
  input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<{ embedding: number[]; detection: faceapi.FaceDetection } | null> {
  if (!modelsLoaded) {
    throw new Error('Models not loaded. Call loadModels() first.');
  }

  // Detect face with landmarks and compute descriptor
  const result = await faceapi
    .detectSingleFace(input, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!result) {
    return null;
  }

  return {
    embedding: Array.from(result.descriptor), // Float32Array → number[]
    detection: result.detection,
  };
}

/**
 * Extract face embedding from an image URL (data URL or regular URL).
 * Creates a temporary image element, waits for it to load, then extracts.
 */
export async function extractEmbeddingFromImageUrl(imageUrl: string): Promise<number[] | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        const result = await extractFaceEmbedding(img);
        resolve(result ? result.embedding : null);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Calculate Euclidean distance between two 128D face embeddings.
 * Lower distance = more similar faces.
 * Typically: < 0.6 = same person, > 0.6 = different person
 */
export function calculateDistance(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embedding dimensions do not match');
  }
  let sum = 0;
  for (let i = 0; i < embedding1.length; i++) {
    const diff = embedding1[i] - embedding2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Convert distance to a confidence percentage.
 * Distance 0 = 100% confidence, Distance 0.6 = ~0% confidence
 */
export function distanceToConfidence(distance: number): number {
  const maxDistance = 0.6;
  const confidence = Math.max(0, Math.min(100, ((maxDistance - distance) / maxDistance) * 100));
  return Math.round(confidence * 10) / 10; // 1 decimal place
}

export interface FaceMatchResult {
  matched: boolean;
  student?: Student;
  distance?: number;
  confidence?: number;
}

/**
 * Find the best matching student for a given face embedding.
 * Compares against all students who have registered face embeddings.
 * Returns match if distance < threshold (0.6).
 */
export function findMatchingStudent(
  embedding: number[],
  students: Student[],
  threshold: number = 0.6
): FaceMatchResult {
  let bestMatch: Student | null = null;
  let bestDistance = Infinity;

  for (const student of students) {
    if (!student.face_embedding || student.face_embedding.length === 0) {
      continue;
    }

    const distance = calculateDistance(embedding, student.face_embedding);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = student;
    }
  }

  if (bestMatch && bestDistance < threshold) {
    return {
      matched: true,
      student: bestMatch,
      distance: Math.round(bestDistance * 1000) / 1000,
      confidence: distanceToConfidence(bestDistance),
    };
  }

  return { matched: false };
}

/**
 * Detect all faces in an image/video and draw bounding boxes.
 * Useful for the camera overlay.
 */
export async function detectFaces(
  input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<faceapi.FaceDetection[]> {
  if (!modelsLoaded) return [];

  const detections = await faceapi.detectAllFaces(
    input,
    new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
  );

  return detections;
}
