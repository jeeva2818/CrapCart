import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../layouts/App'
import Catalog from '../../features/catalog/catalog'
import ProductDetails from '../../features/catalog/ProductDetails'
import AboutPage from '../../features/about/AboutPage'
import ContactPage from '../../features/contact/ContactPage'
import ServerError from '../errors/ServerError'
import NotFound from '../errors/NotFound'
import BasketPage from '../../features/basket/BasketPage'
import CheckoutPage from '../../features/checkout/CheckoutPage'
import CheckoutSuccess from '../../features/checkout/CheckoutSuccess'
import LoginForm from '../../features/accounts/LoginForm'
import RegisterForm from '../../features/accounts/RegisterForm'
import RequireAuth from '../RequireAuth'
import OrdersPage from '../../features/orders/OrdersPage'
import OrderDetailsPage from '../../features/orders/OrderDetailsPage'
import InventoryPage from "../../features/admin/InventoryPage"
import SellerOrdersPage from '../../features/seller/SellerOrdersPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate replace to="/catalog" />
            },
            {
                path: '/catalog',
                element: <Catalog />
            },
            {
                path: '/catalog/:id',
                element: <ProductDetails />
            },
            {
                path: '/about',
                element: <AboutPage />
            },
            {
                path: '/contacts',
                element: <ContactPage />
            },
            {
                path: '/server-error',
                element: <ServerError />
            },
            {
                path: '/not-found',
                element: <NotFound />
            },
            {
                path: '*',
                element: <Navigate replace to="/not-found" />
            },
            {
                path: '/basket',
                element: <BasketPage />
            },
            {
                element: <RequireAuth />,
                children: [
                    {
                        path: 'checkout',
                        element: <CheckoutPage />
                    },
                    {
                        path: 'checkout/success',
                        element: <CheckoutSuccess />
                    },
                    {
                        path: 'orders',
                        element: <OrdersPage />
                    },
                    {
                        path: 'orders/:id',
                        element: <OrderDetailsPage />
                    },
                    {
                        path: "inventory",
                        element: <InventoryPage />
                    },
                    {
                        path: "seller/orders",
                        element: <SellerOrdersPage />
                    }
                ]
            },
            {
                path: 'login',
                element: <LoginForm />
            },
            {
                path: 'register',
                element: <RegisterForm />
            }
        ]
    }
])
