import {Button, Classes, Dialog, Icon, Intent, NonIdealState, ProgressBar, Tag, Toaster} from "@blueprintjs/core";
import {connect} from "react-redux";
import {closeDialog, setFilesState} from "../store/uploadsReducer";
import * as React from "react";
import {useEffect, useRef} from "react";
import API from "../api/client";
import {addFile} from "../store/filesReducer";

const PAGE_SIZE = 100

function DownloadProgress(props: any) {
    const {progress, total, file} = props;
    return (
        <div>
            Downloading {file.name}
            <ProgressBar intent={progress < total ? Intent.PRIMARY : Intent.SUCCESS} value={progress / total}/>
        </div>
    )
}

function mapStateToProps(state: any, props: any) {
    const openFiles = {} as any;
    state.csvReducer.fileNames.forEach((filename: string) => {
        openFiles[filename] = true;
    })
    return {
        ...state.uploads,
        openFiles,
    }
}

function transformData(data: any[], file: any) {
    const personArray = data.map((item: any) => ({
        id: item.id.toString(),
        dbId: item.id,
        name: {value: item.name},
        age: {value: item.age},
        sex: {value: item.sex},
        file: file.name
    }));
    return personArray
}

function UploadedFiles(props: any) {
    const {isOpen, filesMeta, page, dispatch, openFiles} = props;
    const toaster = useRef<Toaster>(null)
    const handleOnClose = () => {
        dispatch(closeDialog({}))
    }

    const downloadFile = (file: any) => {
        handleOnClose()
        const key = toaster.current?.show({
            message: DownloadProgress({progress: 0, total: 1, file}),
            icon: 'cloud-download'
        });
        API.batchDownload(file, async (progress, total) => {
            toaster.current?.show({
                message: DownloadProgress({progress, total, file}),
                icon: 'cloud-download',
                timeout: 2000,
            }, key);
        }).then((data: any[]) => {
            const fileData = transformData(data, file);
            dispatch(addFile({data: fileData, filename: file.name}))
        })
    }
    return (
        <>
            <Toaster ref={toaster}/>
            <Dialog
                icon="cloud"
                title="Uploaded Files"
                isOpen={isOpen}
                onClose={handleOnClose}
            >
                <div className={Classes.DIALOG_BODY}>
                    {(filesMeta?.results?.length ? (
                        <>
                            {
                                filesMeta?.results.map(((file: any) => (
                                    <Button
                                        key={file.name}
                                        style={{
                                            display: 'inline-block',
                                            height: '10em',
                                            width: "10em",
                                            textAlign: "center",
                                            marginRight: "1em",
                                            position: 'relative'
                                        }}
                                        disabled={openFiles[file.name]}
                                        onClick={(() => {
                                            downloadFile(file);
                                        })}
                                    >
                                        {
                                            (openFiles[file.name] ? (
                                                <>
                                                    <br/>
                                                    <Tag intent={Intent.SUCCESS}
                                                         style={{
                                                             position: 'absolute',
                                                             right: 10,
                                                             top: 10
                                                         }}>
                                                        open
                                                    </Tag>
                                                </>
                                            ) : "")
                                        }
                                        <Icon icon={'document'} size={60}/>
                                        <br/>
                                        {file.name}


                                    </Button>

                                )))
                            }
                        </>
                    ) : (<>
                        <br/>
                        <NonIdealState
                            icon={'inbox'}
                            iconSize={70}
                            title={'No Files Uploaded Yet'}
                            description={'Please Upload a new File'}
                        />
                    </>))}
                </div>
            </Dialog>
        </>
    )
}

export default connect(mapStateToProps)(UploadedFiles)