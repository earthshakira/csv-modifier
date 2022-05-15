import * as React from "react";
import {useRef} from "react";
import {Toaster} from "@blueprintjs/core";
import {connect} from "react-redux";

function mapStateToProps(state: any) {
    return {
        toast: state.toaster
    }
}

function ToasterContainer(props: any) {
    const {toast} = props;
    const toaster = useRef<Toaster>(null) as any;
    if (toast.change > 0)
        toaster.current?.show({...props.toast})
    return (
        <Toaster ref={toaster}/>
    )
}

export default connect(mapStateToProps)(ToasterContainer)