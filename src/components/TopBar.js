import React from 'react';
import logo from "../assets/images/logo.svg"
import {LogoutOutlined} from '@ant-design/icons'

function TopBar(props) {
    // the component behind the App component
    const {isLoggedIn, handleLogout} = props
    // extract the prop from App

    return (<header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <span className="App-title">
                Second-hand Market Web React-based App
        </span>
        {isLoggedIn ? <LogoutOutlined className='logout' onClick={handleLogout}/> : null}
    </header>);
}

export default TopBar;