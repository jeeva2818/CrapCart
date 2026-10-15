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
    Box,
    Alert
} from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { useNavigate } from 'react-router-dom'
import { useFetchOrdersQuery, useUpdateOrderStatusMutation } from './orderApi'
import { useUserInfoQuery } from '../accounts/accountsApi'
import { currencyFormat } from '../../lib/util'
import { format } from 'date-fns'
import { generateAndPrintInvoice } from '../../lib/invoiceGenerator'
import { toast } from 'react-toastify'

const OrdersPage = () => {
    const { data: orders, isLoading } = useFetchOrdersQuery()
    const { data: user } = useUserInfoQuery()
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()
    const navigate = useNavigate()

    const isSeller = user?.roles?.some(r => r.toLowerCase() === 'seller')
    const isAdmin = user?.roles?.some(r => r.toLowerCase() === 'admin')
    const isSellerOrAdmin = isSeller || isAdmin

    const handleAdvanceStatus = async (e: React.MouseEvent, orderId: number, nextStatus: string) => {
        e.stopPropagation()
        try {
            await updateStatus({ id: orderId, status: nextStatus }).unwrap()
            toast.success(`Order #${orderId} status updated to ${nextStatus}!`)
        } catch (err) {
            console.error(err)
            toast.error('Failed to update status.')
        }
    }

    if (isLoading) {
        return (
            <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>
                Loading orders...
            </Typography>
        )
    }

    if (!orders || orders.length === 0) {
        return (
            <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>
                No orders available
            </Typography>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            {isSellerOrAdmin && (
                <Alert
                    severity="info"
                    icon={<StorefrontIcon fontSize="inherit" />}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            variant="outlined"
                            onClick={() => navigate('/seller/orders')}
                        >
                            Open Fulfillment Center
                        </Button>
                    }
                    sx={{ mb: 3, alignItems: 'center' }}
                >
                    <strong>Seller/Admin Mode:</strong> You can update fulfillment statuses (Processing / Shipped) directly below or access the dedicated Fulfillment Center.
                </Alert>
            )}

            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
            >
                {isSellerOrAdmin ? 'Order Management' : 'My Orders'}
            </Typography>

            <Paper
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: 3
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                                Order #
                            </TableCell>

                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                Date
                            </TableCell>

                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                Buyer
                            </TableCell>

                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                Total
                            </TableCell>

                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                Status
                            </TableCell>

                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orders.map(order => (
                            <TableRow
                                key={order.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell align="center" onClick={() => navigate(`/orders/${order.id}`)} sx={{ fontWeight: 'bold' }}>
                                    #{order.id}
                                </TableCell>

                                <TableCell onClick={() => navigate(`/orders/${order.id}`)}>
                                    {format(
                                        new Date(order.orderDate),
                                        'dd/MM/yyyy'
                                    )}
                                </TableCell>

                                <TableCell onClick={() => navigate(`/orders/${order.id}`)}>
                                    <Typography variant="body2">{order.buyerEmail}</Typography>
                                </TableCell>

                                <TableCell onClick={() => navigate(`/orders/${order.id}`)} sx={{ fontWeight: 'bold' }}>
                                    {currencyFormat(order.total)}
                                </TableCell>

                                <TableCell onClick={() => navigate(`/orders/${order.id}`)}>
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
                                </TableCell>

                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                        >
                                            View
                                        </Button>

                                        {/* Inline Seller/Admin Fulfillment Actions */}
                                        {isSellerOrAdmin && (
                                            <>
                                                {(order.orderStatus === 'Pending' || order.orderStatus === 'PaymentReceived') && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="info"
                                                        disabled={isUpdating}
                                                        onClick={(e) => handleAdvanceStatus(e, order.id, 'Processing')}
                                                    >
                                                        Mark Processing
                                                    </Button>
                                                )}

                                                {order.orderStatus === 'Processing' && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<LocalShippingIcon fontSize="small" />}
                                                        disabled={isUpdating}
                                                        onClick={(e) => handleAdvanceStatus(e, order.id, 'Shipped')}
                                                    >
                                                        Mark Shipped
                                                    </Button>
                                                )}

                                                {isAdmin && order.orderStatus === 'Shipped' && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="warning"
                                                        disabled={isUpdating}
                                                        onClick={(e) => handleAdvanceStatus(e, order.id, 'OutForDelivery')}
                                                    >
                                                        Out for Delivery
                                                    </Button>
                                                )}

                                                {isAdmin && order.orderStatus === 'OutForDelivery' && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<CheckCircleIcon fontSize="small" />}
                                                        disabled={isUpdating}
                                                        onClick={(e) => handleAdvanceStatus(e, order.id, 'Delivered')}
                                                    >
                                                        Mark Delivered
                                                    </Button>
                                                )}
                                            </>
                                        )}

                                        {order.orderStatus === 'Delivered' && (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    generateAndPrintInvoice(order)
                                                }}
                                            >
                                                Invoice
                                            </Button>
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

export default OrdersPage