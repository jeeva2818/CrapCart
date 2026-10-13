import { Button, Paper, Typography } from '@mui/material'
import type { BasketItem as BasketItemModel } from '../../app/models/basket'
import {
    useAddBasketItemMutation,
    useRemoveBasketItemMutation
} from '../catalog/catalogApi'
import { currencyFormat } from '../../lib/util'

type Props = {
    item: BasketItemModel
}

export default function BasketItem({ item }: Props) {
    const [removeBasketItem] = useRemoveBasketItemMutation()
    const [addBasketItem] = useAddBasketItemMutation()

    return (
        <Paper
            sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <div>
                <Typography variant="h6">
                    {item.name}
                </Typography>

                <Typography>
                    Price: {currencyFormat(item.price)}
                </Typography>

                <Typography>
                    Quantity: {item.quantity}
                </Typography>

                <Typography>
                    Item total: {currencyFormat(item.price * item.quantity)}
                </Typography>
            </div>

            <div>
                <Button
                    onClick={() =>
                        removeBasketItem({
                            productId: item.productId,
                            quantity: 1
                        })
                    }
                >
                    −
                </Button>

                <Button
                    onClick={() =>
                        addBasketItem({
                            product: item,
                            quantity: 1
                        })
                    }
                >
                    +
                </Button>

                <Button
                    onClick={() =>
                        removeBasketItem({
                            productId: item.productId,
                            quantity: item.quantity
                        })
                    }
                >
                    X
                </Button>
            </div>
        </Paper>
    )
}