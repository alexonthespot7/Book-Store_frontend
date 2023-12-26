import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import { Link } from 'react-router-dom';

export default function MenuDrawer({ DrawerHeader, matches400px, menuDrawerOpen, setMenuDrawerOpen }) {
    const drawerWidth = matches400px ? 300 : '100%';

    const isAdmin = sessionStorage.getItem('role') === 'ADMIN';

    const handleDrawerClose = () => {
        setMenuDrawerOpen(false);
    }

    const setLink = (value) => {
        if (value === 'Books') {
            return '/';
        } else if (value === 'Categories') {
            return '/categories';
        } else if (value === 'Users') {
            return '/userlist';
        } else if (value === 'By Categories') {
            return '/bycategories';
        } else if (value === 'Orders') {
            return '/orders';
        }
    }

    const adminPages = isAdmin ? ['Categories', 'Users', 'Orders'] : [];
    const publicPages = ['Books', 'By Categories'];

    return (
        <Drawer
            transitionDuration={500}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            anchor="left"
            open={menuDrawerOpen}
            onClose={handleDrawerClose}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {<ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {publicPages.map((page, index) => (
                    <ListItem key={index} onClick={handleDrawerClose} component={Link} to={setLink(page)} >
                        <ListItemIcon>
                            {index === 0 && <MenuBookIcon color='sidish' />}
                            {index === 1 && <CategoryIcon color='sidish' />}
                        </ListItemIcon>
                        <ListItemText primary={page} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {adminPages.map((page, index) => (
                    <ListItem key={index} onClick={handleDrawerClose} component={Link} to={setLink(page)} >
                        <ListItemIcon>
                            {index === 0 && <CategoryIcon color='sidish' />}
                            {index === 1 && <GroupIcon color='sidish' />}
                            {index === 2 && <MonetizationOnIcon color='sidish' />}
                        </ListItemIcon>
                        <ListItemText primary={page} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}