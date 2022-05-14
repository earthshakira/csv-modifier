import React, {ChangeEvent, useEffect} from "react";
import {columnNames, FieldStatus, Sex} from "../../fileprocessing/constants";
import {newStatus, registerError, registerUpdate} from "../../store/updatesReducer";
import {connect} from "react-redux";
import {HTMLSelect} from "@blueprintjs/core";
import {buildError, buildStatePropMapper, buildUpdate} from "../../utils";
import {renderError} from "../utils";


const COL_SEX = columnNames.SEX

const EditableSex = (props: any) => {
    const {initial, updated, error, dispatch} = props
    const sex = updated || initial.value

    useEffect(() => {
        if (newStatus(COL_SEX, sex) == FieldStatus.ERROR) {
            dispatch(registerError(buildError(props, COL_SEX, FieldStatus.ERROR)))
        }
    }, [])

    const updateValue = (e: ChangeEvent<HTMLSelectElement>) => {
        const updatedText = e.target.value
        props.dispatch(registerUpdate(
            buildUpdate(props, COL_SEX, updatedText)
        ))
    };
    return (
        <div>
            <HTMLSelect
                value={(error) ? '' : sex}
                onChange={updateValue}
            >
                <option disabled hidden value={''}>err!</option>
                <option value={Sex.FEMALE}> Female</option>
                <option value={Sex.MALE}> Male</option>
            </HTMLSelect>
            {renderError(error, COL_SEX)}
        </div>

    )
}


export default connect(buildStatePropMapper(COL_SEX))(EditableSex);