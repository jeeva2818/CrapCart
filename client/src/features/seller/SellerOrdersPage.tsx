import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Button,
    Chip,
    Box
} from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useFetchOrdersQuery, useUpdateOrderStatusMutation, useProcessReturnDecisionMutation } from '../orders/orderApi'
import { useUserInfoQuery } from '../accounts/accountsApi'
import { currencyFormat, formatAddressString } from '../../lib/util'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

const SellerOrdersPage = () => {
    const { data: user } = useUserInfoQuery()
    const isAdmin = user?.roles?.some(r => r.toLowerCase() === 'admin')
    const { data: orders, isLoading } = useFetchOrdersQuery()
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()
    const [processReturn, { isLoading: isProcessingReturn }] = useProcessReturnDecisionMutation()

    if (isLoading) {
        return <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>Loading seller orders...</Typography>
    }

    if (!orders || orders.length === 0) {
        return <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>No orders found.</Typography>
    }

    const handleAdvanceStatus = async (orderId: number, nextStatus: string) => {
        try {
            await updateStatus({ id: orderId, status: nextStatus }).unwrap()
            toast.success(`Order #${orderId} status updated to ${nextStatus}!`)
        } catch (err) {
            console.error(err)
            toast.error('Failed to update status.')
        }
    }

    const handleReturnDecision = async (orderId: number, approved: boolean) => {
        try {
            await processReturn({ id: orderId, approved }).unwrap()
            toast.success(`Return request for Order #${orderId} ${approved ? 'Approved' : 'Rejected'}!`)
        } catch (err) {
            console.error(err)
            toast.error('Failed to process return decision.')
        }
    }

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        🏪 Seller & Admin Fulfillment Center
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage incoming orders, dispatch packages, update delivery statuses, and handle returns.
                    </Typography>
                </Box>
            </Box>

            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Buyer & Address</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Items</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Fulfillment Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} hover>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    #{order.id}<br/>
                                    <Typography variant="caption" color="text.secondary">
                                        {format(new Date(order.orderDate), 'dd/MM/yyyy')}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {order.buyerEmail}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {order.shippingAddress.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatAddressString(order.shippingAddress)}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    {order.orderItems.map((item, idx) => (
                                        <Typography key={idx} variant="body2">
                                            • {item.name || item.productName} <strong>× {item.quantity}</strong>
                                        </Typography>
                                    ))}
                                </TableCell>

                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    {currencyFormat(order.total)}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={order.orderStatus}
                                        size="small"
                                        color={
                                            order.orderStatus === 'Delivered'
                                                ? 'success'
                                                : order.orderStatus === 'ReturnRequested'
                                                ? 'warning'
                                                : order.orderStatus === 'Returned'
                                                ? 'secondary'
                                                : 'primary'
                                        }
                                    />
                                    {order.returnReason && (
                                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                            Return: {order.returnReason}
                                        </Typography>
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                        {order.orderStatus === 'Pending' || order.orderStatus === 'PaymentReceived' ? (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="info"
                                                disabled={isUpdating}
                                                onClick={() => handleAdvanceStatus(order.id, 'Processing')}
                                            >
                                                Mark Processing
                                            </Button>
                                        ) : order.orderStatus === 'Processing' ? (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<LocalShippingIcon />}
                                                disabled={isUpdating}
                                                onClick={() => handleAdvanceStatus(order.id, 'Shipped')}
                                            >
                                                Mark Shipped
                                            </Button>
                                        ) : order.orderStatus === 'Shipped' ? (
                                            isAdmin ? (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="warning"
                                                    disabled={isUpdating}
                                                    onClick={() => handleAdvanceStatus(order.id, 'OutForDelivery')}
                                                >
                                                    Out for Delivery
                                                </Button>
                                            ) : (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Chip label="Shipped" size="small" color="info" />
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        Handed to Courier
                                                    </Typography>
                                                </Box>
                                            )
                                        ) : order.orderStatus === 'OutForDelivery' ? (
                                            isAdmin ? (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<CheckCircleIcon />}
                                                    disabled={isUpdating}
                                                    onClick={() => handleAdvanceStatus(order.id, 'Delivered')}
                                                >
                                                    Mark Delivered
                                                </Button>
                                            ) : (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Chip label="Out for Delivery" size="small" color="warning" />
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        Courier En Route
                                                    </Typography>
                                                </Box>
                                            )
                                        ) : order.orderStatus === 'ReturnRequested' ? (
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    disabled={isProcessingReturn}
                                                    onClick={() => handleReturnDecision(order.id, true)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={isProcessingReturn}
                                                    onClick={() => handleReturnDecision(order.id, false)}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">
                                                Completed
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    )
}

export default SellerOrdersPage
