import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    products: [],
    currentItem: null,
    cart: [],
  }
  export const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers: {
        addCrops : (state, action) => {
            state.products = action.payload;
        },
        addToCart: (state, action) => {
            const itemToAdd = state.products.find((product) => product._id === action.payload.id);
            const alreadyPresentInCart = state.cart.find((product) => product._id === action.payload.id);
            if (alreadyPresentInCart) {
                state.cart = state.cart.map((product) =>
                    product._id === action.payload.id
                      ? { ...product, qty:product.qty + action.payload.qty } // Update quantity
                      : product // Return the rest unchanged
                  );
                } else {
                    state.cart.push({ ...itemToAdd, qty: action.payload.qty });
      }
    },

    loadCurrentItem: (state, action) => {
      state.currentItem = action.payload.item
    },

    adjustQuantity: (state, action) => {
        state.cart = state.cart.map((product) =>
            product._id === action.payload.id
              ? {...product,qty:action.payload.qty} // Update quantity
              : product
          );
        },
    
        removeFromCart : (state,action) => {
          state.cart = state.cart.filter((product) =>
            product._id !== action.payload.id)
        },
        
        signoutCart : (state,action) => {
            state.cart = []
        },

      }
    })
    
    export const {addCrops, addToCart, loadCurrentItem ,adjustQuantity,removeFromCart,signoutCart} = cartSlice.actions
    
    export default cartSlice.reducer;  

