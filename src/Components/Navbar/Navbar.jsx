import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link as ScrollToLink, animateScroll as scroll } from 'react-scroll';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import logo_black from '../../assets/logo_black.png';
import { Button, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Tooltip, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartRounded } from '@mui/icons-material';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import Orders from '../Cart/Orders/Orders';

function ScrollTop(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = () => {
        scroll.scrollToTop({
            duration: 500,
            smooth: true,
        });
    }

    return (
        <Fade in={trigger}>
            <Box onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 20, right: 16 }}>
                {children}
            </Box>
        </Fade>
    );
}

function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

const Links = ({ drawer, setIsOpenDrawer, isOpenDrawer }) => {
    const location = useLocation();
    const { pathname } = location;

    class LinkClass {
        constructor(id, linkName) {
            this.id = id;
            this.linkName = linkName;
        }
    }

    const pageLink = [new LinkClass(0, 'Home'), new LinkClass(1, 'About'), new LinkClass(2, 'Categories')];
    const componentsLink = [new LinkClass('services', 'Services'), new LinkClass('footer', 'Contact')]

    return drawer ? (
        <List sx={{ mt: 1.5 }}>
            {pageLink.map(link => (
                <Link to={`/${link.linkName.toLowerCase()}`} key={link.id}>
                    <ListItem sx={{ minWidth: '12rem' }} disablePadding>
                        <ListItemButton
                            onClick={() => setIsOpenDrawer(!isOpenDrawer)}
                            sx={{ ":hover": { bgcolor: '#E0F3D7' } }}>
                            <ListItemText sx={{ marginLeft: '0.4rem' }} primary={link.linkName} />
                        </ListItemButton>
                    </ListItem>
                </Link>
            ))}
            {componentsLink.map((link, i) => (
                <ScrollToLink
                    to={link.id}
                    key={i}
                    smooth={true}
                    spy={true}
                    offset={-70}
                    duration={80}>
                    <ListItem
                        disabled={link.id !== 'footer' && pathname !== '/' && pathname !== '/home'}
                        sx={{ minWidth: '12rem' }}
                        disablePadding>
                        <ListItemButton
                            onClick={() => setIsOpenDrawer(!isOpenDrawer)}
                            sx={{ ":hover": { bgcolor: '#E0F3D7' } }}>
                            <ListItemText sx={{ marginLeft: '0.4rem' }} primary={link.linkName} />
                        </ListItemButton>
                    </ListItem>
                </ScrollToLink>
            ))}
        </List>
    ) : (
        <ul className='flex p-0 sm:space-x-8 space-x-5 text-black'>
            {pageLink.map(li => (
                <Link to={`/${li.linkName.toLowerCase()}`} key={li.id}>
                    <li className='sm:text-base hover:text-gray-800 hover:scale-[0.99] text-sm'>
                        {li.linkName}
                    </li>
                </Link>
            ))}
            {componentsLink.map((link, i) => (
                <li key={i} className={`sm:text-base ${link.id !== 'footer' && pathname !== '/' && pathname !== '/home' ? 'hidden' : 'block'} hover:text-gray-800 transition-all duration-500 hover:scale-[0.99] text-sm cursor-pointer`}>
                    <ScrollToLink
                        to={link.id}
                        activeClass="active"
                        smooth={true}
                        spy={true}
                        offset={-70}
                        duration={500}>
                        {link.linkName}
                    </ScrollToLink>
                </li>
            ))}
        </ul>
    );
}

const Navbar = (props) => {
    const [isNavBarElevated, setIsNavbarElevated] = React.useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = React.useState(false);

    const isExtraSmallScreen = useMediaQuery('(max-width: 664px)');
    const isSemiMediumScreen = useMediaQuery('(max-width: 900px)');
    const isLargeScreen = useMediaQuery('(max-width:1280px)');
    const navigate = useNavigate();

    window.addEventListener('scroll', () => {
        setIsNavbarElevated(window.scrollY > 0)
    });

    React.useEffect(() => {
        setIsNavbarElevated(window.pageYOffset > 0)
    }, []);

    return (
        <>
            <nav className='fixed z-50'>
                <CssBaseline />
                <ElevationScroll {...props}>
                    <AppBar sx={{ bgcolor: isNavBarElevated ? 'white' : 'transparent', transition: 'all 150ms ease-in-out' }}>
                        <Toolbar>
                            <Container
                                disableGutters={isLargeScreen}
                                sx={{ display: 'flex', px: isLargeScreen ? 0.5 : 0 }}>
                                {isSemiMediumScreen && (
                                    <IconButton
                                        color="black"
                                        aria-label="open drawer"
                                        onClick={() => setIsOpenDrawer(!isOpenDrawer)}
                                        edge="start"
                                        sx={{ mr: 1 }}>
                                        <MenuIcon fontSize='inherit' />
                                    </IconButton>
                                )}

                                <div className='flex w-full justify-between items-center'>
                                    <Link to={'/home'}>
                                        <img className='sm:max-h-6 max-h-5 my-auto cursor-pointer'
                                            src={logo_black}
                                            alt="grocery" />
                                    </Link>

                                    <div className='flex items-center space-x-8'>
                                        {isSemiMediumScreen ? (
                                            <Drawer
                                                anchor={'left'}
                                                open={isOpenDrawer}
                                                onClose={() => setIsOpenDrawer(!isOpenDrawer)}>
                                                <Links
                                                    setIsOpenDrawer={setIsOpenDrawer}
                                                    isOpenDrawer={isOpenDrawer}
                                                    drawer={true} />
                                            </Drawer>
                                        ) : (
                                            <Links
                                                setIsOpenDrawer={setIsOpenDrawer}
                                                isOpenDrawer={isOpenDrawer} />
                                        )}
                                        
                                        <div className='sm:space-x-2 space-x-2 flex'>
                                        <SignedIn>
    <Tooltip title='Cart'>
        <span>
            <IconButton
                onClick={() => navigate('/cart')}
                sx={{ textTransform: 'capitalize' }}
                color='warning'>
                <ShoppingCartRounded fontSize='inherit' />
            </IconButton>
        </span>
    </Tooltip>
    {/* Orders button moved inside SignedIn */}
    <Button
        onClick={() => navigate('/orders')}
        size={isExtraSmallScreen ? 'small' : 'medium'}
        sx={{ textTransform: 'capitalize' }}
        color='success'
        variant='contained'>
        Orders
    </Button>
</SignedIn>

<div>
    <SignedOut>
        <SignInButton mode="modal">
            <Button
                size={isExtraSmallScreen ? 'small' : 'medium'}
                sx={{ textTransform: 'capitalize' }}
                color='success'
                variant='contained'>
                Sign In
            </Button>
        </SignInButton>
    </SignedOut>
</div>

                                            

                                            <SignedIn>
                                                <UserButton 
                                                    afterSignOutUrl="/"
                                                    appearance={{
                                                        elements: {
                                                            userButtonAvatarBox: {
                                                                width: '2rem',
                                                                height: '2rem'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </SignedIn>
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </Toolbar>
                    </AppBar>
                </ElevationScroll>
                <Toolbar id="back-to-top-anchor" />

                <ScrollTop {...props}>
                    <Fab
                        color='warning'
                        size="small"
                        aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>
            </nav>
        </>
    );
};

export default Navbar;