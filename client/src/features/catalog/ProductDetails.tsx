import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  useAddBasketItemMutation,
  useFetchBasketQuery,
  useFetchProductDetailsQuery,
  useFetchProductReviewsQuery,
  useAddProductReviewMutation
} from './catalogApi'
import { useUserInfoQuery } from '../accounts/accountsApi'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

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
  Typography,
  Box,
  Card,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FlashOnIcon from '@mui/icons-material/FlashOn'

export default function ProductDetails() {
  const { id } = useParams()
  const productId = +(id ?? 0)
  const { data: product, isLoading } = useFetchProductDetailsQuery(productId)
  const { data: reviewsData } = useFetchProductReviewsQuery(productId)
  const [addReview, { isLoading: isSubmittingReview }] = useAddProductReviewMutation()

  const [addBasketItem, { isLoading: isAddingBasket }] = useAddBasketItemMutation()
  const { data: basket } = useFetchBasketQuery()
  const { data: user } = useUserInfoQuery()
  const navigate = useNavigate()
  const location = useLocation()

  const item = basket?.items.find(x => x.productId === productId)
  const [quantity, setQuantity] = useState(1)

  // Review Dialog state
  const [reviewOpen, setReviewOpen] = useState(false)
  const [newRating, setNewRating] = useState<number>(5)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity)
    } else {
      setQuantity(1)
    }
  }, [item])

  if (isLoading || !product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Loading product details...</Typography>
      </Box>
    )
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value
    if (value >= 1) {
      setQuantity(value)
    }
  }

  // ADD TO CART
  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please sign in or create an account to add items to your cart!')
      navigate('/login', { state: { from: location } })
      return
    }

    const qty = quantity > 0 ? quantity : 1
    try {
      await addBasketItem({ product, quantity: qty }).unwrap()
      toast.success(`Added ${qty}x ${product.name} to cart!`)
    } catch {
      toast.error('Failed to add item to cart')
    }
  }

  // DIRECT BUY (Directly to Checkout / Payment)
  const handleDirectBuy = async () => {
    if (!user) {
      toast.info('Please sign in to proceed directly to checkout!')
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }

    const qty = quantity > 0 ? quantity : 1
    try {
      await addBasketItem({ product, quantity: qty }).unwrap()
      navigate('/checkout')
    } catch {
      toast.error('Failed to process direct buy')
    }
  }

  const handleReviewSubmit = async () => {
    if (!user) {
      toast.info('Please log in to leave a review!')
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      await addReview({
        productId,
        buyerEmail: user.email,
        rating: newRating,
        comment: newComment
      }).unwrap()

      toast.success('Thank you! Your review has been posted.')
      setReviewOpen(false)
      setNewComment('')
      setNewRating(5)
    } catch (err) {
      console.error(err)
      toast.error('Failed to post review.')
    }
  }

  const productDetails = [
    { label: 'Name', value: product.name },
    { label: 'Description', value: product.description },
    { label: 'Type', value: product.type },
    { label: 'Brand', value: product.brand },
    { label: 'Quantity in stock', value: product.quantityInStock },
  ]

  const averageScore = reviewsData?.averageRating || 0
  const reviewCount = reviewsData?.totalReviews || 0

  return (
    <Box sx={{ color: '#ffffff' }}>
      <Grid container spacing={6}>
        {/* Left Column: Product Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'rgba(20, 3, 6, 0.8)',
              border: '1.5px solid rgba(229, 9, 20, 0.35)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </Box>
        </Grid>

        {/* Right Column: Product Information & Buy Actions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
            {product.name}
          </Typography>

          {/* Average Rating Display */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 1.5 }}>
            <Rating value={averageScore} precision={0.5} readOnly sx={{ color: '#ffb300' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff' }}>
              {averageScore > 0 ? `${averageScore.toFixed(1)} / 5.0` : 'No ratings yet'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              ({reviewCount} customer {reviewCount === 1 ? 'review' : 'reviews'})
            </Typography>
          </Box>

          <Divider sx={{ mb: 2, borderColor: 'rgba(229, 9, 20, 0.3)' }} />

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 2 }}>
            ${(product.price / 100).toFixed(2)}
          </Typography>

          <TableContainer
            sx={{
              bgcolor: 'rgba(20, 3, 6, 0.6)',
              borderRadius: 2,
              border: '1px solid rgba(229, 9, 20, 0.25)',
              mb: 3
            }}
          >
            <Table sx={{ '& td': { fontSize: '1rem', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
              <TableBody>
                {productDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 'bold', width: '35%', color: 'rgba(255,255,255,0.7)' }}>
                      {detail.label}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{detail.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Dual Action Buttons: ADD TO CART & DIRECT BUY */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                variant="outlined"
                type="number"
                label="Quantity"
                fullWidth
                value={quantity}
                onChange={handleInputChange}
                slotProps={{ htmlInput: { min: 1 } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 55,
                    color: '#ffffff',
                    fontWeight: 700,
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: '#e50914' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>

            {/* ADD TO CART */}
            <Grid size={{ xs: 12, sm: 4.5 }}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                disabled={isAddingBasket}
                onClick={handleAddToCart}
                sx={{
                  height: 55,
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  letterSpacing: 0.8,
                  borderRadius: '8px',
                  borderWidth: 1.5,
                  '&:hover': {
                    borderColor: '#e50914',
                    bgcolor: 'rgba(229, 9, 20, 0.15)',
                    color: '#e50914'
                  }
                }}
              >
                ADD TO CART
              </Button>
            </Grid>

            {/* DIRECT BUY (Directly to Checkout / Payment) */}
            <Grid size={{ xs: 12, sm: 4.5 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<FlashOnIcon />}
                disabled={isAddingBasket}
                onClick={handleDirectBuy}
                sx={{
                  height: 55,
                  bgcolor: '#e50914',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  letterSpacing: 0.8,
                  borderRadius: '8px',
                  boxShadow: '0 4px 18px rgba(229, 9, 20, 0.6)',
                  '&:hover': {
                    bgcolor: '#ff1f2d',
                    boxShadow: '0 6px 24px rgba(229, 9, 20, 0.8)'
                  }
                }}
              >
              BUY
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5, borderColor: 'rgba(229, 9, 20, 0.3)' }} />

      {/* Customer Reviews & Feedback Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
              Customer Reviews & Feedback
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Real reviews from verified purchasers
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<RateReviewIcon />}
            sx={{ fontWeight: 700 }}
            onClick={() => {
              if (!user) {
                toast.info('Please sign in to write a review!')
                navigate('/login', { state: { from: location } })
              } else {
                setReviewOpen(true)
              }
            }}
          >
            Write a Review
          </Button>
        </Box>

        {reviewsData && reviewsData.reviews.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviewsData.reviews.map((rev) => (
              <Card
                key={rev.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(20, 3, 6, 0.8)',
                  borderColor: 'rgba(229, 9, 20, 0.25)',
                  color: '#ffffff'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={rev.rating} readOnly size="small" sx={{ color: '#ffb300' }} />
                    <Chip label="Verified Buyer" size="small" color="success" variant="outlined" />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {format(new Date(rev.createdAt), 'dd MMMM yyyy')}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1, color: '#e50914' }}>
                  {rev.buyerEmail}
                </Typography>

                <Typography variant="body1" sx={{ mt: 0.5, color: '#ffffff' }}>
                  "{rev.comment}"
                </Typography>
              </Card>
            ))}
          </Box>
        ) : (
          <Card
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'rgba(20, 3, 6, 0.6)',
              borderColor: 'rgba(229, 9, 20, 0.25)',
              color: '#ffffff'
            }}
          >
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              No reviews yet for this product.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Purchased this item? Be the first to share your experience!
            </Typography>
          </Card>
        )}
      </Box>

      {/* Write Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Product Review</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Your Rating:
            </Typography>
            <Rating
              value={newRating}
              onChange={(_, val) => setNewRating(val || 5)}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review / Feedback"
            placeholder="Tell future buyers what you liked or disliked about this product..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReviewSubmit}
            disabled={isSubmittingReview || !newComment.trim()}
          >
            {isSubmittingReview ? 'Posting...' : 'Post Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
