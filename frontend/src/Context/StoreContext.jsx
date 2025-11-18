import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) setFoodList(res.data.data);
    } catch (err) {
      console.error("Failed to fetch food list:", err);
    }
  };

  const loadCart = async (token) => {
    try {
      const res = await axios.get(`${url}/api/cart`, { headers: { token } });
      if (res.data && res.data.items) setCartItems(res.data.items);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const loadOrders = async (token) => {
    try {
      const res = await axios.get(`${url}/api/order/myorders`, { headers: { token } });
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Failed to add to cart via API:", err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      newCart[itemId] = (newCart[itemId] || 0) - 1;
      if (newCart[itemId] <= 0) delete newCart[itemId];
      return newCart;
    });
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Failed to remove from cart via API:", err);
      }
    }
  };

  const getTotalAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const food = food_list.find((f) => f._id === id);
      return food ? total + food.price * qty : total;
    }, 0);
  };

  useEffect(() => {
    const init = async () => {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCart(savedToken);
        await loadOrders(savedToken);
      }
    };
    init();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalAmount,
    orders,
    loadOrders,
    setToken,
    token,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;