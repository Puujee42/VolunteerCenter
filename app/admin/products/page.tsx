import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongo/mongodb";
import ProductsManager from "./ProductsManager";
import { ObjectId } from "mongodb"; // 1. Import ObjectId

export const dynamic = "force-dynamic";

// 2. Define the shape of a product document in the DATABASE
// Note: In the DB, _id is an ObjectId and createdAt is a Date object.
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

// Helper function to fetch products
async function getProducts() {
    try {
        const client = await clientPromise;
        const db = client.db("volunteer_db");

        // 3. Tell TypeScript what kind of data is in this collection
        const productsCollection = db.collection<ProductFromDB>("products");
        
        const productsRaw = await productsCollection.find({}).sort({ createdAt: -1 }).toArray();

        // Now TypeScript knows that 'p' has .name, .price, etc.
        return productsRaw.map(p => ({
            ...p,
            _id: p._id.toString(), // Convert ObjectId to string for the client
        }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export default async function AdminProductsPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  const products = await getProducts();

  return (
    <div className="min-h-screen bg-slate-100 p-8 pt-24 ml-64"> {/* Adjust padding as needed */}
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Manage Merchandise</h1>
        </div>
        {/* This prop will now have the correct type and the error will be gone */}
        <ProductsManager initialProducts={products} />
    </div>
  );
}