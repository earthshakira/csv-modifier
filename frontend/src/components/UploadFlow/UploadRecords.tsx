import {connect} from "react-redux";
import {Classes, H4, Icon, Intent} from "@blueprintjs/core";
import {useState} from "react";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateRecords}} = state;

    let {filename} = ownProps;
    return {
        records: updateRecords[filename]
    }
}

function FetchFile(props: any) {

}

function UploadRecords(props: any) {
    const [state, setState] = useState({
        step: 0,
        fileId: -1,
    })
    const {records, filename} = props
    const valid_records = Object.values(records).filter((d: any) => d.errors == 0)
    return (
        <div>
            <div className={Classes.DIALOG_HEADER}>
                <Icon icon={'document-share'} intent={Intent.PRIMARY} size={30}/> <H4> Uploading Records</H4>
            </div>
            <div className={Classes.DIALOG_BODY}>
                (s)
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(UploadRecords)