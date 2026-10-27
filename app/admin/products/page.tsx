import AdminShell from "@/components/admin/AdminShell";
import ProductEditor from "@/components/admin/ProductEditor";
import { formatPrice } from "@/lib/currency";
import { getAdminProducts } from "@/lib/server/admin";
import Link from "next/link";
import { deleteProductAction, saveProductAction } from "@/app/admin/actions";
import { translations } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/language";

export default async function AdminProductsPage() {
  const language = await getServerLanguage();
  const t = translations[language];
  const products = await getAdminProducts();

  return (
    <AdminShell
      title={t.adminProductsTitle}
      description={t.adminProductsCopy}
      language={language}
    >
      <section className="grid gap-6">
        <ProductEditor saveAction={saveProductAction} deleteAction={deleteProductAction} />

        <div className="grid gap-6">
          {products.map((product) => (
            <div key={product.id} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="border border-black p-6">
                <p className="text-xs tracking-[0.3em] text-neutral-500">{t.adminCatalogCard}</p>
                <h2 className="mt-3 text-2xl font-semibold">{product.name}</h2>
                <p className="mt-2 text-sm text-neutral-600">{product.slug}</p>
                <Link
                  href={`/product/${product.slug}`}
                  className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
                >
                  {t.adminOpenProductPage}
                </Link>
                <p className="mt-4 text-lg font-semibold">{formatPrice(product.price, language)}</p>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{product.description}</p>

                <div className="mt-6 space-y-2 text-sm">
                  <p>{t.statusLabel}: {product.isActive ? t.adminStatusActive : t.adminStatusInactive}</p>
                  <p>
                    {t.size}: {product.sizes.map((size) => size.size).join(", ") || "-"}
                  </p>
                  <p>{t.adminImagesCount}: {product.images.length}</p>
                </div>
              </div>

              <ProductEditor
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  isActive: product.isActive,
                  images: product.images.map((image) => ({ url: image.url })),
                  sizes: product.sizes.map((size) => ({
                    size: size.size,
                  })),
                }}
                saveAction={saveProductAction}
                deleteAction={deleteProductAction}
              />
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
