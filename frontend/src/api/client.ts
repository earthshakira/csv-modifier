import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';
const BATCH_SIZE = 1;

const api = axios.create({
    baseURL: BASE_URL,
});

async function fetchFile(filename: string) {
    const response = await api.get('/files/', {
        params: {
            name: filename,
            format: 'json'
        }
    })
    return response.data.results[0]
}

async function createFile(filename: string) {
    const response = await api.post('/files/', {
        name: filename
    })
    if (response.status == 201)
        return response.data
}

async function createIfNotExists(filename: string) {
    let file = await fetchFile(filename);
    if (!file)
        file = await createFile(filename);
    return file
}

async function uploadBatch(updates: any, deletes: any = []) {
    const response = await api.post("/bulk", {
        updates,
        deletes
    })
    return response.data
}

async function uploadRecords(file: any, records: any, onProgress: (progress: number) => Promise<void>) {
    console.log(records)
    let updates = records.map((record: any) => Object.assign({...record}, {file: file.id}))
    updates.forEach((update: any) => {
        if (update.dbId) {
            update.id = update.dbId;
            delete update.dbId;
        }
    })
    console.log('updates', updates)
    let itr = 0;
    let dbUpdates: any[] = [];
    while (itr < updates.length) {
        const currentBatch = updates.slice(itr, itr + BATCH_SIZE);
        let response = await uploadBatch(currentBatch)
        console.log('resp', response)
        dbUpdates = dbUpdates.concat(response.updates)
        response.updates.forEach((update: any, i: number) => {
            update.dbId = update.id
            update.localId = currentBatch[i].localId
        })
        itr += BATCH_SIZE
        console.log('loop', itr, updates.length)
        await onProgress(Math.min(itr, updates.length))
    }
    return {
        updates: dbUpdates
    }
}


async function deleteRecords(file: any, records: any, onProgress: (progress: number) => Promise<void>) {
    let deletes = records.map((record: any) => Object.assign({...record}, {file: file.id}))
    deletes.forEach((deleteRec: any) => {
        if (deleteRec.dbId) {
            deleteRec.id = deleteRec.dbId;
            delete deleteRec.dbId;
        }
    })
    console.log('deletes', deletes)
    let itr = 0;
    let dbUpdates: any[] = [];
    while (itr < deletes.length) {
        const currentBatch = deletes.slice(itr, itr + BATCH_SIZE);
        let response = await uploadBatch([], currentBatch)
        console.log('resp', response)
        dbUpdates = dbUpdates.concat(response.updates)
        response.deletes.forEach((update: any, i: number) => {
            update.dbId = update.id
            update.localId = currentBatch[i].localId
        })
        itr += BATCH_SIZE
        console.log('loop', itr, deletes.length)
        await onProgress(Math.min(itr, deletes.length))
    }
    return {
        deletes: dbUpdates
    }
}

const API = {
    fetchFile,
    createIfNotExists,
    uploadRecords,
    deleteRecords
}

export default API
