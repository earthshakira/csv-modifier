import {createSlice} from '@reduxjs/toolkit'

export const slice = createSlice({
    name: 'uploads',
    initialState: {
        isOpen: false,
        filesMeta: {},
        page: 0,
    },
    reducers: {
        openDialog: (state, action) => {
            state.isOpen = true
        },
        closeDialog: (state, action) => {
            state.isOpen = false;
        },
        setFilesState: (state, action) => {
            const {filesMeta} = action.payload
            state.filesMeta = filesMeta
        }
    },
})

// Action creators are generated for each case reducer function
export const {openDialog, closeDialog, setFilesState} = slice.actions
export const uploadsReducer = slice.reducer;