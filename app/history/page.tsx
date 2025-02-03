'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import Link from 'next/link';

const History: React.FC = () => {
  const [items, setItems] = useState<{ id: string; name: string; price: number }[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as { id: string; name: string; price: number }));
      setItems(itemsArr);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className='flex min-h-screen items-center justify-center'>
      <div className='text-center bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-3xl mb-4'>Expense History</h1>
        {items.length > 0 ? (
          <ul className='text-left'>
            {items.map((item) => (
              <li key={item.id} className='border-b p-2 my-2'>
                <span className='capitalize'>{item.name}</span> - <span className='font-semibold'>${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-xl text-gray-400'>No expenses recorded yet.</p>
        )}
        <Link href='/' className='mt-4 inline-block text-blue-500 hover:underline'>Back to Home</Link>
      </div>
    </main>
  );
};

export default History;
