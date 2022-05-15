import './App.css';
import * as React from "react";
import {useEffect, useRef, useState} from "react";

import {Button, Classes, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Toaster} from "@blueprintjs/core";
import CSVReader from "./components/FileInput";
import TableView from './components/TabView/TableView';
import NextStepSeparator from "./components/NextStepSeparator";
import ToasterContainer from "./components/ToasterContainer";



export class App extends React.PureComponent {

    public render() {
        return (
            <div>
                <ToasterContainer />
                <Navbar className={Classes.DARK}>
                    <NavbarGroup>
                        <NavbarHeading>EDM - Employee Data Modifier</NavbarHeading>
                        <NavbarDivider/>
                        <Button className={Classes.MINIMAL} icon="document" text="Files"/>
                    </NavbarGroup>
                </Navbar>
                <div style={{width: "80%", marginLeft: "10%"}}>
                    <br/>
                    <div style={{width: "50%", marginLeft: "25%"}}>
                        <CSVReader/>
                    </div>
                    <NextStepSeparator/>
                    <TableView/>
                </div>
            </div>
        );
    }
}


export default App;
