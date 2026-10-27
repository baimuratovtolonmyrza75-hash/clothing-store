import { redirect } from "next/navigation";
import { getProductById } from "@/lib/server/products";

type LegacyProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyProductPage({
  params,
}: LegacyProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    redirect("/shop");
  }

  redirect(`/product/${product.slug}`);
}
