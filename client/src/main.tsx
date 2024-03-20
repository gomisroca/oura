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
import OrderHistory from './pages/OrderHistory';
import AdminProtectedRoute from './pages/Admin/AdminProtectedRoute';
import Admin from './pages/Admin';
import CatalogFilteredRoute from './pages/Catalog/CatalogFilteredRoute';

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
            path: "/order-history",
            element: <OrderHistory />,
            errorElement: <Error />,
        },
        {
            path: "/:genre/:category?/:type?",
            element: <CatalogFilteredRoute />,
            errorElement: <Error />,
            children:[
                {
                    path: "",
                    element: <Catalog />
                },
            ]
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
        {
            path: "/admin", 
            element: <AdminProtectedRoute />,
            errorElement: <Error />,
            children:[
                {
                    path: "",
                    element: <Admin />
                },
            ]
        },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
