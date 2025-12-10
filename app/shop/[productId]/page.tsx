import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo/mongodb";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import ProductDetailsClient from "./ProductDetailsClient";

// 1. Define the shape of a product document as it exists in the database
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

// Helper function to fetch a single product
async function getProduct(productId: string) {
    try {
        const client = await clientPromise;
        const db = client.db("volunteer_db");
        
        // 2. Tell TypeScript what kind of data is in this collection
        const productsCollection = db.collection<ProductFromDB>("products");

        // Ensure we're searching by ObjectId
        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
        
        if (!product) {
            return null;
        }

        // Now TypeScript knows that 'product' has .name, .price, etc.
        // We serialize it for the client component
        return {
            ...product,
            _id: product._id.toString(),
            // You can also explicitly convert other types if needed, e.g., date
            createdAt: product.createdAt.toISOString(),
        };
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

// This tells Next.js what the page's props will be
interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { productId } = params;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 md:py-32">
      <div className="container mx-auto px-4">
        
        <Link href="/shop" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-8">
            <FaArrowLeft />
            Back to All Merchandise
        </Link>
        
        {/* 3. The 'product' prop now has the correct, full type, resolving the error */}
        <ProductDetailsClient product={product} />
        
      </div>
    </div>
  );
}