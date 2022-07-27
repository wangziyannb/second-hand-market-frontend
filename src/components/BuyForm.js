import React, { forwardRef } from "react";
import { Form, Input } from "antd";

//a callback function is wrapped with a callback function to allow the parent component to defer.
export const BuyForm = forwardRef((props, formRef) => {
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    };

    return (
        <Form name="validate_other" {...formItemLayout} ref={formRef}>
            <Form.Item
                name="Address"
                label="Address"
                rules={[
                    {
                        required: true,
                        message: "Please input your Address"
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="DeliverFunction"
                label="Deliver Function"
                rules={[
                    {
                        required: true,
                        message: "Please input your Deliver Function"
                    }
                ]}
            >
                <Input />
            </Form.Item>
        </Form>
    );
});

