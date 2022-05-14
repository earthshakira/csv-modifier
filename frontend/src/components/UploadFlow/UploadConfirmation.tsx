import {connect} from "react-redux";
import {Classes, H4, Icon, Intent} from "@blueprintjs/core";
import {plural} from "../../utils";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateRecords}} = state;

    let {filename} = ownProps;
    return {
        records: updateRecords[filename]
    }
}

function UploadConfirmation(props: any) {
    const {records, filename} = props
    const valid_records = Object.values(records).filter((d: any) => d.errors == 0).length
    const errors = Object.keys(records).length - valid_records;
    return (
        <div>
            <div className={Classes.DIALOG_HEADER}>
                <Icon icon={'document'} intent={Intent.PRIMARY} size={30}/> <H4> Confirm your updates </H4>
            </div>
            <div className={Classes.DIALOG_BODY}>
                    <Icon intent={Intent.SUCCESS} icon={'clean'} size={25}/>
                    <p>{`${valid_records} row${plural(valid_records)} are valid and will be uploaded`}</p>
                    {
                        errors ? (
                            <>
                                <Icon intent={Intent.DANGER} icon={'error'} size={25}/>
                                <p>{`${errors} row${plural(errors)} are invalid and will not be uploaded`}</p>
                            </>
                        ) : (
                            ""
                        )
                    }
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(UploadConfirmation)