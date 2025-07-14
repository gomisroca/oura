import {
  type Category,
  type Color,
  type Order,
  type OrderAddress,
  type OrderProduct,
  type Product,
  type ProductOnSale,
  type Size,
  type Sport,
} from 'generated/prisma';

// Represents a provider with a name and an icon
interface Provider {
  name: string;
  icon: React.ReactNode;
}

// Extends Size to include available colors
interface SizeWithColors extends Size {
  colors: Color[]; // Colors associated with this size
}

// Extends Product to include relationships with sport, category, subcategory, sizes, and sales
interface ProductWithSizes extends Product {
  sport: { name: string; id: number } | null; // Sport related to the product
  category: { name: string; id: number } | null; // Category of the product
  subcategory: { name: string; id: number } | null; // Subcategory of the product
  sizes: SizeWithColors[]; // Sizes available for the product along with their colors
  sales: ProductOnSale[]; // Sales applicable to the product
}

// Extends Sport to include categories and their associated products
interface SportWithCategories extends Sport {
  categories: CategoryWithSubcategories[]; // Categories related to the sport
  products: Product[]; // Products related to the sport
}

// Extends Category to include subcategories and their associated products
interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[]; // Subcategories related to the category
  products: Product[]; // Products related to the category
}

// Extends Order to include its associated products
interface OrderWithProducts extends Order {
  products: OrderItem[]; // Products included in the order
  address?: OrderAddress | null;
}

// Represents an item in an order, extending OrderProduct to include product details
interface OrderItem extends OrderProduct {
  product: Product; // The product in the order
  size: Size; // The size of the product
  color: Color; // The color of the product
}

// Represents a sale category, including its subcategories and associated categories
interface SaleCategory {
  id: number; // Unique identifier for the sale category
  name: string; // Name of the sale category
  categories: {
    name: string; // Name of the category
    id: number; // Unique identifier for the category
    subcategories?: {
      // Optional subcategories related to the category
      name: string; // Name of the subcategory
      id: number; // Unique identifier for the subcategory
    }[];
  }[];
}
