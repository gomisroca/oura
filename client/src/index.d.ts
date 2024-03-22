type Category = {
    [category: string]: string[];
}

type Color = {
    amount: number;
    name: string;
}
  
type Size = {
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
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
}

interface CartProduct extends Product {
    cartID: string;
    size?: string;
    color?: string;
}

type Order = {
    id: string;
    products: string[];
    timestamp: string;
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
