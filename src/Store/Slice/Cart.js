import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { changeLoader } from "../Slice/Loader";
import axios from "axios";
import { useDispatch } from "react-redux";
export const totalPriceAction = createAsyncThunk(
    "totalPriceAction",
    async (_, { dispatch }) => {
        dispatch(changeLoader(true));
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_UR}/cart`, {
                headers: {
                    Authorization: localStorage.getItem("userToken"),
                },
            });
            // console.log(res);
            dispatch(changeLoader(false));
            return res.data.numOfCartItems;
        } catch (error) {
            dispatch(changeLoader(false));
            return 0;
        }
    }
);
export const cartSlice = createSlice({
    name: "cart",
    initialState: { cart: [], totalPrice: 0 },
    extraReducers: (builder) => {
        builder.addCase(totalPriceAction.fulfilled, (state, action) => {
            state.totalPrice = action.payload;
        });
    },
    reducers: {
        addToCart: function (state, action) {
            state.cart.push(action.payload);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        removFromCart: function (state, action) {
            const newState = state.cart.filter(
                (product) => product.product._id !== action.payload._id
            );
            console.log(newState);
            // Save the updated state to localStorage
            localStorage.setItem("cart", JSON.stringify(newState));

            // Update the state using Immer's draft
            state.cart.splice(0, state.cart.length, ...newState);
        },
        udateQuantity: function (state, action) {
            // console.log(action);
            state.cart[action.payload.index].quantity =
                action.payload.updatequantity;
            // console.log(state.length);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },

        clearCart: function (state, action) {
            state.cart = [];
        },
    },
});

export const { addToCart, removFromCart, udateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
