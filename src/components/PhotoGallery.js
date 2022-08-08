import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import {message} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import Gallery from 'react-grid-gallery';
import {BASE_URL, TOKEN_KEY} from "../constants";
import axios from "axios";
import jwt_decode from "jwt-decode";


const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

const wrapperStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
};


function PhotoGallery(props) {
    const [images, setImages] = useState(props.images);
    const [curImgIdx, setCurImgIdx] = useState(0);
    const token = localStorage.getItem(TOKEN_KEY);
    const decoded = jwt_decode(token);

    const imagaArr = images.map(image => {
        return {
            ...image,
            customOverlay: (
                <div style={captionStyle}>
                    <div>{` ${image.caption}`}</div>
                </div>
            )
        }
    });


    const onCurrentImageChange = (index) => {
        setCurImgIdx(index);
    };


    const onDeleteImage = () => {
        props.setproduct(curImgIdx);
        if (window.confirm(`Are you sure you want to delete this Product?`)) {
            const curProduct = props.product;
            console.log("delete product ", curProduct);
            const opt = {
                method: "POST",
                url: `${BASE_URL}/product-state-change/${curProduct.ID}`,
                data: {
                    State: "hidden"
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };
            console.log(opt);
            axios(opt)
                .then((res) => {
                    console.log("delete result -> ", res);
                    if (res.status === 200) {
                        message.success("Cancel Product success!").then();
                        window.location.reload(false);
                    }
                })
                .catch((err) => {
                    // case2: fail
                    message.error("Fetch posts failed!").then();
                    console.log("fetch posts failed: ", err.message);
                });
        }
    };

    useEffect(() => {
        props.setproduct(curImgIdx);
    }, [curImgIdx])

    const ShowDetail = () => {
        // history.push("/product");
        props.setShowDetail(true);
    }

    useEffect(() => {
        setImages(props.images);
    }, [props.images]);

    return (
        <div style={wrapperStyle}>
            <Gallery
                images={imagaArr}
                enableImageSelection={false}
                backdropClosesModal={true}
                currentImageWillChange={onCurrentImageChange}
                customControls={[
                    <div>
                        <button
                            style={{marginTop: "10px", marginLeft: "5px"}}
                            key="deleteImage"
                            type="primary"
                            icon={<DeleteOutlined/>}
                            size="small"
                            onClick={onDeleteImage}
                            disabled={props.product.UserId !== decoded.ID}
                        >
                            Cancel Product
                        </button>
                        ,
                        <button
                            onClick={ShowDetail}
                        >
                            Product detail
                        </button></div>

                ]}
            />

        </div>
    );
}

// data checking
PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            user: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired,
        })
    ).isRequired
};

export default PhotoGallery;