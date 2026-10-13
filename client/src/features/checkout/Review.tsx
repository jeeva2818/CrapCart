import {
    Box,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material'
import type { ConfirmationToken } from '@stripe/stripe-js'
import { currencyFormat } from '../../lib/util'
import { useBasket } from '../../lib/hooks/useBasket'

type Props = {
    confirmationToken: ConfirmationToken | null
}

const Review = ({ confirmationToken }: Props) => {
    const { basket } = useBasket()

    const addressString = () => {
    if (!confirmationToken?.shipping?.address) {
        return ''
    }

    const { name, address } = confirmationToken.shipping

    return `${name}, ${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`
}

    const paymentString = () => {
        if (!confirmationToken?.payment_method_preview?.card) {
            return ''
        }

        const { card } =
            confirmationToken.payment_method_preview

        return `${card.brand.toUpperCase()}, **** **** **** ${card.last4}, exp ${card.exp_month}/${card.exp_year}`
    }

    return (
        <Box sx={{ mt: 4, width: '100%' }}>
            <Typography
                variant="h6"
                sx={{ fontWeight: 'bold' }}
            >
                Billing and delivery information
            </Typography>

            <dl>
                <Typography
                    component="dt"
                    sx={{
                        mt: 1,
                        color: 'secondary.main',
                        fontWeight: 'medium'
                    }}
                >
                    Shipping address
                </Typography>

                <Typography
                    component="dd"
                    sx={{
                        mt: 1,
                        color: 'text.secondary'
                    }}
                >
                    {addressString()}
                </Typography>

                <Typography
                    component="dt"
                    sx={{
                        mt: 1,
                        color: 'secondary.main',
                        fontWeight: 'medium'
                    }}
                >
                    Payment details
                </Typography>

                <Typography
                    component="dd"
                    sx={{
                        mt: 1,
                        color: 'text.secondary'
                    }}
                >
                    {paymentString()}
                </Typography>
            </dl>

            <Box sx={{ mt: 6, mx: 'auto' }}>
                <Divider />

                <TableContainer>
                    <Table>
                        <TableBody>
                            {basket?.items.map(item => (
                                <TableRow
                                    key={item.productId}
                                    sx={{
                                        borderBottom:
                                            '1px solid rgba(224, 224, 224, 1)'
                                    }}
                                >
                                    <TableCell sx={{ py: 4 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 3
                                            }}
                                        >
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                style={{
                                                    width: 40,
                                                    height: 40
                                                }}
                                            />

                                            <Typography>
                                                {item.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{ p: 4 }}
                                    >
                                        x {item.quantity}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{ p: 4 }}
                                    >
                                        {currencyFormat(item.price)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

export default Review