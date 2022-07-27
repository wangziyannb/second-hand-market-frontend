import React, {useState, useEffect} from "react";
import {message} from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
import {BASE_URL, TOKEN_KEY} from "../constants";
import ProductReleaseButton from "./ProductReleaseButton";
import ProductDetail from "./ProductDetail";
import {Backdrop, Box, CircularProgress} from "@mui/material";


function Home() {
    // post is a list as a useState
    const [posts, setPost] = useState([]);

    // this is the product index from the photoGallery
    const [curProduct, setCurProduct] = useState([]);

    // search option is a wrapper include a keyword
    const [searchOption, setSearchOption] = useState({
        keyword: ""
    });


    const [showDetail, setShowDetail] = useState(false);

    // callback function for handle search use in searchbar.js
    const handleSearch = (option) => {
        const {keyword} = option;
        setSearchOption({keyword: keyword})
    }


    // useEffect(() => {
    //     setShowPosts(true);
    // }, [curProduct]);

    // useEffect is a condition calling activate receiving callback when condition set the use effect make the first time render run this code
    useEffect(() => {
        fetchPost(searchOption);
    }, [searchOption]);

    const fetchPost = (option) => {
        //This is to go and get my search results for something that needs to be this search type

        //The first concern is the type of search. What is the search ah? From there, fill in the different this url

        const opt = {
            method: "POST", url: `${BASE_URL}/search`, data: {
                ProductName: option.keyword,
            }, headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    message.success("Fetch posts success!");
                    setPost(res.data);
                    // setShowPosts(true);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    };


    const renderPosts = () => {
        if (!posts || posts.length === 0) {
            return <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={!posts || posts.length === 0}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        } else {
            const product = posts[curProduct];

            const imageArr = posts
                .map((image) => {
                    //上面的是说我这个filter掉那些东西并将每个图转化为这个下面的数据形式，然后丢给photo gallery
                    //给的内容是下面这些，包括用户名和标题
                    return {
                        postId: image.ID,
                        src: image.Photo.photos[0],
                        user: image.User.UserName,
                        caption: image.ProductName,
                        thumbnail: image.Photo.photos[0],
                        onClickThumbnail: false,
                        thumbnailWidth: 300,
                        thumbnailHeight: 200
                    };
                });
            if (!showDetail) {
                return <PhotoGallery images={imageArr} setproduct={setCurProduct} setShowDetail={setShowDetail}/>;
            } else {
                return <ProductDetail productId={product.ID} setShowDetail={setShowDetail}/>
            }
        }
    };


    const operations = <ProductReleaseButton/>;


    return (<div className="home">
        <SearchBar handleSearch={handleSearch}/>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 8">
            </Box>
            <Box gridColumn="span 4">
                {operations}
            </Box>
        </Box>
        <div className="display">
            {renderPosts()}
        </div>
    </div>);
}


export default Home;