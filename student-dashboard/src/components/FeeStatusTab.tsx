/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  CheckCircle, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  X, 
  Sparkles, 
  Plus 
} from 'lucide-react';
import { FeeItem, Transaction } from '../types';

interface FeeStatusTabProps {
  fees: FeeItem[];
  transactions: Transaction[];
  onUpdateFees: (newFees: FeeItem[]) => void;
  onUpdateTransactions: (newTransactions: Transaction[]) => void;
}

export default function FeeStatusTab({
  fees,
  transactions,
  onUpdateFees,
  onUpdateTransactions,
}: FeeStatusTabProps) {
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const totalFeeAmount = fees.reduce((sum, f) => sum + f.total, 0);
  const totalPaidAmount = fees.reduce((sum, f) => sum + f.paid, 0);
  const remainingBalance = totalFeeAmount - totalPaidAmount;

  const activePayingFee = fees.find(f => f.id === payingFeeId);

  const handleOpenPayment = (id: string) => {
    setPayingFeeId(id);
    setPaymentSuccess(false);
    setProcessing(false);
  };

  const handleClosePayment = () => {
    setPayingFeeId(null);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setUpiId('');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePayingFee) return;

    setProcessing(true);

    // Simulate network delay
    setTimeout(() => {
      const outstanding = activePayingFee.total - activePayingFee.paid;

      // Log receipt
      const newTransaction: Transaction = {
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: outstanding,
        itemPaid: activePayingFee.name,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'UPI Payment',
        receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
      };

      // Update Fees
      const updatedFees = fees.map(f => {
        if (f.id === activePayingFee.id) {
          return { ...f, paid: f.total };
        }
        return f;
      });

      onUpdateFees(updatedFees);
      onUpdateTransactions([newTransaction, ...transactions]);
      setProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  return (
    <div className="space-y-8" id="fee-status-tab-container">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex items-center space-x-4">
          <div className="p-3 bg-slate-100 text-[#212c6a] rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Accumulated Fees</p>
            <p className="text-2xl font-black text-slate-800">₹{totalFeeAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-green-600 font-bold">Total Settled Dues</p>
            <p className="text-2xl font-black text-green-600">₹{totalPaidAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex items-center space-x-4 ring-2 ring-indigo-50">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-indigo-700 font-extrabold">Outstanding Balance</p>
            <p className="text-2xl font-black text-slate-800">₹{remainingBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left 3 Columns: Dues list */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Wallet className="w-4.5 h-4.5 text-indigo-600" /> Active College Fees Ledger
          </h3>

          <div className="space-y-4">
            {fees.map((item) => {
              const remains = item.total - item.paid;
              const isSettled = remains <= 0;

              return (
                <div 
                  key={item.id}
                  className="p-4 border border-slate-50 bg-slate-50/20 hover:border-slate-100 rounded-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-[#212c6a] text-white px-2 py-0.5 rounded">
                      {item.category} Account
                    </span>
                    <h4 className="font-bold text-gray-800 text-sm mt-1">{item.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Total: ₹{item.total.toLocaleString()} • Settled: ₹{item.paid.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      {isSettled ? (
                        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                          ✓ Paid
                        </span>
                      ) : (
                        <div>
                          <p className="text-xs text-rose-600 font-bold">Outstanding: ₹{remains.toLocaleString()}</p>
                          <button
                            onClick={() => handleOpenPayment(item.id)}
                            className="text-xs font-bold text-white bg-[#212c6a] hover:bg-indigo-950 px-3 py-1.5 rounded-lg mt-1 cursor-pointer transition-colors"
                          >
                            Pay Dues
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Past Transaction history */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ArrowUpRight className="w-4.5 h-4.5 text-indigo-600" /> Transaction Audit logs
          </h3>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {transactions.map((tr) => (
              <div key={tr.id} className="p-3 border border-slate-50 bg-slate-50/30 rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800 leading-tight">{tr.itemPaid}</span>
                  <span className="text-green-600 whitespace-nowrap">+₹{tr.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>ID: {tr.receiptNumber}</span>
                  <span>{tr.date}</span>
                </div>
                <p className="text-[10px] text-[#212c6a] font-bold">Paid via {tr.paymentMethod}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout simulator modal */}
      {payingFeeId && activePayingFee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative">
            <button 
              onClick={handleClosePayment}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="p-6">
              {!paymentSuccess ? (
                <form onSubmit={handleProcessPayment} className="space-y-5">
                  <div className="text-center">
                    <p className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">Gateway Terminal</p>
                    <h3 className="text-lg font-bold text-slate-800 mt-0.5">Settle Academic Dues</h3>
                    <p className="text-xs text-slate-400 mt-1">Paying outstanding balance for: <strong>{activePayingFee.name}</strong></p>
                    <div className="bg-indigo-50 border border-indigo-100 py-3 px-6 rounded-xl inline-block mt-3">
                      <p className="text-[10px] text-indigo-700 font-bold uppercase">Total Charges Payable</p>
                      <p className="text-2xl font-black text-indigo-900">₹{(activePayingFee.total - activePayingFee.paid).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Payment Methods tabs */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-1.5 rounded font-bold cursor-pointer transition-all ${
                        paymentMethod === 'card' ? 'bg-[#212c6a] text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Credit/Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-1.5 rounded font-bold cursor-pointer transition-all ${
                        paymentMethod === 'upi' ? 'bg-[#212c6a] text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      UPI Payment
                    </button>
                  </div>

                  {/* Inputs */}
                  {paymentMethod === 'card' ? (
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-gray-500 font-bold block">Cardholder Full Name</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-indigo-600 focus:bg-white"
                          placeholder="e.g. Ameer Syed"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-500 font-bold block">Card Number</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-indigo-600 focus:bg-white"
                          placeholder="1234 5678 9101 1121"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-gray-500 font-bold block">Expiry Date</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-indigo-600 focus:bg-white"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-500 font-bold block">CVV</label>
                          <input
                            type="password"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-indigo-600 focus:bg-white"
                            placeholder="***"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      <label className="text-gray-500 font-bold block">UPI Virtual ID</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-indigo-600 focus:bg-white"
                        placeholder="ameer@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Submit Button with Loading State */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 transition-colors text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing payment securely...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4.5 h-4.5" />
                        Authorize Secure Transaction
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Payment Processed Successfully!</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Your dues of <strong>₹{(activePayingFee.total - activePayingFee.paid).toLocaleString()}</strong> have been registered and credited. An automated receipt has been logged.
                    </p>
                  </div>
                  <button
                    onClick={handleClosePayment}
                    className="bg-[#212c6a] hover:bg-indigo-950 text-white font-bold text-xs py-2 px-6 rounded-lg cursor-pointer transition-colors inline-block"
                  >
                    Return to Portal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
