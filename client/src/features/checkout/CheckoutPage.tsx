import { Grid, Typography } from '@mui/material'
import OrderSummary from '../../app/shared/components/OrderSummary'
import CheckoutStepper from './CheckoutStepper'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useMemo, useRef } from 'react'
import { useFetchBasketQuery } from '../../features/catalog/catalogApi'
import { useCreatePaymentIntentMutation } from './checkoutApi'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

const CheckoutPage = () => {
    useFetchBasketQuery()

const [createPaymentIntent, { data: paymentIntent, isLoading }] =
    useCreatePaymentIntentMutation()

const created = useRef(false)

    useEffect(() => {
    if (!created.current) {
        createPaymentIntent()
        created.current = true
    }
}, [createPaymentIntent])


    const options = useMemo(() => {
    if (!paymentIntent?.clientSecret) return undefined

    return {
        clientSecret: paymentIntent.clientSecret
    }
}, [paymentIntent?.clientSecret])

    return (
        <Grid container spacing={2}>
            <Grid size={8}>
                {!stripePromise || !options || isLoading ? (
                    <Typography variant="h6">
                        Loading checkout...
                    </Typography>
                ) : (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutStepper />
                    </Elements>
                )}
            </Grid>

            <Grid size={4}>
                <OrderSummary />
            </Grid>
        </Grid>
    )
}

export default CheckoutPage