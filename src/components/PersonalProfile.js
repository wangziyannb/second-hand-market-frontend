import {BASE_URL, TOKEN_KEY} from "../constants";
import jwt_decode from "jwt-decode";
import React, {useEffect} from "react";
import axios from "axios";
import {message} from "antd";
import {useState} from "react";
import {
    Avatar,
    Backdrop,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    ListItemAvatar,
    Paper,
    styled
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';


function PersonalProfile(props) {

    // user profile toke decode
    const token = localStorage.getItem(TOKEN_KEY);
    const decoded = jwt_decode(token);
    const [userProfile, setUserProfile] = useState([]);
    const [userOrderHistory, setUserOrderHistory] = useState([]);

    // fetching state
    const [stillFetching, setStillFetching] = useState(true);

    useEffect(() => {
        fetchUserProfile();
        fetchUserOrderHistory();
    }, []);

    // useEffect(()=>{
    //
    // },[userProfile]);

    const fetchUserOrderHistory = () => {
        const opt = {
            method: "GET",
            url: `${BASE_URL}/order-history`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setUserOrderHistory(res.data);
                    setStillFetching(false)
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!").then();
                console.log("fetch posts failed: ", err.message);
            });
    }
    const fetchUserProfile = () => {
        const opt = {
            method: "GET",
            url: `${BASE_URL}/user-check/${decoded.ID}`,
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setUserProfile(res.data);
                    setStillFetching(false)
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!").then();
                console.log("fetch posts failed: ", err.message);
            });
    };

    // define the list style
    const Demo = styled('div')(({theme}) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const sellOrBuy = (value) => {
        if (value.BuyerId === decoded.ID) {
            return ("From" + "    " + value.SellerId);
        } else {
            return "To" + value.BuyerId;
        }
    }

    const orderList = userOrderHistory.map((value) =>
        <ListItem
            secondaryAction={
                <IconButton edge="end" aria-label="delete">
                    <DeleteIcon/>
                </IconButton>
            }
        >
            <ListItemAvatar>
                <Avatar>
                    <FolderIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={value.ProductId}
                secondary={sellOrBuy(value)}
            />
        </ListItem>
    )


    const main = () => {
        if (stillFetching) {
            return (<Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={stillFetching}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>)
        } else {
            return (
                // personal profile
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Item>
                            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                                Personal Profile
                            </Typography>
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

                            </List></Item>

                    </Grid>

                    {/* Order history*/}
                    <Grid item xs={6} md={8}>
                        <Item>
                            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                                Order History
                            </Typography>
                            <Demo>
                                <List>
                                    {orderList}
                                </List>
                            </Demo>
                        </Item>
                        <Button variant="contained"
                                onClick={() => {
                                    props.setShowProfile(false)
                                }}>go back</Button>
                    </Grid>

                </Grid>

            )
        }
    }

    return (
        <div>{main()}</div>
    )
}

export default (PersonalProfile);