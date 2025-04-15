import { Outlet } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { createContext, useState } from "react";
import { handleSessionStorage } from "../../utils/utils";
import { useAuth } from '@clerk/clerk-react';

export const groceryContext = createContext();

// Get CartItems from SessionStorage
const cartItemsFromSessionStorage = handleSessionStorage('get', 'cartItems') || [];

const Layout = () => {
    const { isSignedIn } = useAuth();
    const [cartItems, setCartItems] = useState(cartItemsFromSessionStorage);

    return (
        <groceryContext.Provider value={{
            cartItemsState: [cartItems, setCartItems]
        }}>
            <Navbar />
            <section className="min-h-screen">
                <Outlet />
            </section>
            <Footer />
        </groceryContext.Provider>
    );
};

export default Layout;