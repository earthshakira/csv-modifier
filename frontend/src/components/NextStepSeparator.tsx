import {Icon} from "@blueprintjs/core";
import * as React from "react";

const NextStepSeparator = () => {
    return (
        <div style={{textAlign: "center"}}>
            <br/>
            <br/>
            <Icon style={{color: 'lightgray'}}
                  icon={"double-chevron-down"}
                  size={60}/>
            <br/>
            <br/>
        </div>
    );
}
export default NextStepSeparator;