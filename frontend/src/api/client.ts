import axios from 'axios';

let BASE_URL = 'http://localhost:8000/api';

if (process.env.NODE_ENV == 'production')
    BASE_URL = '/api'
const BATCH_SIZE = 100;

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

async function batchDownload(file: any, onProgress: (progress: number, total: number) => Promise<void>) {
    let hasNext = true, offset = 0;
    let fileRows = [] as any[];
    while (hasNext) {
        const response = await api.get('/rows/', {
            params: {
                file: file.id,
                limit: BATCH_SIZE,
                offset,
            }
        })
        const {data} = response
        fileRows = fileRows.concat(data.results)
        offset += data.results.length
        hasNext = data.next;
        await onProgress(offset, data.count);
    }
    return fileRows;
}

async function getFiles(limit: number, offset: number) {
    const response = await api.get('/files/', {
        params: {
            format: 'json',
            limit,
            offset
        }
    })
    return response.data
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

    let updates = records.map((record: any) => Object.assign({...record}, {file: file.id}))
    updates.forEach((update: any) => {
        if (update.dbId) {
            update.id = update.dbId;
            delete update.dbId;
        }
    })
    let itr = 0;
    let dbUpdates: any[] = [];
    while (itr < updates.length) {
        const currentBatch = updates.slice(itr, itr + BATCH_SIZE);
        let response = await uploadBatch(currentBatch)

        dbUpdates = dbUpdates.concat(response.updates)
        response.updates.forEach((update: any, i: number) => {
            update.dbId = update.id
            update.localId = currentBatch[i].localId
        })
        itr += BATCH_SIZE
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

    let itr = 0;
    let dbUpdates: any[] = [];
    while (itr < deletes.length) {
        const currentBatch = deletes.slice(itr, itr + BATCH_SIZE);
        let response = await uploadBatch([], currentBatch)
        dbUpdates = dbUpdates.concat(response.deletes)
        response.deletes.forEach((update: any, i: number) => {
            update.dbId = update.id
            update.localId = currentBatch[i].localId
        })
        itr += BATCH_SIZE
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
    deleteRecords,
    getFiles,
    batchDownload
}

export default API
