import React, { useContext, useState } from "react";

import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

import classes from "./Cart.module.css";

const Cart = props => {
  const cartCtx = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = id => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = item => {
    cartCtx.addItem({ ...item, amount: 1 })
  };

  const showCheckoutHandler = () => {
    setShowCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch("https://food-order-app-192e1-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.items
        })
      });

    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart(); // cleaning the orders cart
  };

  const cartItems = <ul className={classes["cart-items"]}>
    {cartCtx.items.map(item => (
      <CartItem
        key={item.id}
        name={item.name}
        amount={item.amount}
        price={item.price}
        onRemove={cartItemRemoveHandler.bind(null, item.id)}
        onAdd={cartItemAddHandler.bind(null, item)}
      >
        {item.name}
      </CartItem>
    ))}
  </ul>;

  let orderContent = <div className={classes.actions}>
    <button
      className={classes["button--alt"]}
      onClick={props.toggleViewCart}>Close</button>
    {hasItems && <button
      className={classes.button}
      onClick={showCheckoutHandler}>Order</button>}
  </div>;

  if (showCheckout) {
    orderContent = <Checkout
      onConfirm={submitOrderHandler}
      onCancel={props.toggleViewCart} />;
  }

  const cartModalContent = <>
    {cartItems}
    <div className={classes.total}>
      <span>Total Amount</span>
      <span>{totalAmount}</span>
    </div>
    {orderContent}
  </>

  const didSubmitModalContent = <>
    <p>Order was sent succesfully...</p>
    <div className={classes.actions}>
      <button
        className={classes.button}
        onClick={props.toggleViewCart}>Close</button>
    </div>;
  </>;

  return <Modal onClick={props.toggleViewCart}>
    {!isSubmitting && !didSubmit && cartModalContent}
    {isSubmitting && !didSubmit && <p>Sending order...</p>}
    {didSubmit && didSubmitModalContent}
  </Modal>
};

export default Cart;