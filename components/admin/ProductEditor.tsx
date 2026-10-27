"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

type ProductEditorProps = {
  product?: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    images: { url: string }[];
    sizes: { size: "S" | "M" | "L" | "XL" }[];
  };
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};

const sizeOptions = ["S", "M", "L", "XL"] as const;

type PreviewImage = {
  type: "existing" | "upload";
  src: string;
  label: string;
};

export default function ProductEditor({
  product,
  saveAction,
  deleteAction,
}: ProductEditorProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadPreviews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        type: "upload" as const,
        src: URL.createObjectURL(file),
        label: file.name,
      })),
    [selectedFiles]
  );

  useEffect(() => {
    return () => {
      uploadPreviews.forEach((preview) => URL.revokeObjectURL(preview.src));
    };
  }, [uploadPreviews]);

  const previewImages: PreviewImage[] = [
    ...(product?.images.map((image) => ({
      type: "existing" as const,
      src: image.url,
      label: image.url,
    })) ?? []),
    ...uploadPreviews,
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    setSelectedFiles(Array.from(files));
  };

  return (
    <div className="border border-black p-6">
      <div className="mb-6">
        <p className="text-xs tracking-[0.35em] text-neutral-500">
          {product ? t("adminEditProduct") : t("adminNewProduct")}
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          {product ? product.name : t("adminCreateProduct")}
        </h2>
      </div>

      <form action={saveAction} className="space-y-5">
        {product && <input type="hidden" name="id" value={product.id} />}

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="slug"
            defaultValue={product?.slug}
            placeholder="slug"
            className="border border-black px-4 py-3"
            required
          />
          <input
            name="name"
            defaultValue={product?.name}
            placeholder="name"
            className="border border-black px-4 py-3"
            required
          />
        </div>

        <textarea
          name="description"
          defaultValue={product?.description}
          placeholder="description"
          className="min-h-28 w-full border border-black px-4 py-3"
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="price"
            type="number"
            min="1"
            defaultValue={product?.price}
            placeholder="price"
            className="border border-black px-4 py-3"
            required
          />

          <label className="flex items-center gap-3 border border-black px-4 py-3 text-sm font-medium">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={product ? product.isActive : true}
            />
            {t("adminProductIsActive")}
          </label>
        </div>

        <textarea
          name="images"
          defaultValue={product?.images.map((image) => image.url).join("\n")}
          placeholder="/images/example.jpg"
          className="min-h-28 w-full border border-black px-4 py-3"
          required
        />

        <div className="space-y-3">
          <p className="text-xs tracking-[0.25em] text-neutral-500">{t("adminImagePreview")}</p>
          {previewImages.length === 0 ? (
            <div className="border border-dashed border-black/30 bg-neutral-50 px-4 py-10 text-sm text-neutral-500">
              {t("adminNoImages")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {previewImages.map((image) => (
                <figure key={`${image.type}-${image.src}`} className="space-y-2">
                  <div className="relative aspect-[3/4] overflow-hidden border border-black/10 bg-neutral-100">
                    <Image
                      src={image.src}
                      alt={image.label}
                      fill
                      sizes="(min-width: 768px) 20vw, 40vw"
                      className="object-cover"
                      unoptimized={image.type === "upload"}
                    />
                  </div>
                  <figcaption className="truncate text-xs text-neutral-500">
                    {image.type === "upload" ? `NEW: ${image.label}` : image.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs tracking-[0.25em] text-neutral-500">{t("adminUploadNewImages")}</p>
          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
            className={`border px-5 py-8 text-center transition ${
              isDragging
                ? "border-black bg-black text-white"
                : "border-dashed border-black/40 bg-neutral-50 text-black"
            }`}
          >
            <p className="text-sm font-medium">
              {t("adminDragImages").replace(" browse files", "").replace(" or", "")}{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="underline underline-offset-4"
              >
                browse files
              </button>
            </p>
            <p className={`mt-2 text-xs ${isDragging ? "text-white/80" : "text-neutral-500"}`}>
              {t("adminUploadHint")}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              name="imageFiles"
              accept="image/*"
              multiple
              onChange={(event) => handleFiles(event.target.files)}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {sizeOptions.map((size) => (
            <label key={size} className="flex items-center gap-2 border border-black px-4 py-2">
              <input
                type="checkbox"
                name="sizes"
                value={size}
                defaultChecked={product ? product.sizes.some((entry) => entry.size === size) : true}
              />
              {size}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            {product ? t("adminSaveChanges") : t("adminCreateProduct")}
          </button>
        </div>
      </form>

      {product && (
        <form action={deleteAction} className="mt-3">
          <input type="hidden" name="productId" value={product.id} />
          <button
            type="submit"
            className="border border-red-500 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            {t("adminDeleteProduct")}
          </button>
        </form>
      )}
    </div>
  );
}
