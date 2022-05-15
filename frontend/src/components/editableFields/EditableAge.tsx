import React, {useEffect} from "react";
import {columnNames, FieldStatus} from "../../fileprocessing/constants";
import {newStatus, registerError, registerUpdate} from "../../store/updatesReducer";
import {EditableText} from "@blueprintjs/core";
import {connect} from "react-redux";
import {buildError, buildStatePropMapper, buildUpdate, deletedStylingClass} from "../../utils";
import {renderError} from "../utils";


const COL_AGE = columnNames.AGE;
const formattedAge = (age: any) => {
    if (age != null && typeof age !== 'string')
        return age.toString()
    return age
}
const EditableAge = (props: any) => {
    const {initial, updated, deleted, error, dispatch} = props
    const age = (updated == '' ? updated : (updated || initial.value))
    useEffect(() => {
        if (newStatus(COL_AGE, formattedAge(age)) == FieldStatus.ERROR) {
            dispatch(registerError(buildError(props, COL_AGE, FieldStatus.ERROR)))
        }
    }, [])

    const updateValue = (updatedValue: string) => {
        props.dispatch(registerUpdate(
            buildUpdate(props, COL_AGE, updatedValue)
        ))
    };


    return (
        <>
            <div className={deletedStylingClass(deleted)}>
                <EditableText disabled={deleted} value={age} type={'number'} onChange={updateValue}/>
                {renderError(error, COL_AGE)}
            </div>
        </>
    )
}


export default connect(buildStatePropMapper(COL_AGE))(EditableAge);