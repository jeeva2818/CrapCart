import type { Product } from '../../app/models/products'
import { useAddBasketItemMutation } from './catalogApi'
import { currencyFormat } from '../../lib/util'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography
} from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUserInfoQuery } from '../accounts/accountsApi'
import { toast } from 'react-toastify'

type Props = {
    product: Product
}

export default function ProductCard({ product }: Props) {
    const [addBasketItem, { isLoading }] = useAddBasketItemMutation()
    const { data: user } = useUserInfoQuery()
    const navigate = useNavigate()
    const location = useLocation()

    const handleAddToCart = () => {
        if (!user) {
            toast.info('Please sign in or create an account to add items to your cart!')
            navigate('/login', { state: { from: location } })
            return
        }

        addBasketItem({
            product,
            quantity: 1
        })
    }

    return (
        <Card
            elevation={3}
            sx={{
                width: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <CardMedia
                sx={{ height: 240, backgroundSize: 'cover' }}
                image={product.imageUrl}
            />

            <CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                        size="small"
                        disabled={isLoading}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>

                    <Button
                        component={Link}
                        to={`/catalog/${product.id}`}
                        size="small"
                    >
                        View Details
                    </Button>
                </CardActions>

                <Typography
                    gutterBottom
                    variant="subtitle2"
                    sx={{
                        color: 'secondary.main',
                        textTransform: 'uppercase'
                    }}
                >
                    {product.name}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{ color: 'secondary.main' }}
                >
                    {currencyFormat(product.price)}
                </Typography>
            </CardContent>
        </Card>
    )
}