type Category = {
    classes: {
        id: string;
        name: string;
        types: string[];
    }[];
    genre: string;
    header: string;
    url: string;
}

type Color = {
    amount: number;
    name: string;
    class: string;
    [key: string]: string[];
}
  
type Size = {
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    colors: Color[];
}

type Clothes = {
    id: string;
    title: string;
    price: number;
    sale: number;
    description: string;
    genre: string;
    class: string;
    type: string;
    seasonal: boolean;
    image: string;
    sizes: Size[];
    sales: number;
}

interface CartClothes extends Clothes {
    cartID: string;
    chosenSize?: string;
    chosenColor?: string;
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
    first_name: string,
    last_name: string,
    email: string,
    password: string,
}
