
import '../styles/App.css';
import React, {useState} from "react";
import TopBar from "./TopBar";
import Main from "./Main"
import {TOKEN_KEY} from "../constants";

function App() {
    // this is second component, down there is the topbar and the main component

    // prepare a hook prop, which is a use state
    const [isLoggedIn, setIsLoggedIn] = useState(
        // isLoggedIn is a state value, setIsLoggedIn is a function that set that state
        !!localStorage.getItem(TOKEN_KEY)
    )



    // the call back function for the topbar component
    const logout = () => {
        console.log('logout')
        localStorage.removeItem(TOKEN_KEY)
        setIsLoggedIn(false)
    }

    // the call back function for the main component
    const loggedIn = (token) => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token)
            setIsLoggedIn(true)
        }
    }



    return (
        <div className="App">
            <TopBar isLoggedIn={isLoggedIn}
                    handleLogout={logout}/>
            <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn}/>
        </div>
    );
}

export default App;
