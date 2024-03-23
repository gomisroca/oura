type Category = {
    [category: string]: string[];
}

type Color = {
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