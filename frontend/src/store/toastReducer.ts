import {createSlice} from '@reduxjs/toolkit'
import {Intent} from "@blueprintjs/core";

export const slice = createSlice({
    name: 'files',
    initialState: {
        message: '' as string,
        icon: '' as string,
        intent: '' as Intent,
        change: 0,
    },
    reducers: {
        sendToast: (state, action) => {
            const {message, icon, intent} = action.payload;
            state.message = message;
            state.icon = icon;
            state.intent = intent;
            state.change += 1;
        }
    },
})

// Action creators are generated for each case reducer function
export const {sendToast} = slice.actions
export const toastReducer = slice.reducer;