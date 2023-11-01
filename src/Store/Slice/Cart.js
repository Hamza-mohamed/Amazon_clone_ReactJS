import { createSlice } from "@reduxjs/toolkit";

export const cartSlice=createSlice({
    name:'cart',
    initialState:[],
    reducers:{
addToCart:function(state,action){
state.push(action.payload)
},
removFromCart:function(state,action){
   
 return state.filter((product)=>product._id!=action.payload._id)
    }
}
})

export const {addToCart,removFromCart}=cartSlice.actions
export default cartSlice.reducer
