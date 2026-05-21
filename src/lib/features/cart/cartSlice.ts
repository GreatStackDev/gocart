import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type ProductIdPayload = {
    productId: string
}

export interface CartState {
    total: number
    cartItems: Record<string, number>
}

const initialState: CartState = {
    total: 0,
    cartItems: {},
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ProductIdPayload>) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action: PayloadAction<ProductIdPayload>) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
                state.total -= 1
            }
        },
        deleteItemFromCart: (state, action: PayloadAction<ProductIdPayload>) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer
