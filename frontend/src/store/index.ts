import {configureStore} from '@reduxjs/toolkit'
import {filesReducer} from "./filesReducer";
import {updatesReducer} from "./updatesReducer";

export const tableStore = configureStore({
    reducer: {
        csvReducer: filesReducer,
        updatesReducer,
    },
})