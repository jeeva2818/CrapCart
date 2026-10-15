import {
    Navigate,
    Outlet,
    useLocation
} from 'react-router-dom'

import { useUserInfoQuery } from '../features/accounts/accountsApi'

const RequireAuth = () => {
    const { data: user, isLoading } =
        useUserInfoQuery()

    const location = useLocation()

    const sellerOrAdminRoutes = [
        '/inventory',
        '/admin/dashboard',
        '/seller/orders'
    ]

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
            />
        )
    }

    if (
        sellerOrAdminRoutes.includes(location.pathname) &&
        !user.roles?.some(r => r.toLowerCase() === 'admin') &&
        !user.roles?.some(r => r.toLowerCase() === 'seller')
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        )
    }

    return <Outlet />
}

export default RequireAuth