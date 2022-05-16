import {connect} from "react-redux";
import {Button, Card, Classes, H4, Icon, Intent} from "@blueprintjs/core";
import {adj, plural} from "../../utils";
import {sendToast} from "../../store/toastReducer";
import {useEffect} from "react";

function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateRecords, deleteRecords}} = state;

    let {filename} = ownProps;
    return {
        records: updateRecords[filename] || {},
        deletes: deleteRecords[filename] || {}
    }
}

const boxStyle = {
    width: "28%",
    height: "13em",
    textAlign: "center",
    display: "inline-block",
    marginLeft: "5%"
} as any;

function UploadConfirmation(props: any) {
    const {records, filename, deletes, closeModal, dispatch} = props
    const valid_records = Object.values(records).filter((d: any) => !d.errors && !deletes[d.localId]).length
    const deleteCount = Object.values(deletes).filter((d: any) => d.dbId).length
    const errors = Object.values(records).filter((d: any) => d.errors && !deletes[d.localId]).length

    useEffect(() => {
        if (!valid_records && !deleteCount) {
            closeModal();
            dispatch(sendToast({
                message: "Looks like you have no valid changes that can be uploaded, ensure all errors are fixed before uploading",
                intent: Intent.WARNING,
                icon: 'warning-sign'
            }))
        }
    }, [])

    return (
        <div>
            <div className={Classes.DIALOG_HEADER}>
                <Icon icon={'document'} intent={Intent.PRIMARY} size={30}/> <H4> Confirm your updates </H4>
                <Button icon={'cross'} minimal={true} onClick={closeModal}/>
            </div>
            <div className={Classes.DIALOG_BODY}>
                <div>
                    {
                        valid_records ? (
                            <div style={boxStyle}>
                                <Card>
                                    <Icon intent={Intent.SUCCESS} icon={'clean'} size={30}/>
                                    <br/><br/>
                                    <p>{`${valid_records} row${plural(valid_records)} ${adj(valid_records)} valid and will be uploaded`}</p>
                                </Card>
                            </div>
                        ) : ""
                    }

                    {
                        errors ? (
                            <div style={boxStyle}>
                                <Card>
                                    <Icon intent={Intent.DANGER} icon={'error'} size={30}/>
                                    <br/><br/>
                                    <p>{`${errors} row${plural(errors)} ${adj(errors)} invalid, won't be uploaded`}</p>
                                </Card>
                            </div>
                        ) : (
                            <span/>
                        )
                    }

                    {
                        deleteCount ? (
                            <div style={boxStyle}>
                                <Card>
                                    <Icon intent={Intent.WARNING} icon={'trash'} size={30}/>
                                    <br/><br/>
                                    <p>{`${deleteCount} row${plural(deleteCount)} will be deleted`}</p>
                                </Card>
                            </div>
                        ) : (
                            ""
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(UploadConfirmation)