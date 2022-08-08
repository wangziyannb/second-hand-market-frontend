import React from "react";
import {Route, Switch, Redirect} from "react-router";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import PersonalProfile from "./PersonalProfile";

function Main(props) {

    const {isLoggedIn, handleLoggedIn} = props

    const showLogin = () => {
        return isLoggedIn
            ? (<Redirect to="/home"/>)
            : (<Login handleLoggedIn={handleLoggedIn}/>)
    }

    const showHome = () => {
        return props.showProfile ? (<Redirect to="/profile"/>) :
            isLoggedIn ? <Home logout={props.logout}/> : <Redirect to="/login"/>
    }

    const ProductDetail = () => {
        return <ProductDetail/>
    }

    const GotoProfile = () => {
        return !props.showProfile ? (<Redirect to="/home"/>) :
            isLoggedIn
                ? <PersonalProfile setShowProfile={props.setShowProfile}/>
                : (<Login handleLoggedIn={handleLoggedIn}/>)
    }

    return (
        <div className="main">
            <Switch>
                {/*decide which component go from extracting url*/}
                <Route path="/" exact render={showLogin}/>
                <Route path="/login" component={showLogin}/>
                <Route path="/register" component={Register}/>
                <Route path="/home" component={showHome}/>
                <Route path="/product" component={ProductDetail}/>
                <Route path="/profile" component={GotoProfile}/>
            </Switch>
        </div>

    );
}

export default Main;