import {useEffect, useState} from "react";
import {Button, Checkbox, Flex, Form, Input, notification, Table, Typography} from "antd";
import {DateRenderer} from "../../utils/TableRenderer.jsx";
import {dateValidator} from "../../utils/Validates.js";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function AlefFormNumber() {

    const [soldiers, setSoldiers] = useState([]);
    const [today, setToday] = useState("");
    const [lastAlef, setLastAlef] = useState("");
    const [reFetch, setReFetch] = useState(false);

    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldValue("alef_create_date", today);
    }, [today]);

    useEffect(() => {
        axios.get(getApiUrl("config/alef"), {withCredentials: true}).then((res) => {
            setLastAlef(res.data.config);
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت آخرین شماره فرم الف!"
            });
        });

        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setToday(DateRenderer({"$date": {"$numberLong": res.data}}));
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
            });
        });

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "release.release_type": {
                    "$eq": "پایان خدمت"
                },
                "release_progress.card_application_registration_date": {
                    "$ne": null
                },
                "release_progress.confirm_legal_date": {
                    "$ne": null
                },
                "release_progress.alef_form_number": {
                    "$eq": null
                },
                "release_progress.alef_create_date": {
                    "$eq": null
                },
            }, "projection": {
                "first_name": 1,
                "last_name": 1,
                "national_code": 1,
                "father_name": 1,
                "deployment_date": 1,
                "release": 1,
                "release_progress": 1,
            }
        }, {withCredentials: true})
            .then((res) => {
                setSoldiers(res.data);
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
                });
            });
    }, [reFetch]);

    function onFinish(value) {
        console.log(value);
        axios.post(getApiUrl("document/release/alef/create/public_alef"), query, {withCredentials: true}).then(() => {
            api["success"]({
                message: "عملیات موفق!", description: "درخواست با موفقیت انجام شد!"
            });
            setReFetch((prev) => {
                return !prev;
            })
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err.data.message
            });
        });
    }

    return (
        <Flex vertical={true} gap={"large"}>
            {contextHolder}

            <Flex style={{width: "90%"}}>
                <Form
                    layout={"inline"}
                    form={form}
                    onFinish={onFinish}
                    style={{width: "80%"}}
                >
                    <Form.Item
                        name={"alef_form_number"}
                        label={"شماره فرم الف"}
                        rules={[{
                            required: true,
                        }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name={"alef_create_date"}
                        label={"تاریخ فرم الف"}
                        rules={[{
                            validator: dateValidator, required: true,
                        }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name={"save"}
                        label={"ذخیره به عنوان آخرین فرم الف"}
                        valuePropName={"checked"}
                        initialValue={true}
                        rules={[{
                            required: true,
                        }]}
                    >
                        <Checkbox></Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button block={true} type={"primary"} htmlType="submit">ثبت</Button>
                    </Form.Item>
                </Form>

                <Flex justify={"end"} align={"center"} style={{width: "20%"}}>
                    <Typography.Text>
                        آخرین فرم الف:
                        <Typography.Text strong>
                            &rlm;
                            {" " + lastAlef}
                        </Typography.Text>
                    </Typography.Text>
                </Flex>
            </Flex>

            <Table
                style={{width: "100%"}}
                bordered={true}
                dataSource={soldiers}
                columns={[
                    {
                        title: "نام",
                        dataIndex: "first_name",
                        align: "center"
                    },
                    {
                        title: "نشان",
                        dataIndex: "last_name",
                        align: "center"
                    },
                    {
                        title: "کد ملی",
                        dataIndex: "national_code",
                        align: "center"
                    },
                    {
                        title: "نام پدر",
                        dataIndex: "father_name",
                        align: "center"
                    },
                    {
                        title: "تاریخ اعزام",
                        dataIndex: "deployment_date",
                        render: DateRenderer,
                        align: "center"
                    },
                    {
                        title: "تاریخ ترخیص",
                        dataIndex: "release",
                        render: (v) => DateRenderer(v["release_date"]),
                        align: "center"
                    },
                    {
                        title: "تاریخ درخواست کارت",
                        dataIndex: "release_progress",
                        render: (v) => DateRenderer(v["card_application_registration_date"]),
                        align: "center"
                    },
                    {
                        title: "تاریخ تایید حقوقی",
                        dataIndex: "release_progress",
                        render: (v) => DateRenderer(v["confirm_legal_date"]),
                        align: "center"
                    },
                ]}
            />
        </Flex>
    );
}

export default AlefFormNumber;