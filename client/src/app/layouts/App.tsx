import { useAppSelector } from '../store/store'

import NavBar from './NavBar'

import { Outlet, ScrollRestoration } from 'react-router-dom'

import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material'

function App() {

  const { darkMode } = useAppSelector(state => state.ui)
  const paletteType = darkMode ? 'dark' : 'light'

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <NavBar />

      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode ? '#121212' : '#eaeaea'
        }}
      >
        <Container maxWidth="xl" sx={{ marginTop: 14 }}>
          <ScrollRestoration />
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  )
}
  
export default App