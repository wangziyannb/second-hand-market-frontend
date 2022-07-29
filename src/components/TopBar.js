import React from 'react';
import logo from "../assets/images/logo.svg"
import {LogoutOutlined} from '@ant-design/icons'
import {Button} from "@mui/material";

function TopBar(props) {
    // the component behind the App component
    const {isLoggedIn, handleLogout} = props
    // extract the prop from App

    const toUserProfile = () => {
        props.setShowProfile(true);
    }

    return (<header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <span className="App-title">
                Second-hand Market Web React-based App
        </span>
        {isLoggedIn ? <span><Button onClick={toUserProfile}>Me</Button>
            <LogoutOutlined className='logout' onClick={handleLogout}/></span>
            : null}
    </header>);
}

export default TopBar;