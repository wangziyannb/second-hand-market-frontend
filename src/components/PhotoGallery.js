import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import {message} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import Gallery from 'react-grid-gallery';
import {BASE_URL, TOKEN_KEY} from "../constants";
import axios from "axios";


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
        console.log("curIdx ", index);
        setCurImgIdx(index);
    };

    // not implement
    const onDeleteImage = () => {
        if (window.confirm(`Are you sure you want to delete this Product?`)) {
            const curImg = images[curImgIdx];
            const newImageArr = images.filter((img, index) => index !== curImgIdx);
            console.log("delete image ", newImageArr);
            const opt = {
                method: "DELETE",
                url: `${BASE_URL}/post/${curImg.postId}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };

            axios(opt)
                .then((res) => {
                    console.log("delete result -> ", res);
                    // case1: success
                    if (res.status === 200) {
                        // step1: set state
                        setImages(newImageArr);
                    }
                })
                .catch((err) => {
                    // case2: fail
                    message.error("Fetch posts failed!");
                    console.log("fetch posts failed: ", err.message);
                });
        }
    };


    const ShowDetail = () => {
        props.setproduct(curImgIdx);
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
                // 下面这个给图片加图标，很酷，可以删除的按钮
                customControls={[
                    <div><button
                        style={{marginTop: "10px", marginLeft: "5px"}}
                        key="deleteImage"
                        type="primary"
                        icon={<DeleteOutlined/>}
                        size="small"
                        onClick={onDeleteImage}
                    >
                        Delete Image
                    </button>,
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

// 这一段是对数据类型进行校验
PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
        //其中是一个class，包含一下attribute
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