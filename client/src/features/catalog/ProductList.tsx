import type { Product } from '../../app/models/products'
import ProductCard from './ProductCard'
import { Grid } from '@mui/material'

type Props = {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  return (
  <Grid container spacing={3}>
    {products.map(product => (
      <Grid
    size={3}
    key={product.id}
    sx={{ display: 'flex' }}
>
    <ProductCard product={product} />
</Grid>
    ))}
  </Grid>
)
}   