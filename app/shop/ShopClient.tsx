

// /app/shop/ShopClient.tsx

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';

// This type should match the serialized data from the server page
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

export default function ShopClient({ products }: { products: Product[] }) {
  return (
    <div>
      <header className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4"
        >
          Our Merchandise
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-slate-500 max-w-2xl mx-auto"
        >
          Support our cause by purchasing from our official store. Every item helps fund our volunteer projects.
        </motion.p>
      </header>

      {products.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-semibold text-lg">No products are available right now.</p>
          <p className="text-slate-400 mt-2">Please check back later!</p>
        </div>
      )}
    </div>
  );
}

// Reusable Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault(); // This is important to stop the Link from navigating
      alert(`${product.name} added to cart! (Cart functionality can be added next)`);
      // In a real application, you would call a function from a global CartContext here
      // e.g., cart.addItem(product);
  };

  return (
    <motion.div variants={cardVariants}>
      <Link href={`/shop/${product._id}`} className="block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 bg-white/90 text-slate-800 rounded-full backdrop-blur-sm">{product.category}</span>
          <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white drop-shadow-lg">{product.name}</h3>
        </div>
        
        {/* Content Container */}
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-sm text-slate-600 line-clamp-3 flex-grow">{product.description}</p>
          
          {/* Footer with Price and Button */}
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <p className="text-2xl font-extrabold text-slate-800">
              {product.price.toLocaleString()}
              <span className="text-sm font-semibold ml-1">{product.currency}</span>
            </p>
            <button
                onClick={handleAddToCart}
                title="Add to Cart"
                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg group-hover:shadow-blue-200"
            >
                <FaShoppingCart />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};