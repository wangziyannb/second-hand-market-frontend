import '../styles/App.css';
import React, {useState} from "react";
import TopBar from "./TopBar";
import Main from "./Main"
import {TOKEN_KEY} from "../constants";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        // isLoggedIn is a state value, setIsLoggedIn is a function that set that state
        !!localStorage.getItem(TOKEN_KEY)
    )

    const [showProfile, setShowProfile] = useState(false);

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
                    handleLogout={logout}
                    setShowProfile={setShowProfile}/>
            <Main isLoggedIn={isLoggedIn}
                  handleLoggedIn={loggedIn}
                  logout={logout}
                  showProfile={showProfile}
                  setShowProfile={setShowProfile}/>
        </div>
    );
}

export default App;
