
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
    Typography
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { useFetchOrderDetailsQuery } from './orderApi'
import {
    currencyFormat,
    formatAddressString,
    formatPaymentString
} from '../../lib/util'

const OrderDetailsPage = () => {
    const { id } = useParams()

    const {
        data: order,
        isLoading
    } = useFetchOrderDetailsQuery(Number(id))

    if (isLoading) {
        return (
            <Typography variant="h5">
                Loading order...
            </Typography>
        )
    }

    if (!order) {
        return (
            <Typography variant="h5">
                Order not found
            </Typography>
        )
    }

    return (
        <Card
            sx={{
                p: 2,
                maxWidth: 'md',
                mx: 'auto'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Typography
                    variant="h5"
                    align="center"
                >
                    Order summary for #{order.id}
                </Typography>

                <Button
                    component={Link}
                    to="/orders"
                    variant="outlined"
                >
                    Back to orders
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold' }}
                >
                    Billing and delivery information
                </Typography>

                <Box component="dl">
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        sx={{ fontWeight: 500 }}
                    >
                        Shipping address
                    </Typography>

                    <Typography
                        component="dd"
                        variant="body2"
                        sx={{
                            fontWeight: 300,
                            m: 0
                        }}
                    >
                        {formatAddressString(order.shippingAddress)}
                    </Typography>

                    <Typography
                        component="dt"
                        variant="subtitle1"
                        sx={{ fontWeight: 500 }}
                    >
                        Payment info
                    </Typography>

                    <Typography
                        component="dd"
                        variant="body2"
                        sx={{
                            fontWeight: 300,
                            m: 0
                        }}
                    >
                        {formatPaymentString(order.paymentSummary)}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold' }}
                >
                    Order details
                </Typography>

                <Box component="dl">
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        sx={{ fontWeight: 500 }}
                    >
                        Email address
                    </Typography>

                    <Typography
                        component="dd"
                        variant="body2"
                        sx={{
                            fontWeight: 300,
                            m: 0
                        }}
                    >
                        {order.buyerEmail}
                    </Typography>

                    <Typography
                        component="dt"
                        variant="subtitle1"
                        sx={{ fontWeight: 500 }}
                    >
                        Order status
                    </Typography>

                    <Typography
                        component="dd"
                        variant="body2"
                        sx={{
                            fontWeight: 300,
                            m: 0
                        }}
                    >
                        {order.orderStatus}
                    </Typography>

                    <Typography
                        component="dt"
                        variant="subtitle1"
                        sx={{ fontWeight: 500 }}
                    >
                        Order date
                    </Typography>

                    <Typography
                        component="dd"
                        variant="body2"
                        sx={{
                            fontWeight: 300,
                            m: 0
                        }}
                    >
                        {format(
                            new Date(order.orderDate),
                            'dd/MM/yyyy'
                        )}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">
                                Quantity
                            </TableCell>
                            <TableCell align="right">
                                Price
                            </TableCell>
                            <TableCell align="right">
                                Total
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {order.orderItems.map(item => (
                            <TableRow key={item.productId}>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={item.pictureUrl}
                                            alt={item.name}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                objectFit: 'contain'
                                            }}
                                        />

                                        <Typography>
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell align="center">
                                    {item.quantity}
                                </TableCell>

                                <TableCell align="right">
                                    {currencyFormat(item.price)}
                                </TableCell>

                                <TableCell align="right">
                                    {currencyFormat(
                                        item.price *
                                        item.quantity
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mx: 3
                    }}
                >
                    <Typography>Subtotal</Typography>

                    <Typography>
                        {currencyFormat(order.subtotal)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mx: 3
                    }}
                >
                    <Typography>Discount</Typography>

                    <Typography
                        sx={{ color: 'green' }}
                    >
                        {currencyFormat(order.discount)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mx: 3
                    }}
                >
                    <Typography>
                        Delivery fee
                    </Typography>

                    <Typography>
                        {currencyFormat(
                            order.deliveryFee
                        )}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mx: 3
                    }}
                >
                    <Typography
                        sx={{ fontWeight: 700 }}
                    >
                        Total
                    </Typography>

                    <Typography
                        sx={{ fontWeight: 700 }}
                    >
                        {currencyFormat(order.total)}
                    </Typography>
                </Box>
            </Box>
        </Card>
    )
}

export default OrderDetailsPage
