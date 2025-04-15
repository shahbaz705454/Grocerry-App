import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import Products from "./Components/Products/Products";
import AllCategories from "./Components/AllCategories/AllCategories";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import About from "./Components/About/About";
import Cart from "./Components/Cart/Cart";
import { SignIn, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Orders from "./Components/Cart/Orders/Orders";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories/:categoryName" element={
            <Products categoryProducts={true} />} />

          {/* Auth Routes */}
          <Route
            path="/sign-in/*"
            element={<SignIn routing="path" path="/sign-in" redirectUrl="/home" />}
          />

          <Route
            path="/orders"
            element={
              <>
                <SignedIn>
                  <Orders />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <>
                <SignedIn>
                  <Cart />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route path="/*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;