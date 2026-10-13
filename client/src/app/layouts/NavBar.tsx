
import { AppBar, IconButton, Toolbar, Typography, Button, Badge } from '@mui/material'

import { DarkMode, LightMode, ShoppingCart } from '@mui/icons-material'

import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../store/store'

import { Box, LinearProgress } from '@mui/material'

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

  return (
    <AppBar position="fixed">
      <Toolbar>

        <Typography
          component={Link}
          to="/"
          variant="h6"
        >
          CRAPCART
        </Typography>

        {user ? (
          <UserMenu user={user} />
        ) : (
          <>
            <Button component={Link} to="/" color="inherit">
              Home
            </Button>

            <IconButton component={Link} to="/basket" color="inherit">
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <Button component={Link} to="/catalog" color="inherit">
              Catalog
            </Button>

            <Button component={Link} to="/about" color="inherit">
              About
            </Button>

            <Button component={Link} to="/contacts" color="inherit">
              Contact
            </Button>

            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
          </>
        )}

        <IconButton onClick={() => dispatch(setDarkMode())}>
          {darkMode ? (
            <DarkMode />
          ) : (
            <LightMode sx={{ color: 'yellow' }} />
          )}
        </IconButton>

      </Toolbar>

      {isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color="secondary" />
        </Box>
      )}

    </AppBar>
  )
}