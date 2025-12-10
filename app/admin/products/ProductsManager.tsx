// /app/admin/products/ProductsManager.tsx

"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaTimes, FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// 1. UPDATED INTERFACE
interface Product {
  _id?: string;
  name: { mn: string; en: string };
  description: { mn: string; en: string };
  price: number;
  currency: 'MNT' | 'USD';
  imageUrl: string;
  category: string;
  stock: number;
}

// 2. UPDATED BLANK FORM
const BLANK_FORM: Product = {
    name: { mn: "", en: "" },
    description: { mn: "", en: "" },
    price: 0,
    currency: 'MNT',
    imageUrl: "",
    category: "Apparel",
    stock: 10,
};

// ... TrilingualInput helper component from Step 2 goes here ...
const TrilingualInput: React.FC<{
  label: string;
  name: keyof Product;
  value: { mn: string; en: string };
  onChange: (name: keyof Product, lang: 'mn' | 'en', value: string) => void;
  isTextArea?: boolean;
}> = ({ label, name, value, onChange, isTextArea = false }) => {
  return (
    <div className="space-y-2">
      <label className="font-bold block">{label}</label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">MN</label>
          {isTextArea ? (
            <textarea
              className="w-full border p-2 rounded"
              value={value.mn}
              onChange={(e) => onChange(name, 'mn', e.target.value)}
            />
          ) : (
            <input
              className="w-full border p-2 rounded"
              value={value.mn}
              onChange={(e) => onChange(name, 'mn', e.target.value)}
            />
          )}
        </div>
        <div>
          <label className="text-sm font-medium">EN</label>
          {isTextArea ? (
            <textarea
              className="w-full border p-2 rounded"
              value={value.en}
              onChange={(e) => onChange(name, 'en', e.target.value)}
            />
          ) : (
            <input
              className="w-full border p-2 rounded"
              value={value.en}
              onChange={(e) => onChange(name, 'en', e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [products, setProducts] = useState(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Product>(BLANK_FORM);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setFormData(BLANK_FORM);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        // Ensure that even if old data is missing a language, it doesn't crash
        setFormData({
            ...product,
            name: product.name || { mn: '', en: '' },
            description: product.description || { mn: '', en: '' }
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    // 3. UPDATED handleChange for simple inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
    };

    // 4. NEW: Handler for bilingual fields
    const handleTrilingualChange = (name: keyof Product, lang: 'mn' | 'en', value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: {
                // @ts-ignore
                ...prev[name],
                [lang]: value
            }
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { /* ... (no change) ... */ };
    const handleSubmit = async (e: React.FormEvent) => { /* ... (no change) ... */ };
    const handleDelete = async (productId: string) => { /* ... (no change) ... */ };

    return (
        <div>
            <div className="flex justify-end mb-6">
                <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700">
                    <FaPlus /> Add New Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="w-full text-left">
                    {/* ... (thead remains the same) ... */}
                    <tbody className="divide-y divide-slate-100">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-slate-50">
                                <td className="p-2"><img src={product.imageUrl} className="w-14 h-14 rounded object-cover bg-slate-100" /></td>
                                {/* 5. UPDATED: Display English name in the table */}
                                <td className="p-4 font-bold text-slate-800">{product.name?.en || product.name?.mn || 'No Name'}</td>
                                <td className="p-4 text-slate-600">{product.price.toLocaleString()} {product.currency}</td>
                                <td className="p-4"><span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">{product.stock} left</span></td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleOpenEdit(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
                                    <button onClick={() => handleDelete(product._id!)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Create New Product"}</h2>
                                <button onClick={handleCloseModal}><FaTimes /></button>
                            </div>
                            
                            {/* 6. UPDATED FORM with Trilingual Inputs */}
                            <form id="productForm" onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
                                <TrilingualInput
                                    label="Product Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleTrilingualChange}
                                />
                                <TrilingualInput
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleTrilingualChange}
                                    isTextArea={true}
                                />
                                
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div><label className="font-bold">Price</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" required /></div>
                                    <div><label className="font-bold">Stock</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full border p-2 rounded" required /></div>
                                    <div><label className="font-bold">Category</label><input name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded" required /></div>
                                    <div><label className="font-bold">Currency</label><select name="currency" value={formData.currency} onChange={handleChange} className="w-full border p-2 rounded bg-white"><option>MNT</option><option>USD</option></select></div>
                                </div>
                                
                                <div>
                                    <label className="font-bold mb-2 block">Image</label>
                                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed h-40 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 relative bg-slate-50">
                                        {uploading ? <FaSpinner className="animate-spin text-2xl" /> : formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-contain p-2" /> : <div className="text-slate-400 text-center"><FaCloudUploadAlt className="text-3xl mx-auto" /><p>Upload Image</p></div>}
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </div>
                                </div>
                            </form>
                            <div className="p-6 border-t mt-auto flex justify-end gap-3 bg-slate-50">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded">Cancel</button>
                                <button type="submit" form="productForm" disabled={loading || uploading} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50">
                                {loading ? "Saving..." : "Save Product"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}