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
    const [product, setProduct] = useState([]);
    const [client, setClient] = useState([]);

    // fetching state
    const [stillFetching, setStillFetching] = useState(true);

    useEffect(() => {
        fetchUserProfile();
        fetchUserOrderHistory();
    }, []);

    useEffect(() => {
        fetchDetail();
        setStillFetching(false);
    }, [userOrderHistory]);

    const fetchUserProfile = () => {
        const opt = {
            method: "GET",
            url: `${BASE_URL}/user-check/${decoded.ID}`,
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setUserProfile(res.data);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!").then();
                console.log("fetch posts failed: ", err.message);
            });
    };

    const fetchUserOrderHistory = () => {
        // setStillFetching(prevState => !prevState);
        const opt = {
            method: "GET",
            url: `${BASE_URL}/order-history`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };
        console.log(localStorage.getItem(TOKEN_KEY));
        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setUserOrderHistory(res.data);
                    // setStillFetching(prevState => !prevState);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!").then();
                console.log("fetch posts failed: ", err.message);
            });
    }

    const fetchDetail = () => {
        userOrderHistory.map((order) => {
            if (order.SellerId === userProfile.ID) {
                getClient(order.BuyerId);
            } else {
                getClient(order.SellerId);
            }
            getProduct(order.ProductId)
        });
    }

    const getClient = (ID) => {
        const opt = {
            method: "GET",
            url: `${BASE_URL}/user-check/${ID}`,
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setClient(prevState => [...prevState, res.data.UserName])
                    // setStillFetching(false)
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!").then();
                console.log("fetch posts failed: ", err.message);
            });
    }


    const getProduct = (ID) => {
        // setStillFetching(prevState => !prevState);
        const opt = {
            method: "GET",
            url: `${BASE_URL}/product/${ID}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(prevState => [...prevState, res.data.ProductName]);
                    // setStillFetching(prevState => !prevState);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!").then();
                console.log("fetch posts failed: ", err.message);
            });
    }
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

    const sellOrBuy = (value, index) => {
        if (value.BuyerId === decoded.ID) {
            return ("From" + "    " + client[index]);
        } else {
            return "To" + client[index];
        }
    }

    const [currentDeleteOrder, setCurrentDeleteOrder] = useState();

    useEffect(() => {
        cancelOrder();
    }, [currentDeleteOrder]);

    const cancelOrder = () => {
        setStillFetching(true);
        const opt = {
            method: "POST",
            url: `${BASE_URL}/order-cancel/${currentDeleteOrder}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
        };
        console.log(opt);

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    message.success("Order cancel success").then(setStillFetching(false));
                }
            })
            .catch((err) => {
                if (currentDeleteOrder == null) {
                    return;
                }
                message.error("Order cancel failed!").then();
                console.log("Order cancel failed! ", err.message);
            });
    }

    const StatusChange = (value, index) => {
        if (value.BuyerId === decoded.ID) {
            return (<Button variant="contained"
                            onClick={() => {
                                sendStatusChangeRequest("completed", value.ID)
                            }} disabled={value.State==="pending"||value.State==="canceled"||value.State==="completed"}>Confirm received</Button>)
        } else {
            return (<Button variant="contained"
                            onClick={() => {
                                sendStatusChangeRequest("shipped", value.ID,index)} }
                            disabled={value.State==="shipped"||value.State==="canceled"||value.State==="completed"}>Send Confirmed</Button>)
        }
    }

    const sendStatusChangeRequest = ((status, Id) => {
        const opt = {
            method: "POST",
            url: `${BASE_URL}/order-state-change/${Id}`,
            data: {State: status},
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };
        setStillFetching(true);

        console.log(opt);
        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    message.success("Success").then();
                    window.location.reload(false);
                    setStillFetching(false);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!").then();
                console.log("fetch posts failed: ", err.message);
                setStillFetching(false);
            });
    })

    const orderList = userOrderHistory.map((value, index) =>

        <ListItem
            secondaryAction={

                <IconButton edge="end" aria-label="delete">
                    <DeleteIcon onClick={() => setCurrentDeleteOrder(value.ID)}/>
                </IconButton>
            }
        >
            <ListItemAvatar>
                <Avatar>
                    <FolderIcon/>
                </Avatar>
            </ListItemAvatar>

            <ListItemText
                primary={product[index] + " ：" + "status" + " => " + value.State}
                secondary={sellOrBuy(value, index)}
            />
            {StatusChange(value, index)}

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
                                                {userProfile.UserName}
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