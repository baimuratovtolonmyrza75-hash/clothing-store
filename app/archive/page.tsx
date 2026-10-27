import ArchivePageClient from "./ArchivePageClient";
import { getActiveProducts } from "@/lib/server/products";

export default async function ArchivePage() {
  const products = await getActiveProducts();

  return <ArchivePageClient products={products} />;
}
