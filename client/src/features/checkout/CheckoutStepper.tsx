
import {
    Box,
    Button,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Checkbox,
    FormControlLabel,
    Typography
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    AddressElement,
    PaymentElement,
    useElements,
    useStripe
} from '@stripe/react-stripe-js'
import type { ConfirmationToken } from '@stripe/stripe-js'
import Review from './Review'
import {
    useFetchAddressQuery,
    useUpdateUserAddressMutation
} from '../accounts/accountsApi'
import type { Address } from '../../app/models/user'
import { useBasket } from '../../lib/hooks/useBasket'
import { currencyFormat } from '../../lib/util'
import { useCreateOrderMutation } from '../orders/orderApi'
import type { CreateOrder } from '../../app/models/order'

const steps = ['Full Address', 'Payment', 'Review']

const CheckoutStepper = () => {
    const [createOrder] = useCreateOrderMutation()
    const [activeStep, setActiveStep] = useState(0)
    const [saveAddressChecked, setSaveAddressChecked] = useState(false)

    const [addressComplete, setAddressComplete] = useState(false)
    const [paymentComplete, setPaymentComplete] = useState(false)

    const [confirmationToken, setConfirmationToken] =
        useState<ConfirmationToken | null>(null)

    const [submitting, setSubmitting] = useState(false)

    const [updateAddress] = useUpdateUserAddressMutation()

    const elements = useElements()
    const stripe = useStripe()
    const navigate = useNavigate()

    const { data, isLoading } = useFetchAddressQuery()

    let name: string | undefined
let restAddress: Omit<Address, 'name'> | undefined

if (data) {
    ({ name, ...restAddress } = data)
}
    const { basket, total, clearBasket } = useBasket()

    const getStripeAddress = async (): Promise<Address | null> => {
        if (!elements) {
            return null
        }

        const addressElement =
            elements.getElement(AddressElement)

        if (!addressElement) {
            return null
        }

        const { value } = await addressElement.getValue()

        const { name, address } = value

        if (name && address) {
            return {
                ...address,
                name
            }
        }

        return null
    }

    const createOrderModel = async (): Promise<CreateOrder> => {
        const shippingAddress = await getStripeAddress()

        const paymentSummary =
            confirmationToken?.payment_method_preview?.card

        if (!shippingAddress || !paymentSummary) {
            throw new Error('Problem creating order')
        }

        return {
            basketId: basket?.basketId,
            shippingAddress: {
                ...shippingAddress,
                postalCode: shippingAddress.postal_code ?? ''
            },
            paymentSummary: {
                last4: paymentSummary.last4 ?? '',
                brand: paymentSummary.brand ?? '',
                exp_month: paymentSummary.exp_month,
                exp_year: paymentSummary.exp_year
            }
        }
    }

    const confirmPayment = async () => {
        setSubmitting(true)

        try {
            if (!confirmationToken || !basket?.clientSecret) {
                throw new Error(
                    'Unable to process payment'
                )
            }

            const orderModel = await createOrderModel()
            const orderResult = await createOrder(orderModel).unwrap()

            const paymentResult =
                await stripe?.confirmPayment({
                    clientSecret:
                        basket.clientSecret,
                    redirect: 'if_required',
                    confirmParams: {
                        confirmation_token:
                            confirmationToken.id
                    }
                })

            if (
                paymentResult?.paymentIntent?.status ===
                'succeeded'
            ) {
                clearBasket()

                navigate('/checkout/success', {
                    state: orderResult
                })
            } else if (paymentResult?.error) {
                throw new Error(
                    paymentResult.error.message
                )
            } else {
                throw new Error(
                    'Something went wrong'
                )
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }

            setActiveStep(step => step - 1)
        } finally {
            setSubmitting(false)
        }
    }

    const handleBack = () => {
        setActiveStep(step => step - 1)
    }

    const handleAddressChange = (event: any) => {
        setAddressComplete(event.complete)
    }

    const handlePaymentChange = (event: any) => {
        setPaymentComplete(event.complete)
    }

    const handleNext = async () => {
        if (
            activeStep === 0 &&
            saveAddressChecked &&
            elements
        ) {
            const address = await getStripeAddress()

            if (address) {
                await updateAddress(address)
            }
        }

        if (activeStep === 1) {
            if (!elements || !stripe) {
                return
            }

            const result = await elements.submit()

            if (result.error) {
                toast.error(result.error.message)
                return
            }

            const stripeResult =
                await stripe.createConfirmationToken({
                    elements
                })

            if (stripeResult.error) {
                toast.error(
                    stripeResult.error.message
                )
                return
            }

            setConfirmationToken(
                stripeResult.confirmationToken
            )
        }

        if (activeStep === 2) {
            await confirmPayment()
            return
        }

        if (activeStep < 2) {
            setActiveStep(step => step + 1)
        }
    }

    if (isLoading) {
        return (
            <Typography variant="h6">
                Loading checkout...
            </Typography>
        )
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ mt: 2 }}>
                <Box
                    sx={{
                        display:
                            activeStep === 0
                                ? 'block'
                                : 'none'
                    }}
                >
                    <AddressElement
                        options={{
                            mode: 'shipping',
                            defaultValues: {
                                name,
                                address: restAddress
                            }
                        }}
                        onChange={
                            handleAddressChange
                        }
                    />

                    <FormControlLabel
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                        control={
                            <Checkbox
                                checked={
                                    saveAddressChecked
                                }
                                onChange={e =>
                                    setSaveAddressChecked(
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="Save as default address"
                    />
                </Box>

                <Box
                    sx={{
                        display:
                            activeStep === 1
                                ? 'block'
                                : 'none'
                    }}
                >
                    <PaymentElement
                        onChange={
                            handlePaymentChange
                        }
                        options={{
                            wallets: {
                                applePay: 'never',
                                googlePay: 'never'
                            }
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display:
                            activeStep === 2
                                ? 'block'
                                : 'none'
                    }}
                >
                    <Review
                        confirmationToken={
                            confirmationToken
                        }
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    pt: 2,
                    justifyContent: 'space-between'
                }}
            >
                <Button
                    onClick={handleBack}
                    disabled={activeStep === 0 || submitting}
                >
                    Back
                </Button>

                <LoadingButton
                    onClick={handleNext}
                    loading={submitting}
                    disabled={
                        (activeStep === 0 &&
                            !addressComplete) ||
                        (activeStep === 1 &&
                            !paymentComplete)
                    }
                >
                    {activeStep === steps.length - 1
                        ? `Pay ${currencyFormat(total)}`
                        : 'Next'}
                </LoadingButton>
            </Box>
        </Paper>
    )
}

export default CheckoutStepper
