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
    dbId?: number
}

export type ErrorUpdate = BaseUpdate & {
    error: {
        field: string,
        status: number
    }
}

export type UpdateRequest = {
    name?: string,
    age?: number,
    sex?: string,
    file: string,
    dbId?: number,
    errors: number,
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
    updateRecords: {
        [file: string]: {
            [id: string]: UpdateRequest
        }
    },
}

function createFieldId(file: string, id: string | number, field: string) {
    return JSON.stringify([file, id, field])
}

function createRecordId(file: string, id: string | number) {
    return JSON.stringify([file, id])
}

export function newStatus(field: string, value: any) {
    if (isFieldValid[field](value))
        return null
    return FieldStatus.ERROR
}

function countErrors(person: Person) {
    let errors = 0;
    Object.values(columnNames).forEach((col: any) => {
        // @ts-ignore
        if (person[col]?.status)
            errors += 1
    })
    return errors;
}

const slice = createSlice({
    name: 'updates',
    initialState: {
        updates: {},
        updateStats: {},
        errors: {},
        errorStats: {},
        updateRecords: {},
    } as UpdatedFilesState,
    reducers: {
        registerUpdate: (state, action) => {
            console.log('update started')
            const {file, id, update, initial, dbId} = action.payload as FileUpdate;
            const fieldId = createFieldId(file, id, update.field)
            if (state.updates[fieldId] == null)
                state.updateStats[file] = (state.updateStats[file] || 0) + 1
            state.updates[fieldId] = update.value;
            const hadError = state.errors[fieldId], hasError = newStatus(update.field, update.value);
            state.errors[fieldId] = hasError
            if (hadError && !hasError) {
                delete state.errors[fieldId]
                state.errorStats[file] -= 1;
                state.updateRecords[file][id].errors -= 1
                if (state.errorStats[file] == 0) {
                    delete state.errorStats[file];
                }
            }
            if (!hadError && hasError) {
                state.errorStats[file] = (state.errorStats[file] || 0) + 1
                state.updateRecords[file][id].errors += 1
            }
            if (update.value === initial.value) {
                state.updateStats[file] -= 1
                if (!state.updateStats[file]) {
                    delete state.updateStats[file];
                    delete state.updates[fieldId];
                }
            }

            if (state.updates[fieldId]) {
                state.updateRecords[file][id] = update.value
            }
            console.log('update ended')
        },
        registerError: (state, action) => {
            const {file, id, error} = action.payload as ErrorUpdate;
            const fieldId = createFieldId(file, id, error.field)
            if (!(fieldId in state.errors))
                state.errorStats[file] = (state.errorStats[file] || 0) + 1
            state.errors[fieldId] = error.status;
        },
        initializeUpdates: (state, action) => {
            console.log('update init started')
            const {data, filename: file} = action.payload
            if (!state.updateRecords[file])
                state.updateRecords[file] = {}
            data.forEach((person: Person) => {
                let fieldId = createFieldId(file, person.id, columnNames.NAME)
                state.updates[fieldId] = person.name.value;
                state.updateStats[file] = (state.updateStats[file] || 0) + 1

                fieldId = createFieldId(file, person.id, columnNames.AGE)
                state.updates[fieldId] = person.age.value;
                state.updateStats[file] = (state.updateStats[file] || 0) + 1

                fieldId = createFieldId(file, person.id, columnNames.SEX)
                state.updates[fieldId] = person.sex.value;
                state.updateStats[file] = (state.updateStats[file] || 0) + 1
                state.updateRecords[file][person.id] = {
                    file,
                    sex: person.sex.value,
                    age: person.age.value,
                    name: person.name.value,
                    errors: countErrors(person)
                }
            })
            console.log('update init complete')
        }
    },
})

export const createUpdateMapper = function (state: any, file: string, id: string, field: string) {
    return state.updates[createFieldId(file, id, field)]
}

export const createErrorStateMapper = function (state: any, file: string, id: string, field: string) {
    return state.errors[createFieldId(file, id, field)]
}
export const {initializeUpdates, registerUpdate, registerError} = slice.actions
export const updatesReducer = slice.reducer;