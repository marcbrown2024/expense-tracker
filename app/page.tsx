"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import Link from "next/link";
import { FaHistory, FaChartPie } from "react-icons/fa";

interface Item {
  id: string;
  name: string;
  price: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<{ name: string; price: string }>({
    name: "",
    price: "",
  });
  const [total, setTotal] = useState<number>(0);

  // Add item to database
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.price !== "") {
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        price: parseFloat(newItem.price),
      });
      setNewItem({ name: "", price: "" });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArr: Item[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        price: Number(doc.data().price),
      })) as Item[];
      setItems(itemsArr);

      // Calculate total
      setTotal(itemsArr.reduce((sum, item) => sum + item.price, 0));
    });

    return () => unsubscribe();
  }, []);

  // Delete items from database
  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "items", id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>

        {/* Navigation Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          <Link title="History" href="/history">
            <FaHistory className="text-white text-3xl hover:text-gray-400 cursor-pointer" />
          </Link>
          <Link title="Summary" href="/summary">
            <FaChartPie className="text-white text-3xl hover:text-gray-400 cursor-pointer" />
          </Link>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <form
            className="grid grid-cols-6 items-center text-black"
            onSubmit={addItem}
          >
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item"
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="col-span-2 p-3 border mx-3"
              type="number"
              placeholder="Enter $"
            />
            <button
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit"
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <div className="flex justify-between p-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
