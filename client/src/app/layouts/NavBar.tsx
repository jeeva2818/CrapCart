import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  LinearProgress,
  InputBase,
  Paper
} from '@mui/material'
import { DarkMode, LightMode, ShoppingCart, Search as SearchIcon } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { setDarkMode } from './uiSlice'
import { useFetchBasketQuery } from '../../features/catalog/catalogApi'
import { useUserInfoQuery } from '../../features/accounts/accountsApi'
import { setSearchTerm } from '../../features/catalog/catalogSlice'
import UserMenu from './UserMenu'
import { useEffect, useState } from 'react'

export default function NavBar() {
  const { data: basket } = useFetchBasketQuery()
  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const { isLoading, darkMode } = useAppSelector(state => state.ui)
  const { searchTerm } = useAppSelector(state => state.catalog)
  const dispatch = useAppDispatch()
  const { data: user } = useUserInfoQuery()
  const navigate = useNavigate()

  const [term, setTerm] = useState(searchTerm || '')

  useEffect(() => {
    setTerm(searchTerm || '')
  }, [searchTerm])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSearchTerm(term))
    navigate('/catalog')
  }

  const handleCartClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/basket' } } })
    } else {
      navigate('/basket')
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: darkMode ? 'rgba(26, 4, 8, 0.94)' : 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: darkMode ? '1.5px solid rgba(229, 9, 20, 0.45)' : '1px solid #e0e0e0',
        color: '#ffffff',
        boxShadow: darkMode ? '0 6px 25px rgba(0,0,0,0.7)' : '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
        {/* Left: Logo + Shop Name + Dark/Light Mode beside it */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#ffffff',
              gap: 1.5
            }}
          >
            <Box
              component="img"
              src="/joker.jpg"
              alt="Logo"
              sx={{
                height: 42,
                width: 42,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e50914',
                boxShadow: '0 0 10px rgba(229, 9, 20, 0.5)'
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                color: '#ffffff'
              }}
            >
              ℭ𝔯𝔞𝔭ℭ𝔞𝔯𝔱
            </Typography>
          </Box>

          {/* Dark / Light Mode button */}
          <IconButton onClick={() => dispatch(setDarkMode())} color="inherit" size="small" sx={{ ml: 0.5 }}>
            {darkMode ? <DarkMode fontSize="small" sx={{ color: '#ffffff' }} /> : <LightMode fontSize="small" sx={{ color: '#ffb300' }} />}
          </IconButton>
        </Box>

        {/* Center: Search Bar */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: { xs: 200, sm: 320, md: 450 },
            px: 1.8,
            py: 0.4,
            borderRadius: '24px',
            bgcolor: darkMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.05)',
            border: darkMode ? '1.5px solid rgba(229, 9, 20, 0.4)' : '1px solid rgba(0, 0, 0, 0.15)',
            boxShadow: 'none'
          }}
        >
          <SearchIcon sx={{ color: '#ffffff', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search for boards, boots, products..."
            value={term}
            onChange={e => {
              setTerm(e.target.value)
              dispatch(setSearchTerm(e.target.value))
            }}
            sx={{ flex: 1, fontSize: '0.9rem', color: '#ffffff' }}
          />
        </Paper>

        {/* Right: Catalog, Cart, and Top-Right LOGIN / REGISTER */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button component={Link} to="/catalog" sx={{ color: '#ffffff', fontWeight: 700 }}>
            Catalog
          </Button>

          {user?.roles?.some(r => r.toLowerCase() === 'seller' || r.toLowerCase() === 'admin') && (
            <Button
              component={Link}
              to="/seller/orders"
              color="primary"
              variant="contained"
              size="small"
              sx={{ fontWeight: 'bold' }}
            >
              Seller Fulfillment
            </Button>
          )}

          <IconButton onClick={handleCartClick} sx={{ color: '#ffffff' }}>
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: '#ffffff',
                  fontWeight: 800,
                  letterSpacing: 0.8
                }}
              >
                LOGIN
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#ffffff',
                  color: '#99101f',
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  borderRadius: '20px',
                  px: 2.2,
                  boxShadow: '0 2px 8px rgba(255,255,255,0.3)',
                  '&:hover': {
                    bgcolor: '#e50914',
                    color: '#ffffff'
                  }
                }}
              >
                REGISTER
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>

      {isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color="primary" />
        </Box>
      )}
    </AppBar>
  )
}