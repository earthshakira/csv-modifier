import {connect} from "react-redux";
import {Card, Classes, H4, Icon, Intent} from "@blueprintjs/core";
import {adj, plural} from "../../utils";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateRecords, deleteRecords}} = state;

    let {filename} = ownProps;
    return {
        records: updateRecords[filename] || {},
        deletes: deleteRecords[filename] || {}
    }
}

function UploadConfirmation(props: any) {
    const {records, filename, deletes} = props
    console.log(props)
    const valid_records = Object.values(records).filter((d: any) => !d.errors && !deletes[d.localId]).length
    const deleteCount = Object.values(deletes).filter((d: any) => d.dbId).length
    const errors = Object.values(records).filter((d: any) => d.errors && !deletes[d.localId]).length
    return (
        <div>
            <div className={Classes.DIALOG_HEADER}>
                <Icon icon={'document'} intent={Intent.PRIMARY} size={30}/> <H4> Confirm your updates </H4>
            </div>
            <div className={Classes.DIALOG_BODY}>
                {
                    valid_records ? (
                        <>
                            <Card style={{width: "30%", textAlign: "center", display: "inline-block"}}>
                                <Icon intent={Intent.SUCCESS} icon={'clean'} size={30}/>
                                <br/><br/>
                                <p>{`${valid_records} row${plural(valid_records)} ${adj(valid_records)} valid and will be uploaded`}</p>
                            </Card>
                        </>
                    ) : ""
                }

                {
                    errors ? (
                        <>
                            <Card style={{width: "30%", textAlign: "center", display: "inline-block", marginLeft:"5%"}}>
                                <Icon intent={Intent.DANGER} icon={'error'} size={30}/>
                                <br/><br/>
                                <p>{`${errors} row${plural(errors)} ${adj(errors)} invalid and will not be uploaded`}</p>
                            </Card>
                        </>
                    ) : (
                        ""
                    )
                }

                {
                    deleteCount ? (
                        <>
                            <Card style={{width: "30%", textAlign: "center", display: "inline-block", marginLeft:"5%"}}>
                                <Icon intent={Intent.WARNING} icon={'trash'} size={30}/>
                                <br/><br/>
                                <p>{`${deleteCount} row${plural(deleteCount)} will be deleted`}</p>
                            </Card>
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