import React, {useEffect} from "react";
import {columnNames, FieldStatus} from "../../fileprocessing/constants";
import {newStatus, registerError, registerUpdate} from "../../store/updatesReducer";
import {EditableText} from "@blueprintjs/core";
import {connect} from "react-redux";
import {buildError, buildStatePropMapper, buildUpdate} from "../../utils";
import {renderError} from "../utils";

const COL_NAME = columnNames.NAME;
const EditableName = (props: any) => {
    const {initial, updated, error, dispatch} = props
    const name = (updated == '' ? updated : (updated || initial.value))

    useEffect(() => {
        if (newStatus(COL_NAME, name) == FieldStatus.ERROR) {
            dispatch(registerError(buildError(props, COL_NAME, FieldStatus.ERROR)))
        }
    }, [])

    const updateValue = (updatedValue: string) => {
        props.dispatch(registerUpdate(
            buildUpdate(props, COL_NAME, updatedValue)
        ))
    };

    return (
        <>
            <EditableText value={name} onChange={updateValue}/>
            {renderError(error, COL_NAME)}
        </>
    )
}


export default connect(buildStatePropMapper(COL_NAME))(EditableName);