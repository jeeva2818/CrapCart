import { AppBar, IconButton, Toolbar, Typography, Button, Badge, Box, LinearProgress } from '@mui/material'
import { DarkMode, LightMode, ShoppingCart } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { setDarkMode } from './uiSlice'
import { useFetchBasketQuery } from '../../features/catalog/catalogApi'
import { useUserInfoQuery } from '../../features/accounts/accountsApi'
import UserMenu from './UserMenu'

export default function NavBar() {
  const { data: basket } = useFetchBasketQuery()
  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const { isLoading, darkMode } = useAppSelector(state => state.ui)
  const dispatch = useAppDispatch()
  const { data: user } = useUserInfoQuery()
  const navigate = useNavigate()

  const handleCartClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/basket' } } })
    } else {
      navigate('/basket')
    }
  }

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand & Left Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: 1,
              mr: 2
            }}
          >
            CRAPCART
          </Typography>

          <Button component={Link} to="/catalog" color="inherit">
            Catalog
          </Button>

          {user?.roles?.some(r => r.toLowerCase() === 'seller' || r.toLowerCase() === 'admin') && (
            <Button
              component={Link}
              to="/seller/orders"
              color="secondary"
              variant="contained"
              size="small"
              sx={{ fontWeight: 'bold' }}
            >
              Seller Fulfillment
            </Button>
          )}

          <Button component={Link} to="/about" color="inherit">
            About
          </Button>
          <Button component={Link} to="/contacts" color="inherit">
            Contact
          </Button>
        </Box>

        {/* Right Actions: Cart, User/Auth, Theme */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleCartClick} color="inherit">
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="inherit"
                size="small"
                sx={{ my: 'auto', borderColor: 'rgba(255,255,255,0.7)' }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          <IconButton onClick={() => dispatch(setDarkMode())}>
            {darkMode ? <DarkMode /> : <LightMode sx={{ color: 'yellow' }} />}
          </IconButton>
        </Box>
      </Toolbar>

      {isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
    </AppBar>
  )
}