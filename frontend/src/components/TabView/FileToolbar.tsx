import {connect} from "react-redux";
import {Button, ButtonGroup, DialogStep, H5, Intent, MultistepDialog} from "@blueprintjs/core";
import {useState} from "react";
import UploadConfirmation from "../UploadFlow/UploadConfirmation";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateStats, errorStats}} = state;

    let {filename} = ownProps;
    return {
        errors: errorStats[filename],
        updates: updateStats[filename]
    }
}

function FileToolbar(props: any) {
    const {updates, errors, deletes, filename} = props
    const [state, setState] = useState({
        dialogIsOpen: false
    })

    const openDialog = function () {
        setState({dialogIsOpen: true})
    }
    const handleClose = function () {

    }
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
                isOpen={state.dialogIsOpen}
                onClose={handleClose}
                navigationPosition={'left'}
            >
                <DialogStep id={'confirmation'} title={"Confirmation"}
                            panel={<UploadConfirmation filename={filename}/>}/>
                <DialogStep id={'upload'} title={"Upload Records"}
                            panel={<div> wassup 1</div>}/>
                <DialogStep id={'acknowledge'} title={"Done"}
                            panel={<div> wassup 1</div>}/>
            </MultistepDialog>
        </div>
    )
}

export default connect(mapStateToProps)(FileToolbar)
