import { addressDummyData } from '@/src/assets/assets'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Address = typeof addressDummyData

interface AddressState {
    list: Address[]
}

const initialState: AddressState = {
    list: [addressDummyData],
}

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        addAddress: (state, action: PayloadAction<Address>) => {
            state.list.push(action.payload)
        },
    }
})

export const { addAddress } = addressSlice.actions

export default addressSlice.reducer
