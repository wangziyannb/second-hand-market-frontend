import {BASE_URL, TOKEN_KEY} from "../constants";
import jwt_decode from "jwt-decode";
import React, {useEffect} from "react";
import axios from "axios";
import {message} from "antd";
import {useState} from "react";
import {Backdrop, Box, Button, CircularProgress} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";


function PersonalProfile(props) {

    const token = localStorage.getItem(TOKEN_KEY);

    const decoded = jwt_decode(token);

    const [userProfile, setUserProfile] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = () => {
        // define the opt and send the request
        const opt = {
            method: "GET",
            url: `${BASE_URL}/user-check/${decoded.ID}`,
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setUserProfile(res.data);
                    setFetching(false)
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!").then();
                console.log("fetch posts failed: ", err.message);
            });
    };

    const pending = () => {
        if (fetching) {
            return (<Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={fetching}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>)
        } else {
            return (
                <Box sx={{width: 1}}>
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                        <Box gridColumn="span 8">
                            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="User Email"
                                        secondary={
                                            <React.Fragment>
                                                {userProfile.Email}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>

                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="User Name"
                                        secondary={
                                            <React.Fragment>
                                                {userProfile.UserName}$
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>

                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="Contact Phone"
                                        secondary={
                                            <React.Fragment>
                                                {userProfile.Phone}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>

                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="University Attribute"
                                        secondary={
                                            <React.Fragment>
                                                {userProfile.University}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>

                                {/*<OrderMake confirmLoading={confirmLoading} handleOk={submit}/>*/}
                                <Divider>Or</Divider>
                                <Button variant="contained"
                                        onClick={() => {
                                            props.setShowProfile(false)
                                        }}>go back</Button>
                            </List>
                        </Box>
                    </Box>
                </Box>)
        }
    }

    return (
        <div>{pending()}</div>
    )
}

export default (PersonalProfile);