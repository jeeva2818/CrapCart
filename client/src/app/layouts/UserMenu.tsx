import { useState } from 'react'
import {
    Button,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import HistoryIcon from '@mui/icons-material/History'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import LogoutIcon from '@mui/icons-material/Logout'
import { Link } from 'react-router-dom'
import type { User } from '../models/user'
import { useLogoutMutation } from '../../features/accounts/accountsApi'

type Props = {
    user: User
}

const UserMenu = ({ user }: Props) => {
    const [logOut] = useLogoutMutation()
    const [anchorEl, setAnchorEl] =
        useState<null | HTMLElement>(null)

    const open = Boolean(anchorEl)

    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <Button
                onClick={handleClick}
                color="inherit"
                size="large"
                sx={{ fontSize: '1.1rem' }}
            >
                {user.email}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem
                    component={Link}
                    to="/orders"
                    onClick={handleClose}
                >
                    <ListItemIcon>
                        <HistoryIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>
                        My Orders
                    </ListItemText>
                </MenuItem>

                {(user.roles?.some(r => r.toLowerCase() === 'seller' || r.toLowerCase() === 'admin')) && (
                    <MenuItem
                        component={Link}
                        to="/seller/orders"
                        onClick={handleClose}
                    >
                        <ListItemIcon>
                            <LocalShippingIcon fontSize="small" />
                        </ListItemIcon>

                        <ListItemText>
                            Seller Fulfillment
                        </ListItemText>
                    </MenuItem>
                )}

                {(user.roles?.some(r => r.toLowerCase() === 'seller' || r.toLowerCase() === 'admin')) && (
                    <MenuItem
                        component={Link}
                        to="/inventory"
                        onClick={handleClose}
                    >
                        <ListItemIcon>
                            <InventoryIcon fontSize="small" />
                        </ListItemIcon>

                        <ListItemText>
                            Inventory
                        </ListItemText>
                    </MenuItem>
                )}

                <Divider />

                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>
                        My Profile
                    </ListItemText>
                </MenuItem>

                <MenuItem onClick={() => logOut()}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>
                        Log out
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}

export default UserMenu