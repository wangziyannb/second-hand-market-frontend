import React, {Component} from "react";
import {Modal, Button, message} from "antd";
import axios from "axios";

import {BASE_URL, TOKEN_KEY} from "../constants";


import {SellForm} from "./SellForm";

class ProductReleaseButton extends Component {
    state = {
        visible: false,
        confirmLoading: false
    };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true
        });

        // get form data
        this.postForm
            .validateFields()
            .then((form) => {
                const {ProductName, Price, description, Qty, Condition, uploadPost} = form;
                const {type, originFileObj} = uploadPost[0];
                const postType = type.match(/^(image|video)/g)[0];
                if (postType) {
                    let formData = new FormData();
                    formData.append("ProductName", ProductName);
                    formData.append("Price", Price);
                    formData.append("Description", description);
                    formData.append("Qty", Qty);
                    formData.append("Condition", Condition);
                    formData.append("Photo", originFileObj);
                    formData.append("State", "Pending");

                    const opt = {
                        method: "POST",
                        url: `${BASE_URL}/upload`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                        },
                        data: formData
                    };

                    axios(opt)
                        .then((res) => {
                            if (res.status === 200) {
                                message.success("The product is released!");
                                this.postForm.resetFields();
                                this.handleCancel(true);
                                this.setState({confirmLoading: false});
                            }
                        })
                        .catch(() => {
                            message.error("Failed to release product");
                            this.setState({confirmLoading: false});
                        });
                }
            })
            .catch((err) => {
                console.log("err ir validate form -> ", err);
            });
    };

    handleCancel = () => {
        console.log("Clicked cancel button");
        this.setState({
            visible: false
        });
    };

    render() {
        const {visible, confirmLoading} = this.state;
        return (
            <div>
                <Button variant="contained" size={"large"} onClick={this.showModal}>
                    Sell now!
                </Button>
                <Modal
                    title="Release your product for selling!"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="Release"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <SellForm ref={(refInstance) => (this.postForm = refInstance)}/>
                </Modal>
            </div>
        );
    }
}

export default ProductReleaseButton;