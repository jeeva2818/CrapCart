import { useState } from 'react'
import {
    Box,
    Button,
    Card,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Rating,
    MenuItem,
    Alert
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { useFetchOrderDetailsQuery, useRequestReturnMutation, useUpdateOrderStatusMutation, useProcessReturnDecisionMutation } from './orderApi'
import { useUserInfoQuery } from '../accounts/accountsApi'
import { useAddProductReviewMutation } from '../catalog/catalogApi'
import {
    currencyFormat,
    formatAddressString,
    formatPaymentString
} from '../../lib/util'
import { generateAndPrintInvoice } from '../../lib/invoiceGenerator'
import { toast } from 'react-toastify'
import type { OrderItem } from '../../app/models/order'

const fulfillmentSteps = [
    'Payment Received',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
]

const getStepIndex = (status: string) => {
    switch (status) {
        case 'PaymentReceived':
            return 0
        case 'Processing':
            return 1
        case 'Shipped':
            return 2
        case 'OutForDelivery':
            return 3
        case 'Delivered':
        case 'ReturnRequested':
        case 'Returned':
        case 'ReturnRejected':
            return 4
        default:
            return 0
    }
}

const OrderDetailsPage = () => {
    const { id } = useParams()
    const { data: order, isLoading } = useFetchOrderDetailsQuery(Number(id))
    const { data: user } = useUserInfoQuery()
    const [requestReturn, { isLoading: isReturning }] = useRequestReturnMutation()
    const [addReview, { isLoading: isReviewing }] = useAddProductReviewMutation()
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation()
    const [processReturn, { isLoading: isProcessingReturn }] = useProcessReturnDecisionMutation()

    // Return dialog state
    const [returnOpen, setReturnOpen] = useState(false)
    const [returnReason, setReturnReason] = useState('Damaged in transit')
    const [returnComments, setReturnComments] = useState('')

    // Review dialog state
    const [reviewOpen, setReviewOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
    const [rating, setRating] = useState<number>(5)
    const [reviewComment, setReviewComment] = useState('')

    if (isLoading) {
        return <Typography variant="h5">Loading order...</Typography>
    }

    if (!order) {
        return <Typography variant="h5">Order not found</Typography>
    }

    const isSeller = user?.roles?.some(r => r.toLowerCase() === 'seller')
    const isAdmin = user?.roles?.some(r => r.toLowerCase() === 'admin')

    const handleAdvanceStatus = async (nextStatus: string) => {
        try {
            await updateStatus({ id: order.id, status: nextStatus }).unwrap()
            toast.success(`Order status updated to ${nextStatus}!`)
        } catch (err) {
            console.error(err)
            toast.error('Failed to update status.')
        }
    }

    const handleReturnDecision = async (approved: boolean) => {
        try {
            await processReturn({ id: order.id, approved }).unwrap()
            toast.success(`Return request ${approved ? 'Approved' : 'Rejected'}!`)
        } catch (err) {
            console.error(err)
            toast.error('Failed to process return decision.')
        }
    }

    const currentStep = getStepIndex(order.orderStatus)
    const isDelivered = order.orderStatus === 'Delivered'
    const isReturnRequested = order.orderStatus === 'ReturnRequested'
    const isReturned = order.orderStatus === 'Returned'
    const isReturnRejected = order.orderStatus === 'ReturnRejected'

    const handleReturnSubmit = async () => {
        try {
            await requestReturn({
                id: order.id,
                reason: returnReason,
                comments: returnComments
            }).unwrap()
            toast.success('Return request submitted successfully!')
            setReturnOpen(false)
        } catch (err) {
            console.error(err)
            toast.error('Failed to submit return request.')
        }
    }

    const handleReviewSubmit = async () => {
        if (!selectedItem) return
        try {
            await addReview({
                productId: selectedItem.productId,
                buyerEmail: order.buyerEmail,
                rating,
                comment: reviewComment
            }).unwrap()
            toast.success('Thank you! Your product review has been submitted.')
            setReviewOpen(false)
            setReviewComment('')
            setRating(5)
        } catch (err) {
            console.error(err)
            toast.error('Failed to submit review.')
        }
    }

    return (
        <Card sx={{ p: 3, maxWidth: 'md', mx: 'auto', borderRadius: 3 }}>
            {/* Header and Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5">Order #{order.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Placed on {format(new Date(order.orderDate), 'dd MMMM yyyy, hh:mm a')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {/* Seller / Admin Status Action Buttons */}
                    {(isSeller || isAdmin) && (
                        <>
                            {(order.orderStatus === 'Pending' || order.orderStatus === 'PaymentReceived') && (
                                <Button
                                    variant="contained"
                                    color="info"
                                    disabled={isUpdatingStatus}
                                    onClick={() => handleAdvanceStatus('Processing')}
                                >
                                    Mark Processing
                                </Button>
                            )}

                            {order.orderStatus === 'Processing' && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isUpdatingStatus}
                                    onClick={() => handleAdvanceStatus('Shipped')}
                                >
                                    Mark Shipped
                                </Button>
                            )}

                            {isAdmin && order.orderStatus === 'Shipped' && (
                                <Button
                                    variant="contained"
                                    color="warning"
                                    disabled={isUpdatingStatus}
                                    onClick={() => handleAdvanceStatus('OutForDelivery')}
                                >
                                    Out for Delivery
                                </Button>
                            )}

                            {isAdmin && order.orderStatus === 'OutForDelivery' && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={isUpdatingStatus}
                                    onClick={() => handleAdvanceStatus('Delivered')}
                                >
                                    Mark Delivered
                                </Button>
                            )}

                            {order.orderStatus === 'ReturnRequested' && (
                                <>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        disabled={isProcessingReturn}
                                        onClick={() => handleReturnDecision(true)}
                                    >
                                        Approve Return
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        disabled={isProcessingReturn}
                                        onClick={() => handleReturnDecision(false)}
                                    >
                                        Reject Return
                                    </Button>
                                </>
                            )}
                        </>
                    )}

                    {isDelivered && (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                onClick={() => generateAndPrintInvoice(order)}
                            >
                                Download Invoice
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<AssignmentReturnIcon />}
                                onClick={() => setReturnOpen(true)}
                            >
                                Return Item
                            </Button>
                        </>
                    )}

                    <Button component={Link} to="/orders" variant="outlined">
                        Back to orders
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Live Fulfillment Stepper */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Delivery Status:
                </Typography>
                <Stepper activeStep={currentStep} alternativeLabel>
                    {fulfillmentSteps.map((label, index) => (
                        <Step key={label} completed={currentStep >= index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Badges for special return states */}
                {isReturnRequested && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <strong>Return Requested:</strong> Reason: {order.returnReason}. Waiting for seller review.
                    </Alert>
                )}
                {isReturned && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        <strong>Return Approved:</strong> Your refund/return has been processed successfully.
                    </Alert>
                )}
                {isReturnRejected && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        <strong>Return Rejected:</strong> Your return request could not be accepted.
                    </Alert>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Shipping & Payment Info */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Shipping Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {order.shippingAddress.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatAddressString(order.shippingAddress)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Buyer: {order.buyerEmail}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Payment Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Method: {formatPaymentString(order.paymentSummary)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Current Status:{' '}
                        <Chip
                            label={order.orderStatus}
                            size="small"
                            color={isDelivered ? 'success' : isReturnRequested ? 'warning' : 'primary'}
                        />
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Order Items Table */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Ordered Products
            </Typography>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                            {isDelivered && <TableCell align="center">Review</TableCell>}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {order.orderItems.map((item) => (
                            <TableRow key={item.productId}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            component="img"
                                            src={item.pictureUrl}
                                            alt={item.name || item.productName}
                                            sx={{ width: 45, height: 45, objectFit: 'contain' }}
                                        />
                                        <Typography variant="body2">
                                            {item.name || item.productName || `Product #${item.productId}`}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="right">{currencyFormat(item.price)}</TableCell>
                                <TableCell align="right">{currencyFormat(item.price * item.quantity)}</TableCell>

                                {isDelivered && (
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<RateReviewIcon />}
                                            onClick={() => {
                                                setSelectedItem(item)
                                                setReviewOpen(true)
                                            }}
                                        >
                                            Rate
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pricing Summary */}
            <Box sx={{ mt: 3, maxWidth: 350, ml: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">{currencyFormat(order.subtotal)}</Typography>
                </Box>
                {order.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="success.main">
                            Discount
                        </Typography>
                        <Typography variant="body2" color="success.main">
                            -{currencyFormat(order.discount)}
                        </Typography>
                    </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="body2">Delivery fee</Typography>
                    <Typography variant="body2">
                        {order.deliveryFee === 0 ? 'FREE' : currencyFormat(order.deliveryFee)}
                    </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Total Paid
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {currencyFormat(order.total)}
                    </Typography>
                </Box>
            </Box>

            {/* Return Request Dialog */}
            <Dialog open={returnOpen} onClose={() => setReturnOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request Item Return (Order #{order.id})</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please choose a reason for returning this delivered order:
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        label="Reason for Return"
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        sx={{ mb: 2, mt: 1 }}
                    >
                        <MenuItem value="Damaged in transit">Damaged in transit</MenuItem>
                        <MenuItem value="Defective / Not working">Defective / Not working</MenuItem>
                        <MenuItem value="Item different from description">Item different from description</MenuItem>
                        <MenuItem value="Wrong size or specifications">Wrong size or specifications</MenuItem>
                        <MenuItem value="Arrived too late">Arrived too late</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Additional comments (optional)"
                        value={returnComments}
                        onChange={(e) => setReturnComments(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReturnOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleReturnSubmit}
                        disabled={isReturning}
                    >
                        {isReturning ? 'Submitting...' : 'Confirm Return Request'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Write Product Review Dialog */}
            <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Review: {selectedItem?.name || selectedItem?.productName || 'Product'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Your Rating:
                        </Typography>
                        <Rating
                            value={rating}
                            onChange={(_, newValue) => setRating(newValue || 5)}
                            size="large"
                        />
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Share your honest feedback / review"
                        placeholder="What did you like or dislike about this product?"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReviewSubmit}
                        disabled={isReviewing || !reviewComment.trim()}
                    >
                        {isReviewing ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default OrderDetailsPage
