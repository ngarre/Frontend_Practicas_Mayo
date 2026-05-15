import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "../types/cart.types.ts";
import type { Item } from "../types/item.types";

interface CartContextValue {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: number) => void;
  increaseQuantity: (itemId: number) => void;
  decreaseQuantity: (itemId: number) => void;
  clearCart: () => void;
}

interface CartProviderProps {
  children: React.ReactNode;
}

const CART_STORAGE_KEY = "cozy-bites-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(item: Item): void {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.item.id === item.id
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentItems, { item, quantity: 1 }];
    });
  }

  function removeFromCart(itemId: number): void {
    setCartItems((currentItems) =>
      currentItems.filter((cartItem) => cartItem.item.id !== itemId)
    );
  }

  function increaseQuantity(itemId: number): void {
    setCartItems((currentItems) =>
      currentItems.map((cartItem) =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  }

  function decreaseQuantity(itemId: number): void {
    setCartItems((currentItems) =>
      currentItems
        .map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  }

  function clearCart(): void {
    setCartItems([]);
  }

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}