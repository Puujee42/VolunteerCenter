// /app/shop/page.tsx

import clientPromise from "@/lib/mongo/mongodb";
import { ObjectId } from "mongodb";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic"; // Ensures the product list is always fresh

// Define the shape of a product from the DB for type safety
interface ProductFromDB {
    _id: ObjectId;
    name: string;
    description: string;
    price: number;
    currency: 'MNT' | 'USD';
    imageUrl: string;
    category: string;
    stock: number;
    createdAt: Date;
}

// Helper function to fetch all products
async function getProducts() {
    try {
        const client = await clientPromise;
        const db = client.db("volunteer_db");
        const productsCollection = db.collection<ProductFromDB>("products");
        
        // Find only products that are in stock
        const productsRaw = await productsCollection.find({ stock: { $gt: 0 } }).sort({ createdAt: -1 }).toArray();

        // Serialize the data to be safe for client components
        return productsRaw.map(p => ({
            ...p,
            _id: p._id.toString(),
            createdAt: p.createdAt.toISOString(), // Convert Date to string
        }));
    } catch (error) {
        console.error("Failed to fetch products for shop:", error);
        return [];
    }
}

export default async function ShopPage() {
  // Fetch products on the server
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-28 md:py-36">
        {/* Pass the server-fetched data to the client component for rendering */}
        <ShopClient products={products} />
      </main>
    </div>
  );
}