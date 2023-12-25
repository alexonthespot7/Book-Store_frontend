import { useContext } from 'react';

import { Button, Divider, Drawer } from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import AuthContext from '../../context/AuthContext';
import CartMenu from '../CartMenu';


export default function CartMenuDrawer({ DrawerHeader, matchesFirstSize }) {
    const { cartDrawerOpen, setCartDrawerOpen } = useContext(AuthContext);

    const secondDrawerWidth = matchesFirstSize ? 350 : '100%';

    return (
        <Drawer
            transitionDuration={1000}
            sx={{
                width: secondDrawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: secondDrawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            anchor="right"
            open={cartDrawerOpen}
            onClose={() => setCartDrawerOpen(false)}
        >
            <DrawerHeader sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button color='sidish' onClick={() => setCartDrawerOpen(false)}>
                    <ChevronLeftIcon color='sidish' />
                    Continue Shopping
                </Button>
            </DrawerHeader>
            <Divider />
            <CartMenu />
        </Drawer>
    );
}