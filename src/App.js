import React, { useState } from "react";

import Header from "./components/Layout/Header";
import Meals from "./components/Meals/Meals";
import Cart from "./components/Cart/Cart";
import CartProvider from "./store/CartProvider";

function App() {
  const [viewCart, setViewCart] = useState(false);

  const toggleViewCartHandler = () => {
    setViewCart(prevState => {
      return !prevState; // negación del estado anterior
    });
  };

  return (
    <CartProvider>
      {viewCart && <Cart toggleViewCart={toggleViewCartHandler} />}
      <Header toggleViewCart={toggleViewCartHandler} />
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default App;
