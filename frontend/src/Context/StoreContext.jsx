import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState("");
  const [food_list, Setfood_list] = useState([]);

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        Setfood_list(response.data.data);
        console.log("Successfully fetched food list:", response.data.data);
      } else {
        console.error("Backend response error for food list:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  const loadCardData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      setCartItems(response.data.cartData);
      console.log("Successfully loaded cart data:", response.data.cartData);
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Failed to add item to cart via API:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Failed to remove item from cart via API:", error);
      }
    }
  };

  const getTotalAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    async function loadData() {
      try {
        await fetchFoodList();
        if (localStorage.getItem("token")) {
          setToken(localStorage.getItem("token"));
          await loadCardData(localStorage.getItem('token'));
        }
        console.log("loadData function completed.");
      } catch (error) {
        console.error("Error inside loadData useEffect:", error);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    addToCart,
    cartItems,
    removeFromCart,
    setCartItems,
    getTotalAmount,
    url,
    setToken,
    token
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;