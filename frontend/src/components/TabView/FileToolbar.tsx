import {connect} from "react-redux";
import {Button, ButtonGroup, DialogStep, Intent, MultistepDialog} from "@blueprintjs/core";
import {useState} from "react";
import UploadConfirmation from "../UploadFlow/UploadConfirmation";
import UploadRecords from "../UploadFlow/UploadRecords";
import {clearDeletes, clearUpdates} from "../../store/updatesReducer";
import {updateFile} from "../../store/filesReducer";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateStats, errorStats, deletedStats}} = state;

    let {filename} = ownProps;
    return {
        errors: errorStats[filename],
        updates: updateStats[filename],
        deletes: deletedStats[filename]
    }
}

interface IState {
    dialogIsOpen?: boolean,
    step?: number,
    awaitingUpload?: boolean,
    updatedRecords?: any[],
    initialStep?: number
}

const INITIAL_STATE: IState = {
    dialogIsOpen: false,
    awaitingUpload: true,
    updatedRecords: [],
    initialStep: 0,
}

function FileToolbar(props: any) {
    const {updates, errors, deletes, filename, dispatch} = props
    const [state, setState] = useState(INITIAL_STATE)

    const {dialogIsOpen, awaitingUpload, initialStep, updatedRecords} = state;
    const openDialog = function () {
        setState({...state, dialogIsOpen: true, awaitingUpload: true})
    }
    const closeModal = () => {
        setState({...state, dialogIsOpen: false, awaitingUpload: false})
    }

    const handleClose = function () {
        dispatch(clearUpdates({filename, updatedRecords}))
        dispatch(clearDeletes({filename}))
        dispatch(updateFile({filename, updatedRecords, fileClose: true}))
        setState(INITIAL_STATE)
    }

    let uploadCompleted = (records: any[]) => {
        setState({...state, awaitingUpload: false, updatedRecords: records, initialStep: 1})
    }

    return (
        <div>
            {/* TODO: filters*/}
            {/*<ButtonGroup>*/}
            {/*    <H5 style={{marginTop: "0.3em", marginBottom: "-0.3em", marginRight: "1em"}}>Filters:</H5>*/}
            {/*    <Button icon={'eye-open'}> All </Button>*/}
            {/*    <Button icon={'error'} disabled={!errors}> Error </Button>*/}
            {/*    <Button icon={'offline'} disabled={!updates}> Unsaved </Button>*/}
            {/*    <Button icon={'trash'} disabled={!deletes}> Deleted </Button>*/}
            {/*</ButtonGroup>*/}
            <ButtonGroup style={{float: 'right'}}>
                <Button intent={Intent.PRIMARY}
                        icon={'cloud-upload'}
                        disabled={!updates && !deletes}
                        onClick={openDialog}
                > Upload Changes</Button>
                {/*<Button icon={'cloud-download'}> Sync </Button>*/}
            </ButtonGroup>
            <MultistepDialog
                isOpen={dialogIsOpen}
                onClose={handleClose}
                navigationPosition={'left'}
                backButtonProps={{disabled: true}}
                finalButtonProps={{
                    text: "Ok!",
                    disabled: awaitingUpload,
                    onClick: handleClose,
                }}
                initialStepIndex={initialStep}
            >
                <DialogStep id={'confirmation'} title={"Confirmation"}
                            panel={<UploadConfirmation filename={filename} closeModal={closeModal}/>}/>
                <DialogStep id={'upload'} title={"Upload Records"}
                            panel={<UploadRecords
                                filename={filename}
                                uploadDone={!awaitingUpload}
                                onUploadCompleted={uploadCompleted}
                            />}
                />
            </MultistepDialog>
        </div>
    )
}

export default connect(mapStateToProps)(FileToolbar)
