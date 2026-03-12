import { useEffect, useState } from "react";
import { endpoints } from "../api/endpoints";
import {
  getApiMessage,
  normalizeApiError,
  unwrapApiResponse,
} from "../api/response";
import { CartContext } from "./cart-context";
import { useAuth } from "./useAuth";

const EMPTY_CART = {
  cartId: null,
  items: [],
  total: 0,
};

export function CartProvider({ children }) {
  const { isAuthenticated, requestWithAuth, status } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  async function refreshCart() {
    if (!isAuthenticated) {
      setCart(EMPTY_CART);
      return EMPTY_CART;
    }

    setIsCartLoading(true);

    try {
      const response = await requestWithAuth("get", endpoints.cart.current);
      const nextCart = unwrapApiResponse(response) || EMPTY_CART;
      setCart(nextCart);
      return nextCart;
    } catch (error) {
      setCart(EMPTY_CART);
      setCartMessage(normalizeApiError(error));
      throw error;
    } finally {
      setIsCartLoading(false);
    }
  }

  async function addItem(bookId, quantity) {
    const response = await requestWithAuth("post", endpoints.cart.add, {
      data: { bookId, quantity },
    });
    await refreshCart();
    setCartMessage(getApiMessage(response, "Book added to cart."));
    return response;
  }

  async function removeItem(bookId) {
    const response = await requestWithAuth("delete", endpoints.cart.remove(bookId));
    const nextCart = unwrapApiResponse(response) || EMPTY_CART;
    setCart(nextCart);
    setCartMessage(getApiMessage(response, "Book removed from cart."));
    return nextCart;
  }

  async function decreaseItem(bookId) {
    const response = await requestWithAuth("put", endpoints.cart.decrease(bookId), {
      data: {},
    });
    const nextCart = unwrapApiResponse(response) || EMPTY_CART;
    setCart(nextCart);
    setCartMessage(getApiMessage(response, "Cart item updated."));
    return nextCart;
  }

  async function clearCart() {
    const response = await requestWithAuth("delete", endpoints.cart.clear);
    setCart(EMPTY_CART);
    setCartMessage(getApiMessage(response, "Cart cleared successfully."));
    return response;
  }

  useEffect(() => {
    async function syncCart() {
      setIsCartLoading(true);

      try {
        const response = await requestWithAuth("get", endpoints.cart.current);
        const nextCart = unwrapApiResponse(response) || EMPTY_CART;
        setCart(nextCart);
      } catch {
        setCart(EMPTY_CART);
      } finally {
        setIsCartLoading(false);
      }
    }

    if (status === "authenticated") {
      syncCart();
      return;
    }

    if (status === "anonymous") {
      setCart(EMPTY_CART);
      setCartMessage("");
    }
  }, [requestWithAuth, status]);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isCartLoading,
        cartMessage,
        setCartMessage,
        refreshCart,
        addItem,
        removeItem,
        decreaseItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
