import { AppBar, styled, Typography, Badge, Avatar, /*InputBase,*/ Menu, MenuItem, IconButton, Box, Drawer, ListItem, ListItemButton, ListItemIcon, Switch, ListItemText, Divider, Button } from "@mui/material";
import React, { useState } from "react";
import NightShelterIcon from '@mui/icons-material/NightShelter';
import { AccountBalanceWalletSharp, AppRegistration, DarkMode, DevicesOther, Groups2, Home, Login, Mail, Notifications, QuestionMark } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { Stack } from "@mui/system";
import { theme } from "../../theme";
import { ThemeProvider } from "@emotion/react";
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
})

// const Search = styled("div")(({ theme }) => ({
//     backgroundColor: "white",
//     padding: "0 10px",
//     borderRadius: theme.shape.borderRadius,
//     width: "40%"
// }));

const Icons = styled("div")(({ theme }) => ({
    display: 'none',
    gap: '20px',
    alignItems: 'center',
    [theme.breakpoints.up("sm")]: {
        display: 'flex'
    }
}));

// const UserBox = styled("div")(({ theme }) => ({
//     display: 'flex',
//     gap: '20px',
//     alignItems: 'center',
//     [theme.breakpoints.up("sm")]: {
//         display: 'none'
//     }
// }));


const NavegationBar = ({
    mode,
    setMode,
    currentPage,
    setCurrentPage,
    page1,
    page2,
    page3,
    page4,
    page5
}) => {

    const [open, setOpen] = useState(false)

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <ThemeProvider theme={theme}>

            <AppBar position="sticky">
                <StyledToolbar>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        component="nav"
                        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
                        aria-label="mailbox folders"
                    >
                        <Drawer
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            <div>
                                <List>

                                    <ListItem disablePadding>
                                        <ListItemButton component='a'>
                                            <ListItemIcon>
                                                <DarkMode />
                                            </ListItemIcon>
                                            <Switch onChange={event => setMode(mode === "light" ? "dark" : "light")} />
                                        </ListItemButton>
                                    </ListItem>

                                    <Divider />

                                    <ListItem disablePadding>
                                        <ListItemButton component='a' href='#login'>
                                            <ListItemIcon>
                                                <Login />
                                            </ListItemIcon>
                                            <ListItemText primary="Iniciar sesion" />
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton component='a' href='#registration'>
                                            <ListItemIcon>
                                                <AppRegistration />
                                            </ListItemIcon>
                                            <ListItemText primary="Registrarse" />
                                        </ListItemButton>
                                    </ListItem>

                                    <Divider />

                                    <ListItem disablePadding>
                                        <ListItemButton
                                            component='a'
                                            href='#home'
                                            onClick={() => setCurrentPage(page1)}
                                        >
                                            <ListItemIcon>
                                                <Home />
                                            </ListItemIcon>
                                            <ListItemText primary="Home" />
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton
                                            component='a'
                                            href='#howItWorks'
                                            onClick={() => setCurrentPage(page2)}
                                        >
                                            <ListItemIcon>
                                                <QuestionMark />
                                            </ListItemIcon>
                                            <ListItemText primary="Como funciona" />
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton
                                            component='a'
                                            href='#supportedDevices'
                                            onClick={() => setCurrentPage(page3)}
                                        >
                                            <ListItemIcon>
                                                <DevicesOther />
                                            </ListItemIcon>
                                            <ListItemText primary="Dispositivos soportados" />
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton
                                            component='a'
                                            href='#billingPlans'
                                            onClick={() => setCurrentPage(page4)}
                                        >
                                            <ListItemIcon>
                                                <AccountBalanceWalletSharp />
                                            </ListItemIcon>
                                            <ListItemText primary="Planes de pago" />
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton
                                            component='a'
                                            href='#meetTheTeam'
                                            onClick={() => setCurrentPage(page5)}
                                        >
                                            <ListItemIcon>
                                                <Groups2 />
                                            </ListItemIcon>
                                            <ListItemText primary="Conoce al equipo" />
                                        </ListItemButton>
                                    </ListItem>

                                </List>

                            </div>

                        </Drawer>
                    </Box>

                    {/* <Search><InputBase 
                placeholder="buscar..."/>
                </Search> */}
                    <Typography
                        sx={{ display: { xs: "none", sm: "block" } }}
                        variant='h4'
                        onClick={() => setCurrentPage(page1)}
                    >
                        Sweet Dreams
                    </Typography>
                    <NightShelterIcon
                        sx={{ display: { xs: "block", sm: "none" } }}
                        onClick={() => setCurrentPage(page1)}
                    />

                    <LoginIcon
                        sx={{ display: { xs: "block", sm: "none" } }}
                        onClick={() => setCurrentPage(page1)}
                    />

                    <AppRegistrationIcon
                        sx={{ display: { xs: "block", sm: "none" } }}
                        onClick={() => setCurrentPage(page1)}
                    />

                    <Icons>
                        {/* <Badge badgeContent={4} color="error"><Mail /></Badge>
                    <Badge badgeContent={2} color="error"><Notifications /></Badge>
                    <Typography>Lisa</Typography>
                    <Badge>
                        <Avatar sx={{ width: 30, height: 30 }} src='https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                            onClick={event => setOpen(true)}
                        />
                    </Badge> */}
                        <Button
                            variant="text"
                            color='lightFont'
                        >
                            Iniciar sesion
                        </Button>
                        <Button
                            variant="outlined"
                            color='lightFont'
                        >
                            Registrarse
                        </Button>
                    </Icons>
                    {/* <UserBox>
                    <Badge>
                        <Avatar sx={{ width: 30, height: 30 }} src='https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                            onClick={event => setOpen(true)}
                        />
                    </Badge>
                </UserBox> */}
                    <Divider />
                </StyledToolbar>
                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    open={open}
                    onClose={(event) => setOpen(false)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                </Menu>
            </AppBar>
        </ThemeProvider>

    )
}

export default NavegationBar;