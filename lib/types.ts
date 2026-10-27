export type ProductSizeValue = "S" | "M" | "L" | "XL";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: ProductSizeValue[];
};

export type CartItem = CatalogProduct & {
  size: ProductSizeValue;
  quantity: number;
};
