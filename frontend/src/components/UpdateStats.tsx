import {connect} from "react-redux";
import {Intent, Tag} from "@blueprintjs/core";
import {adj, plural} from "../utils";

function mapStateToProps(state: any) {
    return {
        updates: state.updatesReducer.updateStats,
        errors: state.updatesReducer.errorStats,
        deletes: state.updatesReducer.deletedStats
    }
}

function aggregateStats(stats: any) {
    const files = Object.keys(stats).length;
    const total = Object.values(stats).reduce((a, b) => Number(a) + Number(b), 0)
    return {files, total}
}

function UpdateStats(props: any) {
    const {files: filesChanged, total: updates} = aggregateStats(props.updates)
    const {files: filesErrored, total: errors} = aggregateStats(props.errors)
    const {files: filesDeleted, total: deletes} = aggregateStats(props.deletes)

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
            &nbsp;&nbsp;&nbsp;
            {
                deletes ?
                    (
                        <Tag intent={Intent.WARNING} icon={'delete'}>
                            {`${deletes} row${plural(errors)} ${adj(deletes)} deleted in ${filesDeleted} file${plural(filesDeleted)}`}
                        </Tag>
                    ) : ("")
            }

        </div>
    );
}

export default connect(mapStateToProps)(UpdateStats);