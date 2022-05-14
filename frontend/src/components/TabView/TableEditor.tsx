import React from "react";
import {Card, EditableText, HTMLSelect, Icon} from "@blueprintjs/core";


import DataTable from 'react-data-table-component';
import {connect} from "react-redux";
import {UploadedFile} from "../../store/filesReducer";
import {Sex} from "../../fileprocessing/constants";
import EditableName from "../editableFields/EditableName";
import EditableSex from "../editableFields/EditableSex";
import EditableAge from "../editableFields/EditableAge";
import FileToolbar from "./FileToolbar";

const customStyles = {
    headRow: {
        style: {
            border: 'none',
        },
    },
    headCells: {
        style: {
            color: '#202124',
            fontSize: '14px',
        },
    },
    rows: {
        highlightOnHoverStyle: {
            backgroundColor: 'rgb(230, 244, 244)',
            borderBottomColor: '#FFFFFF',
            borderRadius: '25px',
            outline: '1px solid #FFFFFF',
        },
    },
    pagination: {
        style: {
            border: 'none',
        },
    },
}

type OwnProps = {
    fileName: string
}

type TableEditorProps = OwnProps & {
    file: UploadedFile,
    dispatch: any,
}
const mapStateToProps = (state: any, ownProps: OwnProps) => ({
    file: state.csvReducer.files[ownProps.fileName]
})

const TableEditor = (props: TableEditorProps) => {

    const columns = [
        {
            name: 'Name',
            selector: (row: any) => row.name.value,
            cell: (row: any, index: number, column: any, id: string | number) => {
                return <EditableName initial={row.name} id={row.id} file={props.fileName}/>
            }
        },
        {
            name: 'Age',
            selector: (row: any) => row.age.value,
            cell: (row: any, index: number, column: any, id: string | number) => {
                return <EditableAge initial={row.age} id={row.id} file={props.fileName}/>
            }
        },
        {
            name: 'Sex',
            selector: (row: any) => row.sex.value,
            cell: (row: any, index: number, column: any, id: string | number) => {
                return <EditableSex initial={row.sex} id={row.id} file={props.fileName}/>
            }
        },
        {
            name: '',
            cell: (row: any, index: number, column: any, id: string | number) => {
                return <div></div>
            }
        }
    ];

    return (
        <Card>
            <FileToolbar filename={props.fileName}/>
            <DataTable
                pagination
                dense
                sortIcon={<Icon icon={'chevron-up'}/>}
                columns={columns}
                data={props.file.data}
            />
        </Card>

    )
}

export default connect(mapStateToProps)(TableEditor)