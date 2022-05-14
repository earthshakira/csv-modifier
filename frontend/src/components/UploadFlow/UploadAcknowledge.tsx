import {connect} from "react-redux";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateRecords}} = state;

    let {filename} = ownProps;
    return {
        records: updateRecords[filename]
    }
}

function UploadAck(props: any) {

    return (
        <div>
        </div>
    )
}

export default connect(mapStateToProps)(UploadAck)