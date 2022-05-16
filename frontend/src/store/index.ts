import {configureStore} from '@reduxjs/toolkit'
import {filesReducer} from "./filesReducer";
import {updatesReducer} from "./updatesReducer";
import {toastReducer} from "./toastReducer";
import {uploadsReducer} from "./uploadsReducer";

export const tableStore = configureStore({
    reducer: {
        csvReducer: filesReducer,
        updatesReducer,
        toaster: toastReducer,
        uploads: uploadsReducer,
    },
})