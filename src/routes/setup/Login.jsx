import {Button, Flex, Form, Input, notification} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";


function Login() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = notification.useNotification();
    const [isLoading, setLoading] = useState(false);

    function onFinish(values) {
        setLoading(true);
        axios.post(getApiUrl("user/login"), values, {withCredentials: true})
            .then((res) => {
                setLoading(false);
                console.log(res.data);
                localStorage.setItem("user_first_name", res.data.first_name);
                localStorage.setItem("user_last_name", res.data.last_name);
                localStorage.setItem("user_rank", res.data.rank);
                localStorage.setItem("user_access", res.data.access);
                navigate("/");
            })
            .catch((err) => {
                setLoading(false);
                messageApi.error({
                    message: "خطا",
                    description: err.response.data
                })
            })
    }

    return (
        <Flex vertical justify={"center"} align={"center"}>
            {contextHolder}
            <Form
                name="login"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 18,
                }}
                onFinish={onFinish}
            >

                <Form.Item
                    label="نام کاربری"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'لطفا نام کاربری خود را انتخاب کنید!',
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

                <Form.Item label=" " colon={false}>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        ورود
                    </Button>
                </Form.Item>

            </Form>
        </Flex>
    );
}

export default Login;