import type { Product } from '../../app/models/products'
import ProductCard from './ProductCard'
import { Grid } from '@mui/material'

type Props = {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  return (
    <Grid container spacing={2}>
      {products.map(product => (
        <Grid
          size={{ xs: 12, sm: 6, md: 3, lg: 3 }}
          key={product.id}
          sx={{ display: 'flex' }}
        >
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  )
}