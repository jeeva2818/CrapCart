import { Container, Paper, Box, Typography, TextField, Button } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginSchema } from '../../lib/schemas/loginSchema'
import { useLazyUserInfoQuery, useLoginMutation } from './accountsApi'

const LoginForm = () => {
    const [login, { isLoading }] = useLoginMutation()
    const navigate = useNavigate()
    const location = useLocation()
    const [fetchUserInfo] = useLazyUserInfoQuery()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginSchema) => {
        try {
            await login(data).unwrap()
            await fetchUserInfo().unwrap()
            const destination = location.state?.from?.pathname || location.state?.from || '/catalog'
            navigate(destination)
        } catch (error) {
            console.error('Login error:', error)
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
                    Sign in
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

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                    >
                        Sign in
                    </Button>

                    <Typography sx={{ textAlign: 'center' }}>
                        Don't have an account?
                        <Typography
                            component={Link}
                            to="/register"
                            color="primary"
                            sx={{ ml: 2 }}
                        >
                            Sign up
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default LoginForm