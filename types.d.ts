import {
  type Product,
  type Color,
  type Size,
  type Sport,
  type Category,
  type OrderProduct,
  type Order,
  type ProductOnSale,
} from '@prisma/client';

interface Provider {
  name: string;
  icon: React.ReactNode;
}

interface SizeWithColors extends Size {
  colors: Color[];
}

interface ProductWithSizes extends Product {
  sport: { name: string; id: number } | null;
  category: { name: string; id: number } | null;
  subcategory: { name: string; id: number } | null;
  sizes: SizeWithColors[];
  sales: ProductOnSale[];
}

interface SportWithCategories extends Sport {
  categories: CategoryWithSubcategories[];
  products: Product[];
}

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
  products: Product[];
}

interface OrderWithProducts extends Order {
  products: OrderItem[];
}

interface OrderItem extends OrderProduct {
  product: Product;
  size: Size;
  color: Color;
}

interface SaleCategory {
  id: number;
  name: string;
  categories: {
    name: string;
    id: number;
    subcategories?: {
      name: string;
      id: number;
    }[];
  }[];
}
