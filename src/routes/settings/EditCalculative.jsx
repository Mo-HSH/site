import {Divider, Flex, Form, Button, InputNumber, notification, Spin} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function EditCalculative() {
    const [api, contextHolder] = notification.useNotification();
    const [isDurationDataLoading, setDurationDataLoading] = useState(true);
    const [isDurationDataError, setDurationDataError] = useState(false);
    const [dutyDurationData, setDutyDurationData] = useState([]);
    const [needFetch, setNeedFetch] = useState(false);


    function fetch() {
        setNeedFetch(!needFetch);
    }

    function onFinish(native, duration) {
        console.log(native, duration);
        axios.post(getApiUrl("config/calculative/create/duty_duration"),
            {"native": native, "duty_month": duration},
            {withCredentials: true})
            .then(() => {
                api["success"]({
                    message: "انجام شد"
                });
                fetch();
            }).catch((err) => {
            api["error"]({
                message: "خطا",
                description: err
            });
        })
    }

    useEffect(() => {
        setDurationDataLoading(true);
        axios.get(getApiUrl("config/duty-duration"), {withCredentials: true})
            .then((res) => {
                console.log(res.data.config);
                setDutyDurationData(res.data.config);
                setDurationDataLoading(false);
            }).catch((err) => {
            api["error"]({
                message: "خطا",
                description: err.message
            });
            setDurationDataError(true);
            setDurationDataLoading(false);
        })
    }, [needFetch]);

    function calculateAllSoldier() {
        
    }

    return (
        <Flex vertical={true} gap={"small"}>
            {contextHolder}
            <Divider>مدت زمان خدمت</Divider>
            {isDurationDataLoading
                ?
                <Spin/>
                :
                <>

                    <Form
                        name={"native"}
                        layout={"inline"}
                        onFinish={(values) => {
                            onFinish(true, values["native_duty_month"]);
                        }}
                    >
                        <Form.Item
                            label={"بومی"}
                            name={"native_duty_month"}
                            rules={[
                                {
                                    required: true,
                                }
                            ]}
                            initialValue={isDurationDataError ? null : dutyDurationData["native_duty_month"]}
                        >
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">ثبت</Button>
                        </Form.Item>
                    </Form>

                    <Form
                        name={"none-native"}
                        layout={"inline"}
                        onFinish={(values) => {
                            onFinish(false, values["none_native_duty_month"]);
                        }}
                    >
                        <Form.Item
                            label={"غیر بومی"}
                            name={"none_native_duty_month"}
                            rules={[
                                {
                                    required: true,
                                }
                            ]}
                            initialValue={isDurationDataError ? null : dutyDurationData["none_native_duty_month"]}
                        >
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">ثبت</Button>
                        </Form.Item>
                    </Form>

                    <Divider>محاسبه مجدد خدمت</Divider>
                    <Button type={"primary"} onClick={()=>calculateAllSoldier()}>محاسبه مجدد برای کل سربازان</Button>
                </>
            }
        </Flex>

    );
}

export default EditCalculative;