import {configureStore} from '@reduxjs/toolkit'
import {filesReducer} from "./filesReducer";
import {updatesReducer} from "./updatesReducer";
import {toastReducer} from "./toastReducer";

export const tableStore = configureStore({
    reducer: {
        csvReducer: filesReducer,
        updatesReducer,
        toaster: toastReducer,
    },
})