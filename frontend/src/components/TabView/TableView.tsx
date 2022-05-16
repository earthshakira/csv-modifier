import {Card, Elevation, Tab, TabId, Tabs} from "@blueprintjs/core";
import TableEditor from "./TableEditor";
import * as React from "react";
import {connect} from "react-redux";
import {setActiveFile} from "../../store/filesReducer";
import UpdateStats from "../UpdateStats";
import TabTitle from "./TabTitle";

const mapStateToProps = function (state: any) {
    return {
        files: state.csvReducer.fileNames,
        activeFile: state.csvReducer.activeFile
    }
}

type TableViewProps = {
    files: string[]
    activeFile: string
    dispatch: any
}


function TableView(props: TableViewProps) {

    const handleTabChange = (activeTabId: TabId) => props.dispatch(setActiveFile({filename: activeTabId}));
    console.log('rerendered tableView')
    return (
        <Card interactive={true} elevation={Elevation.TWO}>
            <Tabs
                animate={true}
                id="CSVEditorTabs"
                renderActiveTabPanelOnly={true}
                large={true}
                selectedTabId={props.activeFile}
                onChange={handleTabChange}
            >
                {props.files.map((fileName) =>
                    <Tab id={fileName} key={fileName}
                         title={<TabTitle filename={fileName}/>}
                         panel={<TableEditor fileName={fileName}/>}/>)}
                <Tabs.Expander/>
            </Tabs>
            <UpdateStats/>
        </Card>
    )
}

export default connect(mapStateToProps)(TableView);