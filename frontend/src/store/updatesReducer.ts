import {createSlice} from '@reduxjs/toolkit'
import {isFieldValid} from "../fileprocessing/dataValidation";
import {columnNames, COLUMNS, FieldStatus, Person} from "../fileprocessing/constants";

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
    localId: string | number,
    errors: number,
}

export type UpdatedFilesState = {
    updates: {
        [key: string]: any
    },
    updateStats: {
        [key: string]: number
    },
    updateRecords: {
        [file: string]: {
            [id: string]: UpdateRequest
        }
    },
    errors: {
        [key: string]: any
    },
    errorStats: {
        [key: string]: number
    },
    deleteRecords: {
        [file: string]: {
            [id: string]: { localId: string, dbId: string }
        }
    }
    deleted: {
        [recordId: string]: boolean
    },
    deletedStats: {
        [key: string]: number
    }
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
        deleted: {},
        deletedStats: {},
        deleteRecords: {},
    } as UpdatedFilesState,
    reducers: {
        registerUpdate: (state, action) => {
            const {file, id, update, initial, dbId} = action.payload as FileUpdate;
            const fieldId = createFieldId(file, id, update.field)
            if (!state.updateRecords[file]) {
                state.updateRecords[file] = {}
            }
            if (!state.updateRecords[file][id]) {
                state.updateRecords[file][id] = {
                    file: file,
                    dbId,
                    localId: id,
                    errors: 0,
                    [update.field]: update.value
                };
            }

            if (state.updates[fieldId] == null && initial.value != null) {
                state.updateStats[file] = (state.updateStats[file] || 0) + 1
            }
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
                let updateRecord = state.updateRecords[file][id] as any;
                if (!updateRecord) {
                    updateRecord = state.updateRecords[file][id] = {file, localId: id, errors: 0, dbId}
                }
                updateRecord[update.field] = update.value
            }
        },
        registerError: (state, action) => {
            const {file, id, error} = action.payload as ErrorUpdate;
            const fieldId = createFieldId(file, id, error.field)
            if (!(fieldId in state.errors)) {
                state.errorStats[file] = (state.errorStats[file] || 0) + 1
            }
            state.errors[fieldId] = error.status;
        },
        clearUpdates: (state, action) => {
            const {updatedRecords: {updates, deletes}, filename: file, fileClose} = action.payload;
            updates.forEach((person: UpdateRequest) => {
                delete state.updateRecords[file][person.localId]
                Object.values(columnNames).forEach((colname: string) => {
                    let fieldId = createFieldId(file, person.localId, colname);
                    if (state.updates[fieldId]) {
                        delete state.updates[fieldId];
                        state.updateStats[file] -= 1;
                        if (state.updateStats[file] === 0) {
                            delete state.updateStats[file];
                        }
                    }
                })
            })
            if (fileClose) {
                delete state.updates[file];
                delete state.updateRecords[file];
                delete state.updateStats[file];
                delete state.errorStats[file];
            }
        },
        deleteRow: (state, action) => {
            const {file, id, dbId} = action.payload
            const recordId = createRecordId(file, id);
            const {deleted, deletedStats, deleteRecords} = state;
            if (!deletedStats[file]) {
                deletedStats[file] = 0;
                deleteRecords[file] = {};
            }
            deleteRecords[file][id] = {localId: id, dbId}
            deletedStats[file] += 1
            deleted[recordId] = true
        },
        restoreRow: (state, action) => {
            const {file, id} = action.payload
            const recordId = createRecordId(file, id);
            const {deleted, deletedStats, deleteRecords} = state;
            deletedStats[file] -= 1;
            delete deleted[recordId]
            delete deleteRecords[file][id]
            if (deletedStats[file] == 0) {
                delete deletedStats[file];
                delete deleteRecords[file];
            }
        },
        clearDeletes: (state, action) => {
            const {filename: file,closeFile} = action.payload
            const {deleted, deletedStats, deleteRecords, updateRecords} = state;
            Object.keys(deleteRecords[file] || {}).forEach((localId: string) => {
                const recordId = createRecordId(file, localId);
                delete deleted[recordId]
            })
            delete deletedStats[file];
            delete deleteRecords[file];
            if (closeFile)
                delete state.errorStats[file];
        },
        discardUpdates: (state, action) => {
            const {filename: file} = action.payload
            const {updateStats, updates, updateRecords} = state;
            Object.values(updateRecords[file] || {}).forEach(person => {
                COLUMNS.forEach((col: string) => {
                    let fieldId = createFieldId(file, person.localId, col)
                    delete updates[fieldId]
                })
            })
            delete updateStats[file];
            delete updateRecords[file];
        },
        initializeUpdates: (state, action) => {
            const {data, filename: file} = action.payload
            if (!state.updateRecords[file])
                state.updateRecords[file] = {}
            state.updateStats[file] = 0
            data.forEach((person: Person) => {
                let fieldId = createFieldId(file, person.id, columnNames.NAME)
                state.updates[fieldId] = person.name.value;
                state.updateStats[file] += 1

                fieldId = createFieldId(file, person.id, columnNames.AGE)
                state.updates[fieldId] = person.age.value;
                state.updateStats[file] += 1

                fieldId = createFieldId(file, person.id, columnNames.SEX)
                state.updates[fieldId] = person.sex.value;
                state.updateStats[file] += 1
                state.updateRecords[file][person.id] = {
                    file,
                    sex: person.sex.value,
                    age: person.age.value,
                    name: person.name.value,
                    errors: countErrors(person),
                    localId: person.id
                }
            })
            if (!state.updateStats[file])
                delete state.updateStats[file]
        }
    },
})

export const createUpdateMapper = function (state: any, file: string, id: string, field: string) {
    return state.updates[createFieldId(file, id, field)]
}

export const createErrorStateMapper = function (state: any, file: string, id: string, field: string) {
    return state.errors[createFieldId(file, id, field)]
}

export const createDeleteMapper = function (state: any, file: string, id: string) {
    return state.deleted[createRecordId(file, id)]
}
export const {
    clearUpdates,
    initializeUpdates,
    registerUpdate,
    registerError,
    restoreRow,
    deleteRow,
    clearDeletes,
    discardUpdates
} = slice.actions
export const updatesReducer = slice.reducer;