/**
 * Majority of this code has been taken from `react-papaparse` documentation
 * @see https://www.npmjs.com/package/react-papaparse#click-and-drag-upload
 */
import React, {createRef, CSSProperties, useRef, useState} from 'react';

import {formatFileSize, lightenDarkenColor, useCSVReader,} from 'react-papaparse';
import {addFile} from "../store/filesReducer";
import {connect} from "react-redux";
import {validateData} from "../fileprocessing/dataValidation";
import {initializeUpdates} from "../store/updatesReducer";
import API from "../api/client";
import {sendToast} from "../store/toastReducer";
import {Intent} from "@blueprintjs/core";

const GREY = '#CCC';
const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';
const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
    DEFAULT_REMOVE_HOVER_COLOR,
    40
);
const GREY_DIM = '#686868';

const styles = {
    zone: {
        alignItems: 'center',
        border: `2px dashed ${GREY}`,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        padding: 20,
    } as CSSProperties,
    file: {
        background: 'linear-gradient(to bottom, #EEE, #DDD)',
        borderRadius: 20,
        display: 'flex',
        height: 120,
        width: 120,
        position: 'relative',
        zIndex: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    } as CSSProperties,
    info: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 10,
    } as CSSProperties,
    size: {
        backgroundColor: GREY_LIGHT,
        borderRadius: 3,
        marginBottom: '0.5em',
        justifyContent: 'center',
        display: 'flex',
    } as CSSProperties,
    name: {
        backgroundColor: GREY_LIGHT,
        borderRadius: 3,
        fontSize: 12,
        marginBottom: '0.5em',
    } as CSSProperties,
    progressBar: {
        bottom: 14,
        position: 'absolute',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
    } as CSSProperties,
    zoneHover: {
        borderColor: GREY_DIM,
    } as CSSProperties,
    default: {
        borderColor: GREY,
    } as CSSProperties,
    remove: {
        height: 23,
        position: 'absolute',
        right: 6,
        top: 6,
        width: 23,
    } as CSSProperties,
};

function mapStateToProps(state: any) {
    return {
        filenames: state.csvReducer.fileNames
    }
}

function CSVReader(props: any) {
    const {filenames, dispatch} = props;
    const {CSVReader} = useCSVReader();
    const closeButton = useRef<HTMLDivElement>(null);
    const [zoneHover, setZoneHover] = useState(false);
    const [openDialog, setDialog] = useState(false);
    const [tempData, setTempData] = useState(false);
    const fileDiv = createRef<HTMLDivElement>()
    const [removeHoverColor, setRemoveHoverColor] = useState(
        DEFAULT_REMOVE_HOVER_COLOR
    );

    return (
        <div>
            <CSVReader
                onUploadAccepted={async (results: { data: [any[]], errors: any[], }, file: File) => {
                    if (filenames.includes(file.name)) {
                        dispatch(sendToast({
                            message: 'A file with this name is open in the editor, please close the file or rename this one',
                            intent: Intent.DANGER,
                            icon: 'error'
                        }))
                    } else {
                        const dbFile = await API.fetchFile(file.name)
                        if (dbFile) {
                            dispatch(sendToast({
                                message: 'A file with this name is already uploaded',
                                intent: Intent.DANGER,
                                icon: 'data-connection'
                            }))
                        } else {
                            const dataValidation = validateData(results.data, file)
                            if (dataValidation.valid) {
                                dispatch(sendToast({
                                    message: 'File Parsed and Opened',
                                    intent: Intent.SUCCESS,
                                    icon: 'bring-data'
                                }))
                                dispatch(addFile({data: dataValidation.data, filename: file.name}))
                                dispatch(initializeUpdates({data: dataValidation.data, filename: file.name}))
                            } else {
                               dispatch(sendToast({
                                message: dataValidation.error,
                                intent: Intent.DANGER,
                                icon: 'error'
                            }))
                            }
                        }
                    }
                    closeButton.current?.click()
                }}

                onDragOver={(event: DragEvent) => {
                    event.preventDefault();
                }}
                onDragLeave={(event: DragEvent) => {
                    event.preventDefault();
                }}
            >
                {({
                      getRootProps,
                      acceptedFile,
                      ProgressBar,
                      getRemoveFileProps,
                      Remove,
                  }: any) => (
                    <>
                        <div
                            {...getRootProps()}
                            style={Object.assign(
                                {},
                                styles.zone
                            )}
                        >
                            {acceptedFile ? (
                                <>
                                    <div style={styles.file} ref={fileDiv}>
                                        <div style={styles.info}>
                                        <span style={styles.size}>
                                          {formatFileSize(acceptedFile.size)}
                                        </span>
                                            <span style={styles.name}>{acceptedFile.name}</span>
                                        </div>
                                        <div style={styles.progressBar}>
                                            <ProgressBar/>
                                        </div>
                                        <div
                                            {...getRemoveFileProps()}
                                            style={styles.remove}
                                            onMouseOver={(event: Event) => {
                                                event.preventDefault();
                                                setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                                            }}
                                            onMouseOut={(event: Event) => {
                                                event.preventDefault();
                                                setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                                            }}
                                            ref={closeButton}
                                        >
                                            <Remove color={removeHoverColor}/>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                'Drop CSV file here or click to upload'
                            )}
                        </div>

                    </>
                )}
            </CSVReader>
        </div>
    );
}

export default connect(mapStateToProps)(CSVReader);