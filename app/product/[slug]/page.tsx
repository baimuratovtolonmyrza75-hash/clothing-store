import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/server/products";
import ProductPageClient from "../ProductPageClient";

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
