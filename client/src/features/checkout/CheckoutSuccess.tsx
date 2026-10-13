import {
    Box,
    Button,
    Container,
    Divider,
    Paper,
    Typography
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import type { Order } from '../../app/models/order'
import {
    currencyFormat,
    formatAddressString,
    formatPaymentString
} from '../../lib/util'

const CheckoutSuccess = () => {
    const { state } = useLocation()
    const order = state as Order | undefined

    if (!order) {
        return (
            <Typography>
                Problem accessing the order.
            </Typography>
        )
    }

    return (
        <Container maxWidth="md">
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
            >
                Thanks for your fake order!
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
            >
                Your order <strong>#{order.id}</strong> will
                never be processed as this is a fake shop.
            </Typography>

            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Order date
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {order.orderDate}
                    </Typography>
                </Box>

                <Divider />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Payment method
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {formatPaymentString(order.paymentSummary)}
                    </Typography>
                </Box>

                <Divider />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Shipping address
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 'bold',
                            whiteSpace: 'pre-line'
                        }}
                    >
                        {formatAddressString(order.shippingAddress)}
                    </Typography>
                </Box>

                <Divider />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Amount
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {currencyFormat(order.total)}
                    </Typography>
                </Box>
            </Paper>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: 2
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/orders/${order.id}`}
                >
                    View your order
                </Button>

                <Button
                    component={Link}
                    to="/catalog"
                    variant="outlined"
                    color="primary"
                >
                    Continue shopping
                </Button>
            </Box>
        </Container>
    )
}

export default CheckoutSuccess