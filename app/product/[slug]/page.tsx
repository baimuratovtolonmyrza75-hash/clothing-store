import { notFound } from "next/navigation";
import { getActiveProducts, getProductBySlug } from "@/lib/server/products";
import ProductPageClient from "../ProductPageClient";

export async function generateStaticParams() {
  const products = await getActiveProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
