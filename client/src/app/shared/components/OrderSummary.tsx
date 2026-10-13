import {
    Box,
    Typography,
    Divider,
    Button,
    TextField,
    Paper
} from "@mui/material";
import { currencyFormat } from "../../../lib/util";
import { Link, useLocation } from 'react-router-dom';
import { useBasket } from "../../../lib/hooks/useBasket";
import {
    useAddCouponMutation,
    useRemoveCouponMutation
} from "../../../features/catalog/catalogApi";
import { useForm } from "react-hook-form";

interface VoucherForm {
    code: string;
}

export default function OrderSummary() {
    const location = useLocation();

    const {
        basket,
        subtotal,
        discount,
        deliveryFee,
        total
    } = useBasket();

    const [addCoupon] = useAddCouponMutation();
    const [removeCoupon] = useRemoveCouponMutation();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<VoucherForm>();

    const onSubmit = async (data: VoucherForm) => {
        try {
            await addCoupon(data.code).unwrap();
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveCoupon = async () => {
        try {
            await removeCoupon().unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 'lg',
                mx: 'auto'
            }}
        >
            <Paper
                sx={{
                    mb: 2,
                    p: 3,
                    width: '100%',
                    borderRadius: 3
                }}
            >
                <Typography
                    variant="h6"
                    component="p"
                    sx={{ fontWeight: 'bold' }}
                >
                    Order summary
                </Typography>

                <Typography
                    variant="body2"
                    sx={{ fontStyle: 'italic' }}
                >
                    Orders over $100 qualify for free delivery!
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1
                        }}
                    >
                        <Typography color="textSecondary">
                            Subtotal
                        </Typography>

                        <Typography>
                            {currencyFormat(subtotal)}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1
                        }}
                    >
                        <Typography color="textSecondary">
                            Discount
                        </Typography>

                        <Typography color="success.main">
                            -{currencyFormat(discount)}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1
                        }}
                    >
                        <Typography color="textSecondary">
                            Delivery fee
                        </Typography>

                        <Typography>
                            {currencyFormat(deliveryFee)}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1
                        }}
                    >
                        <Typography color="textSecondary">
                            Total
                        </Typography>

                        <Typography>
                            {currencyFormat(total)}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    {!location.pathname.includes('checkout') && (
                        <Button
                            component={Link}
                            to="/checkout"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mb: 1 }}
                        >
                            Checkout
                        </Button>
                    )}

                    <Button
                        component={Link}
                        to="/catalog"
                        fullWidth
                    >
                        Continue Shopping
                    </Button>
                </Box>
            </Paper>

            <Paper
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    p: 3
                }}
            >
                {basket?.coupon ? (
                    <>
                        <Typography variant="subtitle1">
                            Applied voucher
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 2
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {basket.coupon.promotionCode}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    {basket.coupon.percentOff
                                        ? `${basket.coupon.percentOff}% off`
                                        : `${currencyFormat(
                                            basket.coupon.amountOff
                                                ? basket.coupon.amountOff / 100
                                                : 0
                                        )} off`}
                                </Typography>
                            </Box>

                            <Button
                                color="error"
                                onClick={handleRemoveCoupon}
                            >
                                Remove
                            </Button>
                        </Box>
                    </>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography
                            variant="subtitle1"
                            component="label"
                        >
                            Do you have a voucher code?
                        </Typography>

                        <TextField
                            {...register('code', {
                                required: true
                            })}
                            label="Voucher code"
                            variant="outlined"
                            fullWidth
                            sx={{ my: 2 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Apply code
                        </Button>
                    </form>
                )}
            </Paper>
        </Box>
    );
}