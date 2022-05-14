import {createSlice} from '@reduxjs/toolkit'

export type UploadedFile = {
    filename: string;
    data: [any[]];
};

export type UploadedFilesState = {
    files: {
        [filename: string]: UploadedFile
    },
    fileNames: string[],
    lastAddedFile: string,
}

export const slice = createSlice({
    name: 'files',
    initialState: {
        files: {},
        fileNames: [],
        lastAddedFile: '',
    } as UploadedFilesState,
    reducers: {
        addFile: (state, action) => {
            const {filename, data} = action.payload;
            if (!(filename in state.files)) {
                state.fileNames.push(filename)
            }
            state.lastAddedFile = filename
            state.files[filename] = {
                filename,
                data,
            }
        },
        setActiveFile: (state, action) => {
            const {filename} = action.payload;
            state.lastAddedFile = filename
        },
        updateFile: (state, action) => {
            const update = action.payload;
            const file = state.files[update.file]
            const person = file.data.filter((d: any) => d.id === update.id)
            person[0][update.update.field].value = update.update.value
        }
    },
})

// Action creators are generated for each case reducer function
export const {addFile, setActiveFile, updateFile} = slice.actions
export const filesReducer = slice.reducer;