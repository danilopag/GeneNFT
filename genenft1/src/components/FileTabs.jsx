import React from "react";
import { useState } from 'react';
import { Container, Row, Tabs, Nav, Col, Tab } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import FileUpload from './FileUpload';
//import './tabStyle.css';

const FileTabs = () =>{
    const [key, setKey] = useState('home');
            return (
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                    <Tab eventKey="home" title="Home">
                        PROVA
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        PROVA
                    </Tab>
                    <Tab eventKey="contact" title="Contact" disabled>
                        PROVA
                    </Tab>
                </Tabs>
            );
        }

export default FileTabs;