import React, {forwardRef} from "react";
import {Form, Upload, Input} from "antd";
import {InboxOutlined} from "@ant-design/icons";


export const SellForm = forwardRef((props, formRef) => {
    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14}
    };

    const normFile = (e) => {
        //can upload more than one file
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };


    return (
        <Form name="validate_other" {...formItemLayout} ref={formRef}>
            <Form.Item
                name="ProductName"
                label="ProductName"
                rules={[
                    {
                        required: true,
                        message: "Please input your ProductName"
                    }
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name="Price"
                label="Price"
                rules={[
                    {
                        required: true,
                        message: "Please input your product Price"
                    }
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name="Description"
                label="Description"
                rules={[
                    {
                        required: true,
                        message: "Please input your product Description"
                    }
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name="Qty"
                label="Qty"
                rules={[
                    {
                        required: true,
                        message: "Please input your product Qty"
                    }
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name="Condition"
                label="Condition"
                rules={[
                    {
                        required: true,
                        message: "Please input your product Condition"
                    }
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item label="Dragger">
                <Form.Item
                    name="uploadPost"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                    rules={[
                        {
                            required: true,
                            message: "Please select an image/video!"
                        }
                    ]}
                >
                    {/*before upload prevent upload automatically*/}
                    <Upload.Dragger name="files" beforeUpload={() => false}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>
        </Form>
    );
});

