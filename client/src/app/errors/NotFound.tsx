import { Button, Paper, Typography } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <Paper
        
            sx={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 6
            }}
            >
            <SearchOffIcon
    sx={{
        fontSize: 100,
        color: 'primary'
    }}
/>
        <Typography gutterBottom variant="h3">
            Oops, we could not find what you were looking for.
        </Typography>
        <Button
    fullWidth
    component={Link}
    to="/catalog"
>
    Go back to shop
</Button>
        
        </Paper>
    )
}