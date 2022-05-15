import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';
const BATCH_SIZE = 500;

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

async function uploadBatch(updates: any) {
    const response = await api.post("/bulk", {
        updates,
        deletes: []
    })
    return response.data
}

async function uploadRecords(file: any, records: any, onProgress: (progress: number) => Promise<void>) {
    let updates = records.map((record: any) => Object.assign({...record}, {file: file.id}))
    updates.forEach((update: any) => {
        delete update.id
        if (update.dbId) {
            update.id = update.dbId;
            delete update.dbId;
        }
    })
    console.log('updates', updates)
    let itr = 0;
    let dbUpdates : any[] = [];
    while (itr < updates.length) {
        let response = await uploadBatch(updates.slice(itr, itr + BATCH_SIZE))
        console.log('resp',response)
        dbUpdates = dbUpdates.concat(response.updates)
        itr += BATCH_SIZE
        console.log('loop', itr, updates.length)
        await onProgress(Math.min(itr, updates.length))
    }
    return {
        updates: dbUpdates
    }
}

const API = {
    fetchFile,
    createIfNotExists,
    uploadRecords
}

export default API
