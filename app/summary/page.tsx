'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import Link from 'next/link';

const Summary: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const [hasExpenses, setHasExpenses] = useState<boolean>(false);

  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const totalPrice = querySnapshot.docs.reduce((sum, doc) => sum + parseFloat(doc.data().price), 0);
      setTotal(totalPrice);
      setHasExpenses(querySnapshot.docs.length > 0);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className='flex min-h-screen items-center justify-center'>
      <div className='text-center bg-slate-800 p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl mb-4'>Expense Summary</h1>
        {hasExpenses ? (
          <p className='text-xl'>Total Expenses: <span className='font-semibold'>${total.toFixed(2)}</span></p>
        ) : (
          <p className='text-xl text-gray-400'>No expenses recorded yet.</p>
        )}
        <Link href='/' className='mt-4 inline-block text-blue-500 hover:underline'>Back to Home</Link>
      </div>
    </main>
  );
};

export default Summary;
