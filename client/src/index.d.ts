type Category = {
    [category: string]: any;
}

type Color = {
    id: string;
    amount: number;
    name: string;
}
  
type Size = {
    size: string;
    colors: Color[];
}

type Product = {
    id: string;
    name: string;
    description: string;
    image: string;
    gender: string;
    category: string;
    subcategory: string;
    price: number;
    sales: number;
    sizes: Size[];
    onSale: boolean;
    onSeasonal: boolean;
    cartID?: string;
    size?: string;
    color?: string;
}

type Order = {
    id: string;
    products: string[];
    createdAt: string;
}

type LoginFormData = {
    email: string,
    password: string,
    keepAlive: boolean,
}

type RegisterFormData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'BASIC' | 'EDITOR' | 'SUPER' | 'ADMIN';
}

interface HomepageSettings {
    id: string;
    categories: string[];
    image: string;
    sale: boolean;
    saleText: string;
}

interface CategorySettings {
    id: string;
    category: string;
    image: string;
}

interface NavigationSettings {
    id: string;
    categories: string[];
}

interface SidebarSettings {
    id: string;
    image: string;
}

interface AboutSettings {
    id: number;
    image: string;
}

interface CartItem {
    cartId: string;
    id: string;
    size?: string;
    color?: string;
}