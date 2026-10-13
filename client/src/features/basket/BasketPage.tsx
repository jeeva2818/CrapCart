import { Container, Typography } from '@mui/material'
import { useFetchBasketQuery } from '../catalog/catalogApi'
import BasketItem from './BasketItem'
import OrderSummary from '../../app/shared/components/OrderSummary'

export default function BasketPage() {
    const { data: basket, isLoading } = useFetchBasketQuery()

    if (isLoading) {
        return <Typography>Loading basket...</Typography>
    }

    if (!basket || basket.items.length === 0) {
        return <Typography variant="h3">Your basket is empty</Typography>
    }

    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Your basket
            </Typography>

            {basket.items.map(item => (
                <BasketItem
                    key={item.productId}
                    item={item}
                />
            ))}

            <OrderSummary />
        </Container>
    )
}