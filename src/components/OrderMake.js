import React, {Component} from "react";
import {Modal} from "antd";


import {BuyForm} from "./BuyForm";
import {Button} from "@mui/material";

class OrderMake extends Component {
    state = {
        visible: false,
        confirmLoading: this.props.confirmLoading
    };

    showModal = () => {
        // form show state
        this.setState({
            visible: true
        });
    };

    handleOk = () => {
        // onclick from submitting form
        this.setState({
            confirmLoading: true
        });

        // get form data
        this.postForm
            .validateFields()
            .then((form) => {
                // const {Address, DeliverFunction} = form;
                console.log(form)
                this.props.handleOk(form)
            })
            .catch((err) => {
                console.log("err ir validate form -> ", err);
                this.setState({
                    confirmLoading: false
                });
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
                <Button variant="contained" onClick={this.showModal}>
                    Buy Now!
                </Button>

                <Modal
                    title="Address and Deliver Function"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="Order Now!"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <BuyForm ref={(refInstance) => (this.postForm = refInstance)}/>
                    {/*    Here need to give the post form component the Ref instance*/}
                </Modal>
            </div>
        );
    }
}

export default OrderMake;