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
      primary: {
        main: '#e50914', // Vibrant Red
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#ffffff', // Crisp White
        contrastText: '#0a0a0c'
      },
      text: {
        primary: '#ffffff',
        secondary: '#f0e6e8'
      },
      background: {
        default: paletteType === 'dark' ? '#120205' : '#ffffff',
        paper: paletteType === 'dark' ? '#22060b' : '#ffffff'
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: paletteType === 'dark' ? '#080103' : '#f8f8fa',
            color: '#ffffff'
          }
        }
      }
    },
    shape: {
      borderRadius: 12
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          /* Bold, vibrant red as MAIN centerpiece fading into black at the edges */
          background: darkMode
            ? 'radial-gradient(ellipse at 50% 20%, #99101f 0%, #680813 32%, #320308 65%, #080102 100%)'
            : '#f8f8fa',
          backgroundAttachment: 'fixed',
          pt: 12,
          pb: 8
        }}
      >
        <Container maxWidth="xl">
          <ScrollRestoration />
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App