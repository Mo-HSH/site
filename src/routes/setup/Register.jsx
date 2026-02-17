import {Button, DatePicker, Flex, Form, Input, message} from "antd";
import {invoke} from "@tauri-apps/api/core";
import {useNavigate} from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    function onFinish(values) {
        values['access'] = ["Full"];
        invoke("register_user", {data: values}).then(()=>{
            navigate("/login");
        }).catch((err) => {
            console.error(err);
            messageApi.open({
                type: 'error',
                content: err,
            }).then(() => {
                console.error(err);
            });
        });
    }

    return (
        <Flex vertical justify={"center"} align={"center"}>
            {contextHolder}
            <Form
                name="register"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 18,
                }}
                onFinish={onFinish}
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
                    label="نام خانوادگی"
                    name="last_name"
                    rules={[
                        {
                            required: true,
                            message: 'لطفا نام خانوادگی خود را وارد کنید!',
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

                <Form.Item label=" " colon={false}>
                    <Button type="primary" htmlType="submit">
                        نام نویسی
                    </Button>
                </Form.Item>

            </Form>
        </Flex>
    );
}


export default Register;