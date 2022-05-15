import {connect} from "react-redux";
import {Classes, H4, Icon, Intent, ProgressBar, Spinner, Tag} from "@blueprintjs/core";
import {useEffect, useState} from "react";
import API from "../../api/client";


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
    const {filename, file, onComplete, records} = props
    const totalRecords = records.length || 1
    const [state, setState] = useState({
        progress: 0,
    });

    useEffect(() => {
        API.uploadRecords(file, records, async (progress: number) => {
            setState({
                progress,
            })
        }).then((data) => {
            onComplete(data);
        })
    }, [])
    console.log('component', state, props)
    return (
        <div>
            <p>2. Uploading Records </p>
            <ProgressBar intent={Intent.PRIMARY} value={state.progress / totalRecords}/>
            <p style={{float: "right"}}>{state.progress} / {totalRecords} </p>
            <br/>
        </div>
    )
}

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateRecords}} = state;
    let {filename} = ownProps;
    return {
        records: updateRecords[filename]
    }
}

function UploadRecords(props: any) {
    const [state, setState] = useState({
        step: 0,
        file: null,
    })
    const {step, file} = state;
    const {
        records, filename, uploadDone,
        onUploadCompleted
    } = props
    const valid_records = Object.values(records).filter((d: any) => d.errors == 0)
    const onFileFetch = (file: any) => {
        setState({file, step: Math.min(1)})
    };
    console.log()
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
                                         onComplete={onUploadCompleted}/>
                        ) : ""}
                    </>
                ) : (
                    <div style={{textAlign: 'center'}}>
                        <Icon intent={Intent.SUCCESS} icon={'tick-circle'} size={70} /> <br/>
                        Your records are successfully added to the server
                    </div>
                )}

            </div>
        </div>
    )
}

export default connect(mapStateToProps)(UploadRecords)