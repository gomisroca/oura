import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Error from './pages/Error';
import About from './pages/About';
import Root from './components/Root';
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Legal from './pages/Legal';

const router = createBrowserRouter([
    {
        element: <Root />,
        children: [
        {
            path: "/",
            element: <Landing />,
            errorElement: <Error />,
        },
        {
            path: "/about",
            element: <About />,
            errorElement: <Error />,
        },
        {
            path: "/legal",
            element: <Legal />,
            errorElement: <Error />,
        },
        {
            path: "/:genre",
            element: <Catalog />,
            errorElement: <Error />,
        },
        {
            path: "/:genre/:category",
            element: <Catalog />,
            errorElement: <Error />,
        },
        {
            path: "/:genre/:category/:type",
            element: <Catalog />,
            errorElement: <Error />,
        },
        {
            path: "/:genre/:category/:type/:product",
            element: <Product />,
            errorElement: <Error />,
        },
        {
            path: "/checkout",
            element: <Checkout />,
            errorElement: <Error />,
        },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
