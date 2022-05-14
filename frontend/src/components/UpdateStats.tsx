import {connect} from "react-redux";
import {Intent, Tag} from "@blueprintjs/core";
import {plural} from "../utils";

function mapStateToProps(state: any) {
    return {
        updates: state.updatesReducer.updateStats,
        errors: state.updatesReducer.errorStats
    }
}

function UpdateStats(props: any) {
    const filesChanged = Object.keys(props.updates).length
    const updates = Object.values(props.updates).reduce((a, b) => Number(a) + Number(b), 0)
    const filesErrored = Object.keys(props.errors).length
    const errors = Object.values(props.errors).reduce((a, b) => Number(a) + Number(b), 0)

    return (

        <div style={{marginTop: "1em"}}>
            {
                updates ?
                    (
                        <Tag intent={Intent.WARNING} icon={'offline'}>
                            {`${updates} update${plural(updates)} in ${filesChanged} file${plural(filesChanged)}`}
                        </Tag>
                    ) : (
                        <Tag intent={Intent.SUCCESS} icon={'saved'}>
                            All updates are on server
                        </Tag>
                    )
            }
            &nbsp;&nbsp;&nbsp;
            {
                errors ?
                    (
                        <Tag intent={Intent.DANGER} icon={'error'}>
                            {`${errors} error${plural(errors)} in ${filesErrored} file${plural(filesErrored)}`}
                        </Tag>
                    ) : (
                        <Tag intent={Intent.SUCCESS} icon={'clean'}>
                            No Errors
                        </Tag>
                    )
            }

        </div>
    );
}

export default connect(mapStateToProps)(UpdateStats);