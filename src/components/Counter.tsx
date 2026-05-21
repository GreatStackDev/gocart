'use client'
import { addToCart, removeFromCart } from "@/src/lib/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";

const Counter = ({ productId }: { productId: string }) => {

    const { cartItems } = useAppSelector(state => state.cart);

    const dispatch = useAppDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{cartItems[productId]}</p>
            <button onClick={addToCartHandler} className="p-1 select-none">+</button>
        </div>
    )
}

export default Counter
