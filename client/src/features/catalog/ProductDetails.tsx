import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  useAddBasketItemMutation,
  useFetchBasketQuery,
  useFetchProductDetailsQuery,
  useRemoveBasketItemMutation,
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

export default function ProductDetails() {
  const { id } = useParams()
  const productId = +(id ?? 0)
  const { data: product, isLoading } = useFetchProductDetailsQuery(productId)
  const { data: reviewsData } = useFetchProductReviewsQuery(productId)
  const [addReview, { isLoading: isSubmittingReview }] = useAddProductReviewMutation()

  const [removeBasketItem] = useRemoveBasketItemMutation()
  const [addBasketItem] = useAddBasketItemMutation()
  const { data: basket } = useFetchBasketQuery()
  const { data: user } = useUserInfoQuery()
  const navigate = useNavigate()
  const location = useLocation()

  const item = basket?.items.find(x => x.productId === productId)
  const [quantity, setQuantity] = useState(0)

  // Review Dialog state
  const [reviewOpen, setReviewOpen] = useState(false)
  const [newRating, setNewRating] = useState<number>(5)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity)
    }
  }, [item])

  if (isLoading || !product) return <div>Loading...</div>

  const handleUpdateBasket = () => {
    if (!user) {
      toast.info('Please sign in or create an account to add items to your cart!')
      navigate('/login', { state: { from: location } })
      return
    }

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value
    if (value >= 0) {
      setQuantity(value)
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
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
      {/* Top Product Information Grid */}
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', borderRadius: 8, maxHeight: 450, objectFit: 'contain' }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3">{product.name}</Typography>

          {/* Star Rating Overview */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
            <Rating value={averageScore} precision={0.5} readOnly size="medium" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {averageScore > 0 ? `${averageScore.toFixed(1)} / 5.0` : 'No ratings yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({reviewCount} customer {reviewCount === 1 ? 'review' : 'reviews'})
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="h4" color="secondary">
            ${(product.price / 100).toFixed(2)}
          </Typography>

          <TableContainer>
            <Table sx={{ '& td': { fontSize: '1rem' } }}>
              <TableBody>
                {productDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{detail.label}</TableCell>
                    <TableCell>{detail.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={2} sx={{ mt: 3 }}>
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
                disabled={quantity === (item?.quantity ?? 0)}
              >
                {item ? 'Update quantity' : 'Add to basket'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* Customer Reviews & Feedback Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Customer Reviews & Feedback
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real reviews from verified purchasers
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<RateReviewIcon />}
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
              <Card key={rev.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={rev.rating} readOnly size="small" />
                    <Chip label="Verified Buyer" size="small" color="success" variant="outlined" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(rev.createdAt), 'dd MMMM yyyy')}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {rev.buyerEmail}
                </Typography>

                <Typography variant="body1" sx={{ mt: 0.5, color: 'text.primary' }}>
                  "{rev.comment}"
                </Typography>
              </Card>
            ))}
          </Box>
        ) : (
          <Card variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" color="text.secondary">
              No reviews yet for this product.
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
