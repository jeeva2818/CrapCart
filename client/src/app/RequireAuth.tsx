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

    const adminRoutes = [
        '/inventory',
        '/admin/dashboard'
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
        adminRoutes.includes(location.pathname) &&
        !user.roles.includes('admin')
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