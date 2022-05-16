import {connect} from "react-redux";
import {Classes, H4, Icon, Intent, ProgressBar, Spinner, Tag} from "@blueprintjs/core";
import {useEffect, useState} from "react";
import API from "../../api/client";

function delay(t: number) {
   return new Promise(function(resolve) {
       setTimeout(resolve, t)
   });
}

function FetchFile(props: any) {
    const {filename, onFetch, file} = props;
    if (!file)
        API.createIfNotExists(filename).then(
            (d) => onFetch(d)
        ).catch(err => {
            console.error(err)
        })
    return (
        <div>
            <p> 1. Fetching file info from server </p>
            <div style={{textAlign: "center"}}>
                {
                    file ? (
                        <>
                            <Tag intent={Intent.SUCCESS} icon={'th'}>{file.name}</Tag>
                            <div className={Classes.TEXT_MUTED}>
                                created at {new Date(file.updated_at).toTimeString()} <br/>
                                last updated {new Date(file.updated_at).toTimeString()}
                            </div>
                        </>
                    ) : (
                        <>
                            <Spinner size={18}/>
                        </>
                    )
                }
            </div>
        </div>
    )
}

function BatchUpload(props: any) {
    const {filename, file, onComplete, records, deletes} = props
    const totalRecords = records.length
    const totalDeletes = deletes.length
    const [state, setState] = useState({
        progress: 0,
        deleteProgress: 0,
    });

    useEffect(() => {
        console.log('useEffect', records, deletes)
        Promise.all([
            API.uploadRecords(file, records, async (progress: number) => {
                setState({
                    ...state,
                    progress,
                })
            }),
            API.deleteRecords(file, deletes, async (deleteProgress: number) => {
                setState({
                    ...state, deleteProgress,
                })
            }),
            delay(3000)
        ]).then((data) => {
            const [updates, deletes] = data;
            console.log('promise all', data)
            onComplete({...updates, ...deletes});
        })
    }, [])
    console.log('component', state, props)
    return (
        <div>
            <p>2. </p>
            {totalRecords ? (
                <>
                    <p> Uploading Records </p>
                    <ProgressBar intent={Intent.PRIMARY} value={state.progress / totalRecords}/>
                    <p style={{float: "right"}}>{state.progress} / {totalRecords} </p>
                    <br/>
                </>
            ) : ""}

            {totalDeletes ? (
                <>
                    <p> Deleting Records </p>
                    <ProgressBar intent={Intent.DANGER} value={state.deleteProgress / totalDeletes}/>
                    <p style={{float: "right"}}>{state.deleteProgress} / {totalDeletes} </p>
                    <br/>
                </>
            ) : ""}

        </div>
    )
}

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateRecords, deleteRecords}} = state;
    let {filename} = ownProps;
    return {
        records: updateRecords[filename] || {},
        deletes: deleteRecords[filename] || {}
    }
}

function UploadRecords(props: any) {
    const [state, setState] = useState({
        step: 0,
        file: null,
    })
    const {step, file} = state;
    const {
        records, deletes, filename,
        uploadDone,
        onUploadCompleted,
    } = props
    console.log('records', records)
    const valid_records = Object.values(records).filter((d: any) => !d.errors && !deletes[d.localId])
    const delete_records = Object.values(deletes).filter((d: any) => d.dbId)
    const onFileFetch = (file: any) => {
        setState({file, step: Math.min(1)})
    };
    console.log('validRecords', valid_records)
    console.log('rerendered', state, props)
    return (
        <div>
            <div className={Classes.DIALOG_HEADER}>
                <Icon icon={'document-share'} intent={Intent.PRIMARY} size={30}/> <H4> Uploading Records</H4>
            </div>
            <div className={Classes.DIALOG_BODY}>
                {!uploadDone ? (
                    <>
                        {step >= 0 ? (
                            <FetchFile filename={filename} file={file} onFetch={onFileFetch}/>
                        ) : ""}
                        {step >= 1 ? (
                            <BatchUpload filename={filename} file={file} records={valid_records}
                                         deletes={delete_records}
                                         onComplete={onUploadCompleted}/>
                        ) : ""}
                    </>
                ) : (
                    <div style={{textAlign: 'center'}}>
                        <Icon intent={Intent.SUCCESS} icon={'tick-circle'} size={70}/> <br/>
                        Your records are successfully added to the server
                    </div>
                )}

            </div>
        </div>
    )
}

export default connect(mapStateToProps)(UploadRecords)