import React, {useState, useEffect} from "react";
import {BASE_URL, TOKEN_KEY} from "../constants";
import axios from "axios";
import {message} from "antd";
import jwt_decode from "jwt-decode";
import OrderMake from "./OrderMake";
import {Backdrop, Box, Button, CircularProgress, ImageList, ImageListItem} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

function ProductDetail(props) {

    const token = localStorage.getItem(TOKEN_KEY);

    const decoded = jwt_decode(token);

    const productId = props.productId

    const [product, setProduct] = useState([]);

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    const [fetching, setFetching] = useState(true);


    useEffect(() => {
        fetchPost();
    }, []);

    const [confirmLoading] = useState(false);

    const fetchPost = () => {
        // define the opt and send the request
        const opt = {
            method: "GET",
            url: `${BASE_URL}/product/${productId}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.data);
                    setFetching(false)
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    };


    const backToMain = () => {
        props.setShowDetail(false);
    }

    const submit = (props) => {
        const opt = {
            method: "Post",
            url: `${BASE_URL}/order-place`,
            data:
                {
                    SellerId: product.User.ID,
                    BuyerId: decoded.ID,
                    ProductId: productId,
                    Qty: product.Qty,
                    PlaceTime: today.toISOString(),
                    Price: product.Price,
                    DeliveryAddress: props.Address,
                    DeliveryType: props.DeliverFunction
                }
            ,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };
        console.log(opt)

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    message.success("order place successfully")
                    backToMain();
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    }


    const pending = () => {
        if (fetching) {
            return (<Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={fetching}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>)
        } else {
            return (<Box sx={{width: 1}}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                    <ImageList sx={{width: 500, height: 450}} cols={3} rowHeight={164}>
                        {product.Photo.photos.map((item) => (
                            <ImageListItem key={item}>
                                <img
                                    src={`${item}`}
                                    srcSet={`${item}`}
                                    alt={item.title}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <Box gridColumn="span 8">
                        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Product Name"
                                    secondary={
                                        <React.Fragment>

                                            {product.ProductName}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>

                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Price"
                                    secondary={
                                        <React.Fragment>
                                            {product.Price}$
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>

                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Contact Phone"
                                    secondary={
                                        <React.Fragment>
                                            {product.User.Phone}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>

                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Contact Email"
                                    secondary={
                                        <React.Fragment>
                                            {product.User.Email}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>

                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Product Condition"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{display: 'inline'}}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {product.Condition}---
                                            </Typography>
                                            {product.Description}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>


                            <OrderMake confirmLoading={confirmLoading} handleOk={submit}/>
                            <Divider>Or</Divider>
                            <Button variant="contained"
                                    onClick={() => {
                                        props.setShowDetail(false)
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

export default ProductDetail;
