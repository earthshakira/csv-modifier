import {connect} from "react-redux";
import {Button, ButtonGroup, DialogStep, H5, Intent, MultistepDialog} from "@blueprintjs/core";
import {useState} from "react";
import UploadConfirmation from "../UploadFlow/UploadConfirmation";
import UploadRecords from "../UploadFlow/UploadRecords";
import {clearUpdates} from "../../store/updatesReducer";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateStats, errorStats}} = state;

    let {filename} = ownProps;
    return {
        errors: errorStats[filename],
        updates: updateStats[filename]
    }
}

interface IState {
    dialogIsOpen?: boolean,
    step?: number,
    awaitingUpload?: boolean,
    updatedRecords?: any[],
    initialStep?: number
}

function FileToolbar(props: any) {
    const {updates, errors, deletes, filename, dispatch} = props
    const [state, setState] = useState({
        dialogIsOpen: false,
        awaitingUpload: true,
        updatedRecords: [],
        initialStep: 0,
    } as IState)
    console.log('toolbarstate', state)
    const { dialogIsOpen, awaitingUpload, initialStep} = state;
    const openDialog = function () {
        setState({...state,dialogIsOpen: true, awaitingUpload: true})
    }
    const handleClose = function () {
        dispatch()
        dispatch()
    }

    let uploadCompleted = (records: any[]) => {
        console.log('uploadComplete', records)
        setState({...state,awaitingUpload: false, updatedRecords: records, initialStep: 1})
    }
    console.log('rendered FileToolbar')
    return (
        <div>
            <ButtonGroup>
                <H5 style={{marginTop: "0.3em", marginBottom: "-0.3em", marginRight: "1em"}}>Filters:</H5>
                <Button icon={'eye-open'}> All </Button>
                <Button icon={'error'} disabled={!errors}> Error </Button>
                <Button icon={'offline'} disabled={!updates}> Unsaved </Button>
                <Button icon={'trash'} disabled={!deletes}> Deleted </Button>
            </ButtonGroup>
            <ButtonGroup style={{float: 'right'}}>
                <Button intent={Intent.PRIMARY}
                        icon={'cloud-upload'}
                        disabled={!updates}
                        onClick={openDialog}
                > Upload Changes</Button>
                <Button icon={'cloud-download'}> Sync </Button>
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
                            panel={<UploadConfirmation filename={filename}/>}/>
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
