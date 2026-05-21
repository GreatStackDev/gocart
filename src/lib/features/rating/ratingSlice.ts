import { dummyRatingsData } from '@/src/assets/assets'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Rating = (typeof dummyRatingsData)[number] & {
    orderId?: string
}

interface RatingState {
    ratings: Rating[]
}

const initialState: RatingState = {
    ratings: [],
}

const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        addRating: (state, action: PayloadAction<Rating>) => {
            state.ratings.push(action.payload)
        },
    }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer
