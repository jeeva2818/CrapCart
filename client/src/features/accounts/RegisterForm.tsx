
import { Container, Paper, Box, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegisterMutation } from './accountsApi'
import { registerSchema, type RegisterSchema } from '../../lib/schemas/registerSchema'

const RegisterForm = () => {
    const [registerUser, { isLoading }] = useRegisterMutation()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid }
    } = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'Buyer'
        }
    })

    const onSubmit = async (data: RegisterSchema) => {
    try {
        await registerUser(data).unwrap()
    } catch (error) {
    const apiError = error as { message: string }

    if (typeof apiError.message === 'string') {
        const errorArray = apiError.message.split(',')

        errorArray.forEach(e => {
            if (e.includes('Password')) {
                setError('password', { message: e })
            } else if (e.includes('Email')) {
                setError('email', { message: e })
            }
        })
    }
}
}
    return (
        <Container
            component={Paper}
            maxWidth="sm"
            sx={{ borderRadius: 3 }}
        >
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8
                }}
            >
                <LockOutlinedIcon
                    sx={{ mt: 3, color: 'secondary.main' }}
                    fontSize="large"
                />

                <Typography variant="h5">
                    Register
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        my: 3
                    }}
                >
                    <TextField
                        fullWidth
                        label="Email"
                        autoFocus
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Account Type:
                        </Typography>
                        <RadioGroup
                            row
                            defaultValue="Buyer"
                        >
                            <FormControlLabel
                                value="Buyer"
                                control={<Radio {...register('role')} defaultChecked value="Buyer" />}
                                label="🛒 Buyer (Customer)"
                            />
                            <FormControlLabel
                                value="Seller"
                                control={<Radio {...register('role')} value="Seller" />}
                                label="🏪 Seller (Merchant)"
                            />
                        </RadioGroup>
                    </Box>

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!isValid || isLoading}
                    >
                        Register
                    </Button>

                    <Typography sx={{ textAlign: 'center' }}>
                        Already have an account?
                    </Typography>

                    <Typography
                        component={Link}
                        to="/login"
                        color="primary"
                        sx={{ ml: 2 }}
                    >
                        Sign in
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default RegisterForm
