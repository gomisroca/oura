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
import ProtectedRouteCheck from './pages/Editor/ProtectedRouteCheck';
import ProductUpload from './pages/Editor/ProductUpload';
import CatalogFilteredRoute from './pages/Catalog/CatalogFilteredRoute';
import EditorDashboard from './pages/Editor/EditorDashboard';
import ProductUpdate from './pages/Editor/ProductUpdate';
import ProductList from './pages/Editor/ProductList';
import UserUpload from './pages/Editor/UserUpload';
import UserEditList from './pages/Editor/UserEditList';
import UserEdit from './pages/Editor/UserEdit';
import CategoriesSettings from './pages/Editor/CategoriesSettings';
import NavigationSettings from './pages/Editor/NavigationSettings';
import HomepageSettings from './pages/Editor/HomepageSettings';
import CategoryEdit from './pages/Editor/CategoryEdit';
import SidebarSettings from './pages/Editor/SidebarSettings';
import AboutSettings from './pages/Editor/AboutSettings';

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
            path: "/:gender/:category?/:subcategory?",
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
            path: "/:gender/:category/:subcategory/:product",
            element: <Product />,
            errorElement: <Error />,
        },
        {
            path: "/checkout",
            element: <Checkout />,
            errorElement: <Error />,
        },
        {
            path: "/editor", 
            element: <ProtectedRouteCheck />,
            errorElement: <Error />,
            children:[
                {
                    path: "",
                    element: <EditorDashboard />
                },
                {
                    path: "products",
                    element: <ProductList />
                },
                {
                    path: "products/upload",
                    element: <ProductUpload />
                },
                {
                    path: "products/:id",
                    element: <ProductUpdate />
                },
                {
                    path: "users",
                    element: <UserEditList />
                },
                {
                    path: "users/upload",
                    element: <UserUpload />
                },
                {
                    path: "users/:id",
                    element: <UserEdit />
                },
                {
                    path: "categories",
                    element: <CategoriesSettings />
                },
                {
                    path: "categories/:category",
                    element: <CategoryEdit />
                },
                {
                    path: "navigation",
                    element: <NavigationSettings />
                },
                {
                    path: "sidebar",
                    element: <SidebarSettings />
                },
                {
                    path: "about",
                    element: <AboutSettings />
                },
                {
                    path: "homepage",
                    element: <HomepageSettings />
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
