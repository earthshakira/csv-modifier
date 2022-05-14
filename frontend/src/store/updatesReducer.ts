import {createSlice} from '@reduxjs/toolkit'
import {isFieldValid} from "../fileprocessing/dataValidation";
import {columnNames, FieldStatus, Person} from "../fileprocessing/constants";

type BaseUpdate = {
    file: string,
    id: string,
}

export type FileUpdate = BaseUpdate & {
    update: {
        field: string,
        value: any,
    },
    initial: {
        field: string,
        value: any,
    }
}

export type ErrorUpdate = BaseUpdate & {
    error: {
        field: string,
        status: number
    }
}
export type UpdatedFilesState = {
    updates: {
        [key: string]: any
    },
    updateStats: {
        [key: string]: number
    },
    errors: {
        [key: string]: any
    },
    errorStats: {
        [key: string]: number
    },
}

function createId(file: string, id: string | number, field: string) {
    return JSON.stringify([file, id, field])
}

export function newStatus(field: string, value: any) {
    if (isFieldValid[field](value))
        return null
    return FieldStatus.ERROR
}

const slice = createSlice({
    name: 'updates',
    initialState: {
        updates: {},
        updateStats: {},
        errors: {},
        errorStats: {}
    } as UpdatedFilesState,
    reducers: {
        registerUpdate: (state, action) => {
            console.log('update started')
            const {file, id, update, initial} = action.payload as FileUpdate;
            const objKey = createId(file, id, update.field)
            if (state.updates[objKey] == null)
                state.updateStats[file] = (state.updateStats[file] || 0) + 1
            state.updates[objKey] = update.value;
            let hadError = state.errors[objKey];
            state.errors[objKey] = newStatus(update.field, update.value)
            if (hadError && !state.errors[objKey]) {
                delete state.errors[objKey]
                state.errorStats[file] -= 1;
                if (state.errorStats[file] == 0) {
                    delete state.errorStats[file];
                }
            }
            if (!hadError && state.errors[objKey]) {
                state.errorStats[file] = (state.errorStats[file] || 0) + 1
            }
            if (update.value === initial.value) {
                state.updateStats[file] -= 1
                if (!state.updateStats[file]) {
                    delete state.updateStats[file];
                    delete state.updates[objKey];
                }
            }
            console.log('update ended')
        },
        registerError: (state, action) => {
            const {file, id, error} = action.payload as ErrorUpdate;
            const objKey = createId(file, id, error.field)
            if (!(objKey in state.errors))
                state.errorStats[file] = (state.errorStats[file] || 0) + 1
            state.errors[objKey] = error.status;
        },
        initializeUpdates: (state, action) => {
            console.log('update init started')
            const {data, filename: file} = action.payload
            data.forEach((person: Person) => {
                let objKey = createId(file, person.id, columnNames.NAME)
                state.updates[objKey] = person.name.value;
                state.updateStats[file] = (state.updateStats[file] || 0) + 1

                objKey = createId(file, person.id, columnNames.AGE)
                state.updates[objKey] = person.age.value;
                state.updateStats[file] = (state.updateStats[file] || 0) + 1

                objKey = createId(file, person.id, columnNames.SEX)
                state.updates[objKey] = person.sex.value;
                state.updateStats[file] = (state.updateStats[file] || 0) + 1
            })
            console.log('update init complete')
        }
    },
})

export const createUpdateMapper = function (state: any, file: string, id: string, field: string) {
    return state.updates[createId(file, id, field)]
}

export const createErrorStateMapper = function (state: any, file: string, id: string, field: string) {
    return state.errors[createId(file, id, field)]
}
export const {initializeUpdates, registerUpdate, registerError} = slice.actions
export const updatesReducer = slice.reducer;