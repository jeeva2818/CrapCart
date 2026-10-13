import { Container, Paper, Typography, Divider } from '@mui/material'
import { useLocation } from 'react-router'

export default function ServerError() {
    const { state } = useLocation()
    return (
        <Container>
            <Paper>
    {state?.error ? (
        <>
            <Typography
                gutterBottom
                variant="h3"
                sx={{ pl: 4, pr: 4, pt: 2 }}
                color="secondary"
            >
                {state.error.title}
            </Typography>
            <Divider />
            <Typography
    variant="body1"
    sx={{ p: 4 }}
>
    {state.error.detail}
</Typography>
        </>
    ) : (
        <Typography gutterBottom variant="h5">
            Server Error
        </Typography>
    )}
</Paper>
        </Container>
    )
}