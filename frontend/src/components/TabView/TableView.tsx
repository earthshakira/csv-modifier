import {Card, Elevation, NonIdealState, Tab, TabId, Tabs} from "@blueprintjs/core";
import TableEditor from "./TableEditor";
import * as React from "react";
import {connect} from "react-redux";
import {setActiveFile} from "../../store/filesReducer";
import UpdateStats from "../UpdateStats";
import TabTitle from "./TabTitle";
import NextStepSeparator from "../NextStepSeparator";

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
    const {files, activeFile, dispatch} = props;

    const handleTabChange = (activeTabId: TabId) => dispatch(setActiveFile({filename: activeTabId}));
    if (!files.length)
        return (
            <>
                <br/>
                <br/>
                <br/>
                <NonIdealState
                    icon={'snowflake'}
                    iconSize={70}
                    title={'No Files Opened'}
                    description={'Please Upload a new File or Open a new file from the Nav Bar'}
                />
            </>
        )
    return (
        <>
            <NextStepSeparator/>
            <Card interactive={true} elevation={Elevation.TWO}>
                <Tabs
                    animate={true}
                    id="CSVEditorTabs"
                    renderActiveTabPanelOnly={true}
                    large={true}
                    selectedTabId={activeFile}
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
        </>
    )
}

export default connect(mapStateToProps)(TableView);