import React from "react";
import {Button, Intent} from "@blueprintjs/core";
import {connect} from "react-redux";
import {createDeleteMapper, deleteRow, restoreRow} from "../../store/updatesReducer";

const COL_NAME = 'delete';

function mapStateToProps(state: any, ownProps: any) {
    const {file, id} = ownProps;
    return {
        deleted: createDeleteMapper(state.updatesReducer, file, id)
    }
}


const DeleteButton = (props: any) => {
    const {file, id, dbId, deleted, dispatch} = props;

    const dispatchDelete = () => {
        dispatch(deleteRow({file, id, dbId}))
    }

    const dispatchRestore = () => {
        dispatch(restoreRow({file, id, dbId}))
    }
    return (
        <>
            {deleted ? (
                <Button className={'no-focus'}
                    intent={Intent.NONE}
                    minimal={true}
                    icon={'undo'}
                    onClick={dispatchRestore}
            />
            ) : (
                <Button className={'no-focus'}
                        intent={Intent.DANGER}
                        minimal={true}
                        icon={'trash'}
                        onClick={dispatchDelete}
                />
            )}
        </>
    )
}


export default connect(mapStateToProps)(DeleteButton);