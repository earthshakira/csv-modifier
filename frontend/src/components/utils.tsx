import {Icon, Intent, Tag} from "@blueprintjs/core";
import {Tooltip2} from "@blueprintjs/popover2";
import {VALIDATION_ERR_MESSAGE} from "../fileprocessing/constants";

export const renderError = (errStatus: number, column: string) => {
    if (errStatus != null)
        return (<>
            &nbsp;&nbsp;&nbsp;
            <Tooltip2
                content={VALIDATION_ERR_MESSAGE[column]}
                placement="right"
                openOnTargetFocus={false}
                usePortal={false}
            >
                <Icon intent={Intent.DANGER} icon={"error"}/>
            </Tooltip2>
        </>)
    return ""
}