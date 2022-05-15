import {createSlice} from '@reduxjs/toolkit'
import {COLUMNS} from "../fileprocessing/constants";

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
            console.log(data)
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
            const {filename, updatedRecords: {updates, deletes}} = action.payload;
            const updateMap: { [id: string]: any } = {};
            updates.forEach((update: any) => {
                updateMap[update.localId] = update;
            })
            console.log(updateMap)
            state.files[filename].data.filter((person: any) => {
                const update = updateMap[person.id];
                if(update) {
                    person.dbId = update.dbId;
                    COLUMNS.forEach((col: string) => {
                        if (update[col]) {
                            // person[col].value = update[col];
                            person[col].value = update[col];
                            delete person[col].state
                        }
                    })
                }
            })
        }
    },
})

// Action creators are generated for each case reducer function
export const {addFile, setActiveFile, updateFile} = slice.actions
export const filesReducer = slice.reducer;