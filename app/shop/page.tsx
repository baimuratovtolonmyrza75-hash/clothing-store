import ProductCard from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/server/products";

export default async function ShopPage() {
  const products = await getActiveProducts();

  return (
    <main className="min-h-screen px-6 md:px-10 pt-32 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
