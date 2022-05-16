import {createSlice} from '@reduxjs/toolkit'
import {COLUMNS} from "../fileprocessing/constants";

export type UploadedFile = {
    filename: string;
    data: any[][];
};

export type UploadedFilesState = {
    files: {
        [filename: string]: UploadedFile
    },
    fileNames: string[],
    activeFile: string,
}

export const slice = createSlice({
    name: 'files',
    initialState: {
        files: {},
        fileNames: [],
        activeFile: '',
    } as UploadedFilesState,
    reducers: {
        addFile: (state, action) => {
            const {filename, data} = action.payload;
            if (!(filename in state.files)) {
                state.fileNames.push(filename)
            }
            state.activeFile = filename
            console.log(data)
            state.files[filename] = {
                filename,
                data,
            }
        },
        setActiveFile: (state, action) => {
            const {filename} = action.payload;
            state.activeFile = filename
        },
        updateFile: (state, action) => {
            const {filename, updatedRecords: {updates, deletes}} = action.payload;
            const updateMap: { [id: string]: any } = {};
            updates.forEach((update: any) => {
                updateMap[update.localId] = update;
            })
            const deleteMap: { [id: string]: any } = {};
            deletes.forEach((del: any) => {
                deleteMap[del.localId] = del;
            })
            console.log('shubham', updateMap, deletes)
            state.files[filename].data = state.files[filename].data.filter((person: any) => {
                const update = updateMap[person.id];
                if (update) {
                    person.dbId = update.dbId;
                    COLUMNS.forEach((col: string) => {
                        if (update[col]) {
                            // person[col].value = update[col];
                            person[col].value = update[col];
                            delete person[col].state
                        }
                    })
                }
                return !deleteMap[person.id];
            })
        },
        removeFile: (state, action) => {
            const {filename} = action.payload
            const {files, fileNames} = state;
            delete state.files[filename];
            let index = fileNames.indexOf(filename);
            if (index > -1) {
                fileNames.splice(index, 1)
                if (index >= fileNames.length) {
                    index -= 1;
                }
                state.activeFile = fileNames[index] || '';
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const {addFile, setActiveFile, updateFile, removeFile} = slice.actions
export const filesReducer = slice.reducer;