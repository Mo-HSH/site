import {Button, Card, Divider, Flex, Form, Input, notification, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";
import Background from "../../assets/img/Background.webp";
import padafandLogoOpacityLow from "../../assets/img/Padafand_Logo_1.svg";


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
        <Flex vertical style={{
            width: "100%",
            height: "100%",
            padding: 20,
            background: `url(${Background}) center center / cover no-repeat`
        }}>
            <Flex vertical={true}>
                <Typography.Text style={{
                    fontSize: 24,
                    textShadow: "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
                }}>
                    مقام معظم رهبری(مدظله العالی):
                    <Typography.Text style={{
                        fontSize: 56,
                        padding: 50,
                        textAlign: "center",
                        color: "red",
                        textShadow: "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",

                        // textShadow: "0px 0px white",
                    }}>
                        امروز پدافند در اولویت است.
                    </Typography.Text>
                </Typography.Text>

            </Flex>
            {contextHolder}
            <Flex align={"center"} justify={"center"} style={{height: "100%"}} vertical={true}>
                <Card style={{
                    background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat, white`
                }}>
                    <Flex vertical={true} style={{
                        // paddingBottom: 40
                    }}>
                        <Typography.Text
                            style={{
                                fontSize: 18,
                                textAlign: "center",
                            }}
                        >
                            فرماندهی پشتیبانی مرکز نپاجا
                        </Typography.Text>

                    </Flex>
                    <Divider variant={"dashed"}/>
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

                        {/*<Form.Item label=" " colon={false}>*/}
                            <Button type="primary" htmlType="submit" loading={isLoading} block={true}>
                                ورود
                            </Button>
                        {/*</Form.Item>*/}

                    </Form>
                </Card>
            </Flex>
        </Flex>
    );
}

export default Login;