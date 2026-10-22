import type { Product } from '../../app/models/products'
import { currencyFormat } from '../../lib/util'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material'
import { Link } from 'react-router-dom'

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Card
      component={Link}
      to={`/catalog/${product.id}`}
      elevation={4}
      sx={{
        width: '100%',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        cursor: 'pointer',
        bgcolor: '#140306',
        border: '1.5px solid rgba(229, 9, 20, 0.35)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
        transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: '#e50914',
          boxShadow: '0 14px 35px rgba(229, 9, 20, 0.5)'
        }
      }}
    >
      {/* Free delivery badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          bgcolor: '#22c55e',
          color: '#ffffff',
          px: 1.2,
          py: 0.35,
          borderRadius: '14px',
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: 0.3,
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
        }}
      >
        Free delivery
      </Box>

      {/* Full-Bleed Top Image Box */}
      <CardMedia
        component="img"
        image={product.imageUrl}
        alt={product.name}
        sx={{
          height: 200,
          width: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />

      {/* Lower Content Box */}
      <CardContent sx={{ pt: 2, pb: 2.5, px: 2 }}>
        {/* Product Title in crisp White */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#ffffff',
            minHeight: '2.6em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </Typography>

        {/* Large Price in bold White */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mt: 1,
            color: '#ffffff',
            letterSpacing: 0.5
          }}
        >
          {currencyFormat(product.price)}
        </Typography>

        {/* In stock text */}
        <Typography
          variant="body2"
          sx={{
            color: '#22c55e',
            fontWeight: 700,
            mt: 0.6,
            fontSize: '0.85rem'
          }}
        >
          ● In stock
        </Typography>
      </CardContent>
    </Card>
  )
}