import {connect} from "react-redux";
import {Button, ButtonGroup, Classes, Divider, H5, Intent} from "@blueprintjs/core";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateStats, errorStats}} = state;
    let {filename} = ownProps;
    return {
        errors: errorStats[filename],
        updates: updateStats[filename]
    }
}

function FileToolbar(props: any) {
    let {updates, errors, deletes} = props
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
                <Button intent={Intent.PRIMARY} disabled={!updates} icon={'cloud-upload'}> Upload Changes</Button>
                <Button icon={'cloud-download'}> Sync </Button>
            </ButtonGroup>
        </div>
    )
}

export default connect(mapStateToProps)(FileToolbar)
