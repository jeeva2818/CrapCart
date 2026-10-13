
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useAddBasketItemMutation,
  useFetchBasketQuery,
  useFetchProductDetailsQuery,
  useRemoveBasketItemMutation
} from './catalogApi'

import {
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

export default function ProductDetails() {

  const { id } = useParams()

  const { data: product, isLoading } =
    useFetchProductDetailsQuery(+(id ?? 0))

  const [removeBasketItem] = useRemoveBasketItemMutation()
  const [addBasketItem] = useAddBasketItemMutation()

  const { data: basket } = useFetchBasketQuery()

  const item = basket?.items.find(x => x.productId === +id!)

  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity)
    }
  }, [item])

  if (isLoading || !product) return <div>Loading...</div>

  const handleUpdateBasket = () => {
    const updatedQuantity = Math.abs(quantity - (item?.quantity ?? 0))

    if (!item || quantity > item.quantity) {
      addBasketItem({
        product,
        quantity: updatedQuantity
      })
    } else {
      removeBasketItem({
        productId: product.id,
        quantity: updatedQuantity
      })
    }
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = +event.currentTarget.value

    if (value >= 0) {
      setQuantity(value)
    }
  }

  const productDetails = [
    { label: 'Name', value: product.name },
    { label: 'Description', value: product.description },
    { label: 'Type', value: product.type },
    { label: 'Brand', value: product.brand },
    { label: 'Quantity in stock', value: product.quantityInStock },
  ]

  return (
    <Grid
      container
      spacing={6}
      sx={{
        maxWidth: '1200px',
        mx: 'auto'
      }}
    >
      <Grid size={6}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%' }}
        />
      </Grid>

      <Grid size={6}>
        <Typography variant="h3">
          {product.name}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>

        <TableContainer>
          <Table sx={{ '& td': { fontSize: '1rem' } }}>
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {detail.label}
                  </TableCell>

                  <TableCell>
                    {detail.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid
          container
          spacing={2}
          sx={{ mt: 3 }}
        >
          <Grid size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in basket"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid size={6}>
            <Button
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              sx={{ height: 55 }}
              onClick={handleUpdateBasket}
              disabled={
                quantity === (item?.quantity ?? 0)
              }
            >
              {item ? 'Update quantity' : 'Add to basket'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
