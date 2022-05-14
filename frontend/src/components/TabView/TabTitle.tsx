import {Button, Classes, Intent} from "@blueprintjs/core";
import {connect} from "react-redux";
import {Tooltip2} from "@blueprintjs/popover2";
import {plural} from "../../utils";


function mapStateToProps(state: any, ownProps: any) {
    let {updatesReducer: {updateStats, errorStats}} = state;
    let {filename} = ownProps;
    return {
        errors: errorStats[filename],
        updates: updateStats[filename]
    }
}

function TabTitle(props: any) {
    let {updates, errors, filename} = props;
    let icon: any = 'th';
    let intent: Intent = Intent.NONE
    let message: string = ''
    if (updates) {
        intent = Intent.WARNING
        icon = 'offline'
        message = `${updates} update${plural(updates)} pending`
    }
    if (errors) {
        intent = Intent.DANGER
        icon = 'error'
        message = `${errors} error${plural(errors)} in file`
    }

    const buttonClass = `${Classes.MINIMAL} no-focus`
    return (
        <div>
            {message ? (
                <Tooltip2
                    content={message}
                    placement={"top"}
                >
                    <Button className={buttonClass} intent={intent} icon={icon} text={filename}/>
                </Tooltip2>
            ) : (
                <Button className={buttonClass} intent={intent} icon={icon} text={filename}/>
            )}
            <Button className={buttonClass} intent={Intent.DANGER} icon={'cross'}/>
        </div>
    )
}

export default connect(mapStateToProps)(TabTitle);