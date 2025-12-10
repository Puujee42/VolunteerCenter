// /app/shop/[productId]/ProductDetailsClient.tsx

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Assume a Product type definition is available
// You should move this to a shared types file, e.g., /lib/types.ts
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: 'MNT' | 'USD';
  imageUrl: string;
  category: string;
  stock: number;
}

export default function ProductDetailsClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    alert(`${quantity} x ${product.name} added to cart! (Cart logic is the next step)`);
    // Here you would typically call a function from a global CartContext
    // e.g., cart.addItem(product, quantity);
  };

  const isInStock = product.stock > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      
      {/* --- LEFT: PRODUCT IMAGE --- */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-96"
      >
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-xl shadow-md"
        />
      </motion.div>

      {/* --- RIGHT: PRODUCT DETAILS --- */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col"
      >
        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{product.category}</span>
        <h1 className="text-4xl font-extrabold text-slate-800 mt-2 mb-4">{product.name}</h1>
        
        <p className="text-slate-600 text-lg mb-6 flex-grow">{product.description}</p>
        
        {/* Stock Status */}
        <div className={`flex items-center gap-2 mb-6 p-3 rounded-lg ${isInStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isInStock ? <FaCheckCircle /> : <FaTimesCircle />}
          <span className="font-semibold">{isInStock ? `${product.stock} items in stock` : 'Out of Stock'}</span>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="mt-auto pt-6 border-t">
          <div className="flex justify-between items-center gap-4">
            <p className="text-4xl font-extrabold text-slate-900">
              {product.price.toLocaleString()}
              <span className="text-lg font-semibold ml-1">{product.currency}</span>
            </p>
            
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                disabled={!isInStock}
                className="py-3 px-4 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
              >
                {[...Array(Math.min(product.stock, 10)).keys()].map(i => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>

              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}