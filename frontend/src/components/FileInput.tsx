/**
 * Majority of this code has been taken from `react-papaparse` documentation
 * @see https://www.npmjs.com/package/react-papaparse#click-and-drag-upload
 */
import React, {createRef, CSSProperties, useState} from 'react';

import {formatFileSize, lightenDarkenColor, useCSVReader,} from 'react-papaparse';
import {addFile} from "../store/filesReducer";
import {useDispatch} from "react-redux";
import {validateData} from "../fileprocessing/dataValidation";
import {initializeUpdates} from "../store/updatesReducer";

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

export default function CSVReader() {
    const {CSVReader} = useCSVReader();
    const [zoneHover, setZoneHover] = useState(false);
    const fileDiv = createRef<HTMLDivElement>()
    const dispatch = useDispatch();
    const [removeHoverColor, setRemoveHoverColor] = useState(
        DEFAULT_REMOVE_HOVER_COLOR
    );

    return (
        <CSVReader
            onUploadAccepted={(results: { data: [any[]], errors: any[], }, file: File) => {
                const dataValidation = validateData(results.data, file)
                if (dataValidation.valid) {
                    dispatch(addFile({data: dataValidation.data, filename: file.name}))
                    dispatch(initializeUpdates({data: dataValidation.data, filename: file.name}))
                }
                setZoneHover(false);
            }}

            onDragOver={(event: DragEvent) => {
                event.preventDefault();
                setZoneHover(true);
            }}
            onDragLeave={(event: DragEvent) => {
                event.preventDefault();
                setZoneHover(false);
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
                            styles.zone,
                            zoneHover && styles.zoneHover
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
    );
}