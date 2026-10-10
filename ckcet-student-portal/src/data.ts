import { Student, Course, DayTimetable, Announcement, SupportTicket } from './types';

const RAW_MOCK_STUDENTS: Omit<Student, 'password'>[] = [
  {
    "name": "ABARNA K",
    "email": "abarna.k@ckcet.ac.in",
    "regNo": "420724104001",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.24,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "ABINAYA L",
    "email": "abinaya.l@ckcet.ac.in",
    "regNo": "420724104002",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.8,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "ANANDHI R",
    "email": "anandhicse@ckcet.ac.in",
    "regNo": "420724104003",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "ANUSIYA R",
    "email": "anusiya.r@ckcet.ac.in",
    "regNo": "420724104004",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.12,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "ARCHANA AR",
    "email": "archana.ar@ckcet.ac.in",
    "regNo": "420724104005",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.08,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "ARUN KUMAR S",
    "email": "arunkumarcse@ckcet.ac.in",
    "regNo": "420724104006",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.91,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "BARATH P",
    "email": "barathcse@ckcet.ac.in",
    "regNo": "420724104007",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.64,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "CHANDRU P",
    "email": "chandrucse@ckcet.ac.in",
    "regNo": "420724104008",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.09,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "CHAARUDEASHNI P",
    "email": "chaarudeashni.p@ckcet.ac.in",
    "regNo": "420724104009",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.9,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "DEEPIKA DEVI D",
    "email": "deepikadevi.d@ckcet.ac.in",
    "regNo": "420724104010",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.28,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "DENISHRAJA I",
    "email": "denishraja.i@ckcet.ac.in",
    "regNo": "420724104011",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.07,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "DHARSHINI P",
    "email": "dharshini.p@ckcet.ac.in",
    "regNo": "420724104012",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.9,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "DHASIN C",
    "email": "dhasin.c@ckcet.ac.in",
    "regNo": "420724104013",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.54,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "GOBINATH R",
    "email": "gobinath.r@ckcet.ac.in",
    "regNo": "420724104014",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.26,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "GURUPRASAD M",
    "email": "guruprasad.m@ckcet.ac.in",
    "regNo": "420724104015",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.72,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "HARISH S",
    "email": "harishcse@ckcet.ac.in",
    "regNo": "420724104016",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.74,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "HUMAIRAA H",
    "email": "humairaa.h@ckcet.ac.in",
    "regNo": "420724104017",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.14,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "JAIAKASH K",
    "email": "jaiakash.k@ckcet.ac.in",
    "regNo": "420724104018",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.38,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "JAYAKAVIN M",
    "email": "jayakavin.m@ckcet.ac.in",
    "regNo": "420724104019",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.61,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "JAYAPRIYA M",
    "email": "jayapriya.m@ckcet.ac.in",
    "regNo": "420724104020",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.39,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "JAYASHRI R",
    "email": "jayashri.r@ckcet.ac.in",
    "regNo": "420724104021",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.98,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "JAGAN I",
    "email": "jagan.i@ckcet.ac.in",
    "regNo": "420724104022",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.61,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "KAVIN S R",
    "email": "kavin.sr@ckcet.ac.in",
    "regNo": "420724104023",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.97,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "KOUSHIKRAM P",
    "email": "koushikram.p@ckcet.ac.in",
    "regNo": "420724104024",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.18,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "LAKSITHA A",
    "email": "laksitha.a@ckcet.ac.in",
    "regNo": "420724104025",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.65,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "LATHIKA V",
    "email": "lathika.v@ckcet.ac.in",
    "regNo": "420724104026",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.33,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "LOGAJANANI R",
    "email": "logajanani.r@ckcet.ac.in",
    "regNo": "420724104027",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.65,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "LOSHINI S",
    "email": "loshini.s@ckcet.ac.in",
    "regNo": "420724104028",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.3,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "MADESH M",
    "email": "madeshcse@ckcet.ac.in",
    "regNo": "420724104029",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.4,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "MOFLIN A",
    "email": "moflin.a@ckcet.ac.in",
    "regNo": "420724104030",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.95,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "MOHAMED WAHID H",
    "email": "mohamedwahid.h@ckcet.ac.in",
    "regNo": "420724104031",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.03,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "MOHAN P",
    "email": "mohan.p@ckcet.ac.in",
    "regNo": "420724104032",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.63,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "MOHANRAJ R",
    "email": "mohanraj.r@ckcet.ac.in",
    "regNo": "420724104033",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.74,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "MOUNIGA P",
    "email": "mouniga.p@ckcet.ac.in",
    "regNo": "420724104034",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.1,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "NABISHA BEGUM B",
    "email": "nabishabegum.b@ckcet.ac.in",
    "regNo": "420724104035",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.78,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "NASREEN M R",
    "email": "nasreen.mr@ckcet.ac.in",
    "regNo": "420724104036",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.58,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "PRADEEPA P",
    "email": "pradeepa.p@ckcet.ac.in",
    "regNo": "420724104037",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.55,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "PRATHEEKSHA J",
    "email": "pratheeksha.j@ckcet.ac.in",
    "regNo": "420724104038",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.21,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "RAKSHANA PR",
    "email": "rakshana.pr@ckcet.ac.in",
    "regNo": "420724104039",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.55,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "RANJANA R",
    "email": "ranjana.r@ckcet.ac.in",
    "regNo": "420724104040",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.29,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "RISHEGA V",
    "email": "rishega.v@ckcet.ac.in",
    "regNo": "420724104041",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.39,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SABARINARAYANAN V",
    "email": "sabarinarayanan.v@ckcet.ac.in",
    "regNo": "420724104042",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.95,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SAFWA M",
    "email": "safwa.m@ckcet.ac.in",
    "regNo": "420724104043",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.09,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SANGEERTHAN B",
    "email": "sangeerthan.b@ckcet.ac.in",
    "regNo": "420724104044",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.65,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SASIKUMAR P",
    "email": "sasikumar.p@ckcet.ac.in",
    "regNo": "420724104045",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.54,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SATHYA PRIYA M",
    "email": "sathyapriya.m@ckcet.ac.in",
    "regNo": "420724104046",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.03,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SAUMYA L",
    "email": "saumya.l@ckcet.ac.in",
    "regNo": "420724104047",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.18,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SHANMUGA PRIYA D",
    "email": "shanmugapriya.d@ckcet.ac.in",
    "regNo": "420724104048",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.13,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SIVAPRIYA D",
    "email": "sivapriya.d@ckcet.ac.in",
    "regNo": "420724104049",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.06,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SIVASRI N",
    "email": "sivasri.n@ckcet.ac.in",
    "regNo": "420724104050",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.3,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SOKESHWARAPANDIAN S",
    "email": "sokeshwarapandian.s@ckcet.ac.in",
    "regNo": "420724104051",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.18,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SUBASH S",
    "email": "subashcse@ckcet.ac.in",
    "regNo": "420724104052",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.57,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SUBASRI M",
    "email": "subasricse@ckcet.ac.in",
    "regNo": "420724104053",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.8,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SUDHARSHANA P",
    "email": "sudharshana.p@ckcet.ac.in",
    "regNo": "420724104054",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.65,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SUMAYYAH NILOFAR SR",
    "email": "sumayyanilofar.sr@ckcet.ac.in",
    "regNo": "420724104055",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.03,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "SYED AMEER R",
    "email": "syedameer.r@ckcet.ac.in",
    "regNo": "420724104056",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.72,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "THARUN G",
    "email": "tharun.g@ckcet.ac.in",
    "regNo": "420724104057",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.72,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "VARSHAMATHI S",
    "email": "varshamathi.s@ckcet.ac.in",
    "regNo": "420724104058",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 8.58,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "VARSHINI G",
    "email": "varshini.g@ckcet.ac.in",
    "regNo": "420724104059",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 7.5,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "name": "ZARASRI B",
    "email": "zarasri.b@ckcet.ac.in",
    "regNo": "420724104060",
    "department": "B.E. Computer Science and Engineering",
    "semester": 4,
    "cgpa": 9.48,
    "joinedYear": 2024,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  }
];

const PASSWORDS = [
  "bzKSyPyoMA", "4xpKX9k3sI", "rkbMH6lKSX", "Af81PjxJHE", "IP2tTJyP0f",
  "PJsXo1MMmJ", "RzFDvjHNpL", "dp2md3aF9T", "roKxchjyJ0", "SyBQPlqPds",
  "yClblStzMPW", "8IeZhoy6yH", "jr2uuO1Bp6", "ibs5B6MT8u", "j6ahrzsBK5",
  "SCAkDedmJE", "oXzOShJP4h", "6kzq2OfqaH", "jVPIGqS4mB", "ln4PsMVbuz",
  "QZbEzqwAWy", "XAwJXORob7", "ZtkBQeos9g", "wA105qTmzs", "h69KEweu0o",
  "8rTV9as2b4", "BMedtCHM7o", "lcbh1qvAnn", "MgI2Nnixe0", "kscmdCltTi",
  "Vt4B6wsiQk", "aBINSqgSRT", "s7u6ITRtVP", "zhhIOW3Yfw", "Z2vVTQhaz2",
  "FfDbyxg6Af", "MG6AcBPhDV", "P42z1I0OAY", "xH8YVr9sEe", "qTY6YIrgw7",
  "mKyq23RtpA", "6mLP32P33M", "zuZMzhVx2u", "CFw9yFgyRk", "2ZdQ8pFoJC",
  "zHm7U6KhrA", "WPfKRaGHaf", "caYsFAQZpM", "0FDZuJS4ft", "sFZ2puQVUA",
  "Aid0GJjF5k", "IM1M671VSi", "QkrbZLNzAx", "W9LD8CIALn", "z05WPx27sj",
  "QAdO22NHns", "R32L8qMQ8O", "kiktEjl7XV", "0fVRSCVJyq", "Sa3LpRYdso"
];

export const MOCK_STUDENTS: Student[] = RAW_MOCK_STUDENTS.map((student, index) => ({
  ...student,
  password: PASSWORDS[index] || "demoPassword123"
})) as Student[];

export const MOCK_COURSES: Course[] = [
  {
    code: "CS3601",
    name: "Mobile Computing",
    credits: 3,
    faculty: "Dr. K. Senthil Kumar, Prof./CSE",
    attendancePresent: 38,
    attendanceTotal: 40,
    ia1Marks: 18,
    ia2Marks: 19,
    modelMarks: 46,
    internalTotal: 41, // Calculated out of 50: (ia1/20)*10 + (ia2/20)*10 + (model/50)*30 or simple weightage
    currentGrade: "O"
  },
  {
    code: "CS3602",
    name: "Compiler Design",
    credits: 4,
    faculty: "Mrs. S. Radhika, AP/CSE",
    attendancePresent: 44,
    attendanceTotal: 48,
    ia1Marks: 15,
    ia2Marks: 17,
    modelMarks: 42,
    internalTotal: 37,
    currentGrade: "A+"
  },
  {
    code: "CS3603",
    name: "Distributed Systems",
    credits: 3,
    faculty: "Mr. R. Dinesh, AP/CSE",
    attendancePresent: 30,
    attendanceTotal: 36,
    ia1Marks: 14,
    ia2Marks: 15,
    modelMarks: 38,
    internalTotal: 33,
    currentGrade: "A"
  },
  {
    code: "CS3651",
    name: "Internet of Things",
    credits: 3,
    faculty: "Mrs. P. Lakshmi, AP/CSE",
    attendancePresent: 32,
    attendanceTotal: 40, // 80% attendance - borderline
    ia1Marks: 12,
    ia2Marks: 14,
    modelMarks: 35,
    internalTotal: 30,
    currentGrade: "B+"
  },
  {
    code: "CS3691",
    name: "Artificial Intelligence",
    credits: 3,
    faculty: "Dr. M. Ganesan, HOD/CSE",
    attendancePresent: 39,
    attendanceTotal: 42,
    ia1Marks: 19,
    ia2Marks: 20,
    modelMarks: 48,
    internalTotal: 44,
    currentGrade: "O"
  },
  {
    code: "HS3611",
    name: "Professional Communication Lab",
    credits: 2,
    faculty: "Mr. T. Saravanan, AP/English",
    attendancePresent: 20,
    attendanceTotal: 20, // 100% attendance
    ia1Marks: 20,
    ia2Marks: 20,
    modelMarks: 50,
    internalTotal: 50,
    currentGrade: "O"
  }
];

export const MOCK_TIMETABLE: DayTimetable[] = [
  {
    day: "Monday",
    periods: [
      { subject: "Win@Life 05", code: "WL005", time: "09:15 AM - 09:35 AM", room: "LH-201", faculty: "sivaprakash" },
      { subject: "DATA WAREHOUSING", code: "CCS341", time: "09:35 AM - 10:25 AM", room: "LH-201", faculty: "Ranjani K" },
      { subject: "CRYPTOGRAPHY AND CYBER SECURITY", code: "CB3491", time: "10:25 AM - 11:15 AM", room: "LH-201", faculty: "Varalakshmi.K" },
      { subject: "COMPILER DESIGN", code: "CS3501", time: "11:30 AM - 12:20 PM", room: "LH-201", faculty: "Vimal Raja" },
      { subject: "Computer Networks", code: "CS3591", time: "12:20 PM - 01:10 PM", room: "LH-201", faculty: "Elakiya V" },
      { subject: "DATA WAREHOUSING", code: "CCS341", time: "01:55 PM - 02:45 PM", room: "LH-201", faculty: "Ranjani K" },
      { subject: "DATA WAREHOUSING", code: "CCS341", time: "02:45 PM - 03:35 PM", room: "LH-201 (span)", faculty: "Ranjani K" },
      { subject: "Training & Placement Programing 05", code: "TPP005", time: "03:50 PM - 04:30 PM", room: "Seminar Hall", faculty: "John William P" }
    ]
  },
  {
    day: "Tuesday",
    periods: [
      { subject: "Win@Life 05", code: "WL005", time: "09:15 AM - 09:35 AM", room: "LH-201", faculty: "sivaprakash" },
      { subject: "Distributed Computing", code: "CS3551", time: "09:35 AM - 10:25 AM", room: "LH-201", faculty: "sivaprakash" },
      { subject: "COMPILER DESIGN", code: "CS3501", time: "10:25 AM - 11:15 AM", room: "LH-201", faculty: "Vimal Raja" },
      { subject: "WEB TECHNOLOGIES", code: "CCS375", time: "11:30 AM - 12:20 PM", room: "LH-201", faculty: "MALATHI R" },
      { subject: "WEB TECHNOLOGIES", code: "CCS375", time: "12:20 PM - 01:10 PM", room: "LH-201 (span)", faculty: "MALATHI R" },
      { subject: "Training & Placement Communication 05", code: "TPC005", time: "01:55 PM - 02:45 PM", room: "Seminar Hall", faculty: "Sowmiya L M" },
      { subject: "COMPILER DESIGN", code: "CS3501", time: "02:45 PM - 03:35 PM", room: "LH-201", faculty: "Vimal Raja" },
      { subject: "Training & Placement Programing 05", code: "TPP005", time: "03:50 PM - 04:30 PM", room: "Seminar Hall", faculty: "John William P" }
    ]
  },
  {
    day: "Wednesday",
    periods: [
      { subject: "Win@Life 05", code: "WL005", time: "09:15 AM - 09:35 AM", room: "LH-201", faculty: "sivaprakash" },
      { subject: "CRYPTOGRAPHY AND CYBER SECURITY", code: "CB3491", time: "09:35 AM - 10:25 AM", room: "LH-201", faculty: "Varalakshmi.K" },
      { subject: "Computer Networks", code: "CS3591", time: "10:25 AM - 11:15 AM", room: "LH-201", faculty: "Elakiya V" },
      { subject: "Computer Networks", code: "CS3591", time: "11:30 AM - 12:20 PM", room: "LH-201 (span)", faculty: "Elakiya V" },
      { subject: "WEB TECHNOLOGIES", code: "CCS375", time: "12:20 PM - 01:10 PM", room: "LH-201", faculty: "MALATHI R" },
      { subject: "COMPILER DESIGN", code: "CS3501", time: "01:55 PM - 02:45 PM", room: "LH-201", faculty: "Vimal Raja" },
      { subject: "COMPILER DESIGN", code: "CS3501", time: "02:45 PM - 03:35 PM", room: "LH-201 (span)", faculty: "Vimal Raja" },
      { subject: "Training & Placement Aptitude 05", code: "TPA005", time: "03:50 PM - 04:30 PM", room: "Seminar Hall", faculty: "G. JOTHILAKSHMI" }
    ]
  },
  {
    day: "Thursday",
    periods: [
      { subject: "Win@Life 05", code: "WL005", time: "09:15 AM - 09:35 AM", room: "LH-201", faculty: "sivaprakash" },
      { subject: "COMPILER DESIGN", code: "CS3501", time: "09:35 AM - 10:25 AM", room: "LH-201", faculty: "Vimal Raja" },
      { subject: "Distributed Computing", code: "CS3551", time: "10:25 AM - 11:15 AM", room: "LH-201", faculty: "sivaprakash" },
      { subject: "Computer Networks", code: "CS3591", time: "11:30 AM - 12:20 PM", room: "LH-201", faculty: "Elakiya V" },
      { subject: "Computer Networks", code: "CS3591", time: "12:20 PM - 01:10 PM", room: "LH-201 (span)", faculty: "Elakiya V" },
      { subject: "CRYPTOGRAPHY AND CYBER SECURITY", code: "CB3491", time: "01:55 PM - 02:45 PM", room: "LH-201", faculty: "Varalakshmi.K" },
      { subject: "Free / Study Period", code: "Free", time: "02:45 PM - 03:35 PM", room: "—", faculty: "—" },
      { subject: "Introduction to Women and Gender S...", code: "MX3081", time: "03:50 PM - 04:30 PM", room: "LH-201", faculty: "Varalakshmi.K" }
    ]
  },
  {
    day: "Friday",
    periods: [
      { subject: "IIY/Counselling/Library", code: "ICL", time: "09:15 AM - 09:35 AM", room: "Main Library", faculty: "sivaprakash" },
      { subject: "WEB TECHNOLOGIES", code: "CCS375", time: "09:35 AM - 10:25 AM", room: "LH-201", faculty: "MALATHI R" },
      { subject: "DATA WAREHOUSING", code: "CCS341", time: "10:25 AM - 11:15 AM", room: "LH-201", faculty: "Ranjani K" },
      { subject: "Introduction to Women and Gender S...", code: "MX3081", time: "11:30 AM - 12:20 PM", room: "LH-201", faculty: "Varalakshmi.K" },
      { subject: "Training & Placement Aptitude 05", code: "TPA005", time: "12:20 PM - 01:10 PM", room: "Seminar Hall", faculty: "G. JOTHILAKSHMI" },
      { subject: "DATA WAREHOUSING", code: "CCS341", time: "01:55 PM - 02:45 PM", room: "LH-201", faculty: "Ranjani K" },
      { subject: "Distributed Computing", code: "CS3551", time: "02:45 PM - 03:35 PM", room: "LH-201", faculty: "sivaprakash" },
      { subject: "WEB TECHNOLOGIES", code: "CCS375", time: "03:50 PM - 04:30 PM", room: "LH-201", faculty: "MALATHI R" }
    ]
  },
  {
    day: "Saturday",
    periods: [
      { subject: "IIY/Counselling/Library", code: "ICL", time: "09:15 AM - 09:35 AM", room: "Main Library", faculty: "sivaprakash" },
      { subject: "Computer Networks", code: "CS3591", time: "09:35 AM - 10:25 AM", room: "LH-201", faculty: "Elakiya V" },
      { subject: "Distributed Computing", code: "CS3551", time: "10:25 AM - 11:15 AM", room: "LH-201", faculty: "sivaprakash" },
      { subject: "WEB TECHNOLOGIES", code: "CCS375", time: "11:30 AM - 12:20 PM", room: "LH-201", faculty: "MALATHI R" },
      { subject: "CRYPTOGRAPHY AND CYBER SECURITY", code: "CB3491", time: "12:20 PM - 01:10 PM", room: "LH-201", faculty: "Varalakshmi.K" },
      { subject: "COMPILER DESIGN", code: "CS3501", time: "01:55 PM - 02:45 PM", room: "LH-201", faculty: "Vimal Raja" },
      { subject: "DATA WAREHOUSING", code: "CCS341", time: "02:45 PM - 03:35 PM", room: "LH-201", faculty: "Ranjani K" },
      { subject: "Introduction to Women and Gender S...", code: "MX3081", time: "03:50 PM - 04:30 PM", room: "LH-201", faculty: "Varalakshmi.K" }
    ]
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-01",
    title: "Semester Practical Examinations Schedule - April/May 2026",
    content: "All 3rd and 4th year B.E./B.Tech students are requested to note that the Anna University semester practical examinations are scheduled from April 24, 2026, to April 30, 2026. Detailed schedules department-wise will be posted in respective labs. Ensure 100% record completion and verified signature before the examinations.",
    date: "2026-08-01",
    category: "exam",
    priority: "high",
    author: "Office of the Controller of Examinations"
  },
  {
    id: "ann-02",
    title: "CK Tech Carnival 'CRAFT-2026' - Call for Registrations",
    content: "We are thrilled to launch the registration desk for the annual national-level technical symposium CRAFT-2026. Events include Paper Presentation, Code-Debug, Project Expo, and gaming events. Exciting cash prizes worth Rs. 50,000 to be won! Register online at www.ckcet-craft2026.com. Last date to submit abstract is April 10, 2026.",
    date: "2026-07-28",
    category: "event",
    priority: "medium",
    author: "Symposium Organizing Committee"
  },
  {
    id: "ann-03",
    title: "On-Campus Recruitment Drive: Zoho Corporation",
    content: "Zoho Corporation will be visiting our campus for a recruitment drive targeting final year students and pre-final year students (for internship). Position: Software Developer / Quality Analyst. Eligible Branches: CSE, IT, ECE with zero active backlogs. Online screening test on April 15, 2026, at the Central Computer Center.",
    date: "2026-07-25",
    category: "placement",
    priority: "high",
    author: "Placement & Training Cell"
  },
  {
    id: "ann-04",
    title: "Submission of Elective Registration Forms for Semester VII",
    content: "Students currently in Semester VI must select and submit their choice of professional and open electives for the upcoming Semester VII. The list of available courses and detailed syllabus is attached with this circular. Submit your preference form duly signed by your mentor to the HOD office by April 12, 2026.",
    date: "2026-07-20",
    category: "academic",
    priority: "medium",
    author: "HOD - Dept of CSE"
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tkt-101",
    subject: "Unable to view model exam marks in portal",
    category: "academic",
    message: "Respected Sir, our model examination marks for Mobile Computing are not visible in my dashboard profile. My classmates can view theirs. Kindly resolve.",
    status: "Resolved",
    date: "2026-07-29",
    replies: [
      {
        id: "rep-01",
        sender: "admin",
        message: "Dear student, your marks have been updated now. There was a temporary database sync lag for Roll No 420722104001. Please verify again.",
        date: "2026-07-30"
      },
      {
        id: "rep-02",
        sender: "student",
        message: "Thank you, Sir! I can see them now.",
        date: "2026-07-30"
      }
    ]
  },
  {
    id: "tkt-102",
    subject: "Wi-Fi connectivity issues in Hostel Block B - Room 304",
    category: "it-support",
    message: "Wi-Fi network signal is extremely weak inside Room 304 in Hostel Block B. It keeps disconnecting and we cannot complete online lab assignments.",
    status: "Open",
    date: "2026-08-03",
    replies: []
  }
];
