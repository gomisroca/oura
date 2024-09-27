import {
  type Product,
  type Color,
  type Size,
  type Sport,
  type Category,
  type OrderProduct,
  type Order,
} from '@prisma/client';

interface Provider {
  name: string;
  icon: React.ReactNode;
}

interface SizeWithColors extends Size {
  colors: Color[];
}

interface ProductWithSizes extends Product {
  sizes: SizeWithColors[];
}

interface SportWithCategories extends Sport {
  categories: CategoryWithSubcategories[];
}

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

interface OrderWithProducts extends Order {
  products: OrderItem[];
}

interface OrderItem extends OrderProduct {
  product: Product;
  size: Size;
  color: Color;
}
