import {Button, Divider, Flex, Form, Input, notification, Select} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";


function User() {

    const [users, setUsers] = useState([]);
    const [access, setAccess] = useState([]);

    const [api, contextHolder] = notification.useNotification();

    async function updateUsers() {
        let res = await axios.get(getApiUrl("user/get_all_user"), {withCredentials: true});
        if (res.status === 200) {
            setUsers(res.data)
        }
    }

    async function updateAccess() {
        let res = await axios.get(getApiUrl("user/get_all_access"), {withCredentials: true});
        if (res.status === 200) {
            setAccess(res.data)
        }
    }

    useEffect(() => {
        updateUsers();
        updateAccess();
    }, []);


    function onRegister(v) {
        axios.post(getApiUrl("user/add_user"), v, {withCredentials: true}).then(() => {
            api.success({
                message: "عملیات موفق!"
            })
        }).catch(err=>{
            api.error({
                message: "عملیات ناموفق!"
            });
            console.error(err);
        });
    }

    return(
        <Flex vertical={true}>
            {contextHolder}
            <Divider>ساخت جدید</Divider>
            <Form
                onFinish={v=>onRegister(v)}
            >
                <Form.Item
                    label="نام"
                    name="first_name"
                    rules={[
                        {
                            required: true,
                            message: 'لطفا نام خود را وارد کنید!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="نشان"
                    name="last_name"
                    rules={[
                        {
                            required: true,
                            message: 'لطفا نام خود را وارد کنید!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="نام کاربری"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'لطفا نام خود را وارد کنید!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="گذرواژه"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'لطفا گذرواژه خود را انتخاب کنید!',
                        },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    label="درجه"
                    name="rank"
                    rules={[
                        {
                            required: true,
                            message: 'لطفا درجه خود را وارد کنید!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="دسترسی ها"
                    name="access"
                    rules={[
                        {
                            required: true,
                            message: 'لطفا سطح دسترسی را کامل کنید!',
                        },
                    ]}
                >
                    <Select mode={"multiple"} allowClear={true} options={access.map(e=>({label:e, value: e}))}/>
                </Form.Item>


                <Form.Item label=" " colon={false}>
                    <Button type="primary" htmlType="submit" block={true}>
                        نام نویسی
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
}

export default User;