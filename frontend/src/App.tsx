import './App.css';
import * as React from "react";

import {Button, Classes, Navbar, NavbarDivider, NavbarGroup, NavbarHeading} from "@blueprintjs/core";
import CSVReader from "./components/FileInput";
import TableView from './components/TabView/TableView';
import ToasterContainer from "./components/ToasterContainer";
import {useDispatch} from "react-redux";
import UploadedFiles from "./components/UploadedFiles";
import {openDialog} from "./store/uploadsReducer";


export function App() {

    const dispatch = useDispatch();
    return (
        <div>
            <ToasterContainer/>
            <Navbar className={Classes.DARK}>
                <NavbarGroup>
                    <NavbarHeading>EDM - Employee Data Modifier</NavbarHeading>
                    <NavbarDivider/>
                    <Button className={Classes.MINIMAL} onClick={() => {
                        dispatch(openDialog({}))
                    }} icon="document-share" text="Uploaded Files"/>
                    <UploadedFiles/>
                </NavbarGroup>
            </Navbar>
            <div style={{width: "80%", marginLeft: "10%"}}>
                <br/>
                <div style={{width: "50%", marginLeft: "25%"}}>
                    <CSVReader/>
                </div>
                <TableView/>
            </div>
        </div>
    );
}


export default App;
