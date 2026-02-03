import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    Button,
    Card,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
    notification,
    Popover,
    Row,
    Select,
    Spin,
    Table, Tooltip,
    Typography
} from "antd";
import {GetDutyDuration} from "../../utils/Calculative.js";
import {DateRenderer} from "../../utils/TableRenderer.jsx";
import {dateValidator} from "../../utils/Validates.js";
import {DeleteOutlined, EditOutlined, ReloadOutlined} from "@ant-design/icons";
import Release from "../Print/release/Release.jsx";
import TransferIntroduction from "../Print/release/TransferIntroduction.jsx";
import StatusSummery from "../Print/soldierProfile/StatusSummery.jsx";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";


function SoldierRelease({oid}) {

    const params = useParams();

    const [api, contextHolder] = notification.useNotification();

    const [soldier, setSoldier] = useState({
        "first_name": "", "duty_duration": "", "release_date": "", "deficit": [], "release": {}, "release_progress": {
            "card_application_registration_date": "",
            "confirm_legal_date": "",
            "alef_create_date": "",
            "alef_form_number": "",
        }
    });
    const [today, setToday] = useState("");
    const [targetKey, setTargetKey] = useState("");
    const [printTarget, setPrintTarget] = useState(<div>printable</div>);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reFetch, setReFetch] = useState(false);
    const [printTitle, setPrintTitle] = useState("تیتر پرینت");
    const [initial, setInitial] = useState(false);

    const [form] = Form.useForm();

    const releaseType = Form.useWatch('release_type', form);
    const signs = Form.useWatch('signs', form);
    const releaseDate = Form.useWatch('release_date', form);

    function getDeficitText(text) {
        if (text.length === 0) {
            return "قانونی";
        } else {
            let lastDeficit = text.pop();
            if (text.length === 0) {
                return lastDeficit;
            } else {
                return `${text.join('، ')} و ${lastDeficit}`;
            }
        }
    }

    useEffect(() => {
        if (oid === undefined && params.key !== undefined) {
            setTargetKey(params.key);
        } else if (oid !== undefined || oid !== "") {
            console.log(oid);
            setTargetKey(oid);
        }
    }, [oid]);


    useEffect(() => {
        let temp = form.getFieldValue("release_date");
        form.resetFields();
        form.setFieldValue("release_date", temp);
        if (Object.keys(soldier["release"]).length !== 0) {
            for (const soldKey in soldier["release"]) {
                if (soldKey.includes("date")) {
                    form.setFieldValue(soldKey, DateRenderer(soldier["release"][soldKey]));
                } else {
                    form.setFieldValue(soldKey, soldier["release"][soldKey]);
                }
            }
        } else {
            form.setFieldValue("create_date", today);
            form.setFieldValue("duty_duration", soldier["duty_duration"]);
            if (!initial && soldier["overall_release_date"]) {
                form.setFieldValue("release_date", DateRenderer(soldier["overall_release_date"]));
                console.log("tetst", soldier["overall_release_date"]);
                setInitial(true);
            }
            form.setFieldValue("extra_medical_leave", soldier["extra_medical_leave"]);
            form.setFieldValue("additional_service_punish_day", soldier["additional_service_day"]);
            form.setFieldValue("extra_annual_leave", soldier["extra_annual_leave"]);
            form.setFieldValue("run_discharge", soldier["run_discharge"]);
            form.setFieldValue("absence_discharge", soldier["absence_discharge"]);
        }
    }, [today, soldier]);

    function calculateAdditionalServiceDay() {
        let legalReleaseDate = DateRenderer(soldier["legal_release_date"]);
        if ((typeof legalReleaseDate !== "string") || (typeof releaseDate !== "string")) {
            return;
        }
        axios.post(getApiUrl("utils/calculate_additional_duty_service"),
            {
                "legal_release_date": legalReleaseDate,
                "release_date": releaseDate
            }
            , {withCredentials: true}).then((res) => {
            form.setFieldValue("additional_service_day", res.data + soldier["run_punish"]);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err.data.message
            });
        })
    }

    function fillReleaseReason() {
        switch (releaseType) {
            case "انتقالی":
                form.setFieldValue("release_reason", "انتقالی");
                break;
            case "معافیت موقت":
                form.setFieldValue("release_reason", "6 ماه معاف موقت");
                break;
            case "فوت":
                form.setFieldValue("release_reason", "فوت");
                break;
            case "پایان خدمت":
                let text = [];
                if (soldier["done_service_day"] > 0) {
                    text.push(`${soldier["done_service_day"]} روز سابقه خدمت قبلی`)
                }
                if (soldier["deficit"].length > 0) {
                    for (const index in soldier["deficit"]) {
                        text.push(`${soldier["deficit"][index]["day"]} روز کسری ${soldier["deficit"][index]["name"]}`)
                    }
                }
                form.setFieldValue("release_reason", getDeficitText(text));
                break;
            default:
                form.setFieldValue("release_reason", "");
        }
    }

    useEffect(() => {
        if (targetKey === "" || targetKey === undefined) {
            return;
        }
        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setToday(DateRenderer({"$date": {"$numberLong": res.data}}));
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
            });
        });

        axios.post(getApiUrl("soldier/list"), {
            "filter":
                {
                    "_id":
                        {
                            "$oid": targetKey
                        }
                }
            ,
            "projection":
                {
                    "first_name": 1,
                    "last_name": 1,
                    "deployment_date": 1,
                    "legal_release_date": 1,
                    "overall_release_date": 1,
                    "additional_service_day": 1,
                    "done_service_day": 1,
                    "extra_annual_leave": 1,
                    "extra_medical_leave": 1,
                    "run_discharge": 1,
                    "run_punish": 1,
                    "arrest_punish": 1,
                    "absence_punish": 1,
                    "absence_discharge": 1,
                    "deficit": 1,
                    "release": 1,
                    "release_progress": 1,
                    "status": 1
                }
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    console.log(res[0]);
                    setSoldier({
                        "release": {},
                        "release_progress": {},
                        ...res[0],
                    });
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
                });
            });
    }, [targetKey, reFetch]);

    const infoColumn = [
        {
            title: "نام",
            dataIndex: "first_name"
        },
        {
            title: "نشان",
            dataIndex: "last_name"
        },
        {
            title: "تاریخ اعزام",
            dataIndex: "deployment_date",
            render: DateRenderer,
        },
        {
            title: "تاریخ تسویه قانونی",
            dataIndex: "legal_release_date",
            render: DateRenderer,
        },
        {
            title: "تاریخ تسویه کل",
            dataIndex: "overall_release_date",
            render: DateRenderer,
        },
        {
            title: "اضافه خدمت سنوات",
            dataIndex: "additional_service_day"
        },
        {
            title: "سابقه خدمت قبلی",
            dataIndex: "done_service_day"
        },
        {
            title: "مدت خدمت",
            dataIndex: "duty_duration"
        },
        {
            title: "وضعیت",
            dataIndex: "status"
        },
    ];

    function onFinish(value) {
        value["additional_service_day"] = parseInt(value["additional_service_day"]);

        axios.post(getApiUrl(`document/release/create/${targetKey}`), value, {withCredentials: true}).then(() => {
            api["success"]({
                message: "عملیات موفق!", description: "ثبت تسویه با موفقیت انجام شد!"
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

    function openPrintModal(page) {
        setPrintTarget(page);
        setIsModalOpen(true);
    }

    function removeRelease() {
        axios.delete(getApiUrl(`document/release/delete/${targetKey}/0`), {withCredentials: true})
            .then(() => {
                api["success"]({
                    message: "عملیات موفق!", description: "حذف تسویه با موفقیت انجام شد!"
                });
                form.resetFields();
                setReFetch((prev) => {
                    return !prev;
                })
            }).catch((err) => {
            api["error"]({
                message: "خطا", description: err.data.message
            });
        })
    }

    function editProgress(key, date) {
        axios.post(getApiUrl(`document/release/progress/${targetKey}/${key}`), {"date": date}, {withCredentials: true}).then(() => {
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

    function alefForSingleSoldier(key, alefFormNumber) {
        axios.post(getApiUrl(`document/release/single_alef/${targetKey}/${alefFormNumber}`), {}, {withCredentials: true})
            .then(() => {
                api["success"]({
                    message: "عملیات موفق!", description: "درخواست با موفقیت انجام شد!"
                });
                setReFetch((prev) => {
                    return !prev;
                })
            }).catch((err) => {
            console.error(err);
            api["error"]({
                message: "خطا", description: "تغییر فرم الف با خطا مواجه شد!"
            });
        });
    }

    function calculateDutyDuration() {
        GetDutyDuration(targetKey, releaseDate)
            .then((res) => {
                let temp = "";
                temp = `${res.month} ماه و ${res.day} روز`;
                form.setFieldValue("duty_duration", temp);
            })
            .catch(() => {
                form.setFieldValue("duty_duration", "خطا");
            })
    }

    return (
        <Flex vertical={true} align={"center"} gap={"middle"}>
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                title={printTitle}
                width={"80%"}
                centered={true}
            >
                {printTarget}
            </Modal>
            {contextHolder}
            <Typography.Title style={{marginTop: "0"}} level={2}>
                تسویه
            </Typography.Title>
            <Table
                style={{width: "100%"}}
                size={"small"}
                pagination={false}
                bordered={true}
                columns={infoColumn.map((col) => ({...col, "align": "center"}))}
                dataSource={[soldier]}
            />

            <Card title={"اطلاعات تسویه"} style={{width: "100%"}}>
                <Flex style={{width: "100%"}}>
                    <Form
                        style={{width: "100%"}}
                        form={form}
                        onFinish={onFinish}
                    >
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Flex style={{width: "100%"}} vertical={true}>
                                    <Form.Item
                                        label={"پنوع ترخیص"}
                                        name={"release_type"}
                                        rules={[{
                                            required: true,
                                        }]}
                                        initialValue={"پایان خدمت"}
                                    >
                                        <Select
                                            options={[
                                                {
                                                    value: "پایان خدمت",
                                                    label: "پایان خدمت"
                                                },
                                                {
                                                    value: "انتقالی",
                                                    label: "انتقالی"
                                                },
                                                {
                                                    value: "ایست خدمت",
                                                    label: "ایست خدمت"
                                                },
                                                {
                                                    value: "معافیت",
                                                    label: "معافیت"
                                                },
                                                {
                                                    value: "معافیت موقت",
                                                    label: "معافیت موقت"
                                                },
                                                {
                                                    value: "فوت",
                                                    label: "فوت"
                                                },
                                            ]}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={"تاریخ تنظیم"}
                                        name={"create_date"}
                                        rules={[{
                                            validator: dateValidator, required: true,
                                        }]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"تاریخ نامه"}
                                        name={"letter_date"}
                                        rules={[{
                                            validator: dateValidator, required: true,
                                        }]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"تاریخ ترخیص"}
                                        name={"release_date"}
                                        rules={[{
                                            validator: dateValidator, required: true,
                                        }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    {
                                        releaseType === "انتقالی"
                                            ?
                                            <Form.Item
                                                label={"امریه انتقال"}
                                                name={"move_order"}
                                                rules={[{
                                                    required: true,
                                                }]}
                                            >
                                                <Input/>
                                            </Form.Item>
                                            :
                                            null
                                    }
                                    <Form.Item
                                        label={"مدت خدمت"}
                                        name={"duty_duration"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <Input addonAfter={<Button type={"text"} onClick={() => {
                                            calculateDutyDuration()
                                        }} icon={<ReloadOutlined/>}/>}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"رسته"}
                                        name={"military_guild"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"نهست"}
                                        name={"absence_discharge"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <InputNumber min={0} style={{width: "100%"}} disabled={true}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"فرار"}
                                        name={"run_discharge"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <InputNumber min={0} style={{width: "100%"}} disabled={true}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"اضافه سالیانه"}
                                        name={"extra_annual_leave"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <InputNumber min={0} style={{width: "100%"}} disabled={true}/>
                                    </Form.Item>
                                </Flex>
                            </Col>
                            <Col span={12}>
                                <Flex style={{width: "100%"}} vertical={true}>
                                    <Form.Item
                                        label={"امضاها"}
                                        name={"signs"}
                                        rules={[{
                                            required: true,
                                        }]}
                                        initialValue={"گروه خدمات پاسداری"}
                                    >
                                        <Select
                                            options={[
                                                {
                                                    value: "گروه خدمات پاسداری",
                                                    label: "گروه خدمات پاسداری"
                                                },
                                                {
                                                    value: "تامین حفاظت",
                                                    label: "تامین حفاظت"
                                                },
                                                {
                                                    value: "امریه",
                                                    label: "امریه"
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={"شماره نامه"}
                                        name={"letter_number"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"صادر کننده نامه"}
                                        name={"letter_sender"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"علت ترخیص"}
                                        name={"release_reason"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <Input addonAfter={<Button type={"text"} onClick={() => {
                                            fillReleaseReason()
                                        }} icon={<ReloadOutlined/>}/>}/>
                                    </Form.Item>
                                    {
                                        releaseType === "انتقالی"
                                            ?
                                            <Form.Item
                                                label={"مقصد انتقال"}
                                                name={"move_location"}
                                                rules={[{
                                                    required: true,
                                                }]}
                                            >
                                                <Input/>
                                            </Form.Item>
                                            :
                                            null
                                    }
                                    {
                                        signs === "امریه"
                                            ?
                                            null
                                            :
                                            releaseType === "فوت"
                                                ?
                                                null
                                                :
                                                <Form.Item
                                                    label={"تخصص"}
                                                    name={"proficiency"}
                                                    rules={[{
                                                        required: true,
                                                    }]}
                                                >
                                                    <Input/>
                                                </Form.Item>
                                    }
                                    <Form.Item
                                        label={"اضافه خدمت"}
                                        name={"additional_service_day"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <InputNumber style={{width: "100%"}}
                                                     addonAfter={<Button type={"text"} onClick={() => {
                                                         calculateAdditionalServiceDay()
                                                     }} icon={<ReloadOutlined/>}/>}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"اضافه سنوات"}
                                        name={"additional_service_punish_day"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <InputNumber min={0} style={{width: "100%"}} disabled={true}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"اضافه استعلاجی"}
                                        name={"extra_medical_leave"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <InputNumber min={0} style={{width: "100%"}} disabled={true}/>
                                    </Form.Item>
                                </Flex>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Form.Item>
                                    <Button block={true} type={"primary"} htmlType="submit">ثبت</Button>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item>
                                    <Button block={true} danger ghost
                                            onClick={() => {
                                                removeRelease();
                                            }}
                                    >حذف درخواست</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Flex>
            </Card>

            <Flex style={{width: "100%"}} gap={"large"}>
                <Card title={"تاریخچه تسویه"} style={{width: "60%"}}>
                    <Flex vertical={true} align={"center"}>
                        {
                            soldier["release"]["release_type"] === "پایان خدمت"
                                ?
                                <>
                                    {
                                        [
                                            {
                                                label: "تاریخ صدور تسویه",
                                                is_date: true,
                                                data: soldier["release"]["create_date"]
                                            },
                                            {
                                                label: "تاریخ ثبت اولیه درخواست کارت",
                                                is_date: true,
                                                editable: true,
                                                data: soldier["release_progress"]["card_application_registration_date"],
                                                key: "card_application_registration_date"
                                            },
                                            {
                                                label: "تاریخ تایید تسویه حساب حقوقی",
                                                is_date: true,
                                                editable: true,
                                                data: soldier["release_progress"]["confirm_legal_date"],
                                                key: "confirm_legal_date"
                                            },
                                            {
                                                label: "تاریخ صدور فرم الف",
                                                is_date: true,
                                                editable: true,
                                                data: soldier["release_progress"]["alef_create_date"],
                                                key: "alef_create_date"
                                            },
                                            {
                                                label: "شماره فرم الف",
                                                deletable: true,
                                                data: soldier["release_progress"]["alef_form_number"],
                                                key: "alef_form_number"
                                            },
                                        ].map(({label, data, is_date, editable, key, deletable}) => {
                                            return (<>
                                                <Flex style={{width: "70%"}} gap={"small"}>
                                                    <Flex justify={"start"} style={{width: "100%"}}>
                                                        <Typography.Text>{label}</Typography.Text>
                                                    </Flex>
                                                    <Flex justify={"end"} style={{width: "100%"}}>
                                                        {
                                                            deletable
                                                                ?
                                                                <Flex>
                                                                    <Button type={"text"} icon={<DeleteOutlined/>}
                                                                            onClick={() => editProgress(key, "")}/>
                                                                </Flex>
                                                                :
                                                                null
                                                        }
                                                        {
                                                            editable
                                                                ?
                                                                <Flex>
                                                                    <Popover
                                                                        trigger={"click"}
                                                                        content={
                                                                            <Form
                                                                                onFinish={(v) => {
                                                                                    editProgress(key, v.date)
                                                                                }}
                                                                            >
                                                                                <Form.Item
                                                                                    name={"date"}
                                                                                    label={"تاریخ"}
                                                                                    rules={[{
                                                                                        validator: dateValidator,
                                                                                        required: true,
                                                                                    }]}
                                                                                >
                                                                                    <Input/>
                                                                                </Form.Item>
                                                                                <Form.Item>
                                                                                    <Button block={true}
                                                                                            type={"primary"}
                                                                                            htmlType="submit">ثبت</Button>
                                                                                </Form.Item>
                                                                            </Form>
                                                                        }
                                                                    >
                                                                        <Button type={"text"} icon={<EditOutlined/>}/>
                                                                    </Popover>
                                                                    <Button type={"text"} icon={<DeleteOutlined/>}
                                                                            onClick={() => editProgress(key, "")}/>
                                                                    <Tooltip title={"تبدیل به تاریخ امروز"}>
                                                                        <Button type={"text"} icon={<ReloadOutlined/>}
                                                                                onClick={() => editProgress(key, today)}/>
                                                                    </Tooltip>
                                                                </Flex>
                                                                :
                                                                null
                                                        }
                                                        <Typography.Text>{is_date ? DateRenderer(data) : data}</Typography.Text>
                                                    </Flex>
                                                </Flex>
                                                <Divider/>
                                            </>);
                                        })
                                    }
                                </>
                                :
                                soldier["release"]["release_type"] === "انتقالی"
                                    ?
                                    <>
                                        {
                                            [
                                                {
                                                    label: "تاریخ صدور تسویه",
                                                    is_date: true,
                                                    data: soldier["release"]["create_date"]
                                                },
                                                {
                                                    label: "تاریخ تحویل نامه انتقالی",
                                                    is_date: true,
                                                    editable: true,
                                                    data: soldier["release_progress"]["received_move_letter_date"],
                                                    key: "received_move_letter_date"
                                                },
                                                {
                                                    label: "تاریخ ارسال پرونده",
                                                    is_date: true,
                                                    editable: true,
                                                    data: soldier["release_progress"]["send_file_date"],
                                                    key: "send_file_date"
                                                },
                                            ].map(({label, data, is_date, editable, key, deletable}) => {
                                                return (<>
                                                    <Flex style={{width: "70%"}} gap={"small"}>
                                                        <Flex justify={"start"} style={{width: "100%"}}>
                                                            <Typography.Text>{label}</Typography.Text>
                                                        </Flex>
                                                        <Flex justify={"end"} style={{width: "100%"}}>
                                                            {
                                                                deletable
                                                                    ?
                                                                    <Flex>
                                                                        <Button type={"text"} icon={<DeleteOutlined/>}
                                                                                onClick={() => editProgress(key, "")}/>
                                                                    </Flex>
                                                                    :
                                                                    null
                                                            }
                                                            {
                                                                editable
                                                                    ?
                                                                    <Flex>
                                                                        <Popover
                                                                            trigger={"click"}
                                                                            content={
                                                                                <Form
                                                                                    onFinish={(v) => {
                                                                                        editProgress(key, v.date)
                                                                                    }}
                                                                                >
                                                                                    <Form.Item
                                                                                        name={"date"}
                                                                                        label={"تاریخ"}
                                                                                        rules={[{
                                                                                            validator: dateValidator,
                                                                                            required: true,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>
                                                                                    <Form.Item>
                                                                                        <Button block={true}
                                                                                                type={"primary"}
                                                                                                htmlType="submit">ثبت</Button>
                                                                                    </Form.Item>
                                                                                </Form>
                                                                            }
                                                                        >
                                                                            <Button type={"text"}
                                                                                    icon={<EditOutlined/>}/>
                                                                        </Popover>
                                                                        <Button type={"text"} icon={<DeleteOutlined/>}
                                                                                onClick={() => editProgress(key, "")}/>
                                                                        <Tooltip title={"تبدیل به تاریخ امروز"}>
                                                                            <Button type={"text"}
                                                                                    icon={<ReloadOutlined/>}
                                                                                    onClick={() => editProgress(key, today)}/>
                                                                        </Tooltip>
                                                                    </Flex>
                                                                    :
                                                                    null
                                                            }
                                                            <Typography.Text>{is_date ? DateRenderer(data) : data}</Typography.Text>
                                                        </Flex>
                                                    </Flex>
                                                    <Divider/>
                                                </>);
                                            })
                                        }
                                    </>
                                    :
                                    ["ایست خدمت", "معافیت", "معافیت موقت"].find(v => v === soldier["release"]["release_type"])
                                        ?
                                        <>
                                            {
                                                [
                                                    {
                                                        label: "تاریخ صدور تسویه",
                                                        is_date: true,
                                                        data: soldier["release"]["create_date"]
                                                    },
                                                    {
                                                        label: "تاریخ تایید تسویه حساب حقوقی",
                                                        is_date: true,
                                                        editable: true,
                                                        data: soldier["release_progress"]["confirm_legal_date"],
                                                        key: "confirm_legal_date"
                                                    },
                                                    {
                                                        label: "تاریخ تحویل نامه معافیت/ایست خدمت",
                                                        is_date: true,
                                                        editable: true,
                                                        data: soldier["release_progress"]["stop_exempt_letter_date"],
                                                        key: "stop_exempt_letter_date"
                                                    }
                                                ].map(({label, data, is_date, editable, key, deletable}) => {
                                                    return (<>
                                                        <Flex style={{width: "70%"}} gap={"small"}>
                                                            <Flex justify={"start"} style={{width: "100%"}}>
                                                                <Typography.Text>{label}</Typography.Text>
                                                            </Flex>
                                                            <Flex justify={"end"} style={{width: "100%"}}>
                                                                {
                                                                    deletable
                                                                        ?
                                                                        <Flex>
                                                                            <Button type={"text"}
                                                                                    icon={<DeleteOutlined/>}
                                                                                    onClick={() => editProgress(key, "")}/>
                                                                        </Flex>
                                                                        :
                                                                        null
                                                                }
                                                                {
                                                                    editable
                                                                        ?
                                                                        <Flex>
                                                                            <Popover
                                                                                trigger={"click"}
                                                                                content={
                                                                                    <Form
                                                                                        onFinish={(v) => {
                                                                                            editProgress(key, v.date)
                                                                                        }}
                                                                                    >
                                                                                        <Form.Item
                                                                                            name={"date"}
                                                                                            label={"تاریخ"}
                                                                                            rules={[{
                                                                                                validator: dateValidator,
                                                                                                required: true,
                                                                                            }]}
                                                                                        >
                                                                                            <Input/>
                                                                                        </Form.Item>
                                                                                        <Form.Item>
                                                                                            <Button block={true}
                                                                                                    type={"primary"}
                                                                                                    htmlType="submit">ثبت</Button>
                                                                                        </Form.Item>
                                                                                    </Form>
                                                                                }
                                                                            >
                                                                                <Button type={"text"}
                                                                                        icon={<EditOutlined/>}/>
                                                                            </Popover>
                                                                            <Button type={"text"}
                                                                                    icon={<DeleteOutlined/>}
                                                                                    onClick={() => editProgress(key, "")}/>
                                                                            <Tooltip title={"تبدیل به تاریخ امروز"}>
                                                                                <Button type={"text"}
                                                                                        icon={<ReloadOutlined/>}
                                                                                        onClick={() => editProgress(key, today)}/>
                                                                            </Tooltip>
                                                                        </Flex>
                                                                        :
                                                                        null
                                                                }
                                                                <Typography.Text>{is_date ? DateRenderer(data) : data}</Typography.Text>
                                                            </Flex>
                                                        </Flex>
                                                        <Divider/>
                                                    </>);
                                                })
                                            }
                                        </>
                                        :
                                        soldier["release"]["release_type"] === "فوت"
                                            ?
                                            <>
                                                {
                                                    [
                                                        {
                                                            label: "تاریخ صدور تسویه",
                                                            is_date: true,
                                                            data: soldier["release"]["create_date"]
                                                        },
                                                        {
                                                            label: "تاریخ صدور نامه به نیروی انسانی",
                                                            is_date: true,
                                                            editable: true,
                                                            data: soldier["release_progress"]["send_letter_date"],
                                                            key: "send_letter_date"
                                                        }
                                                    ].map(({label, data, is_date, editable, key, deletable}) => {
                                                        return (<>
                                                            <Flex style={{width: "70%"}} gap={"small"}>
                                                                <Flex justify={"start"} style={{width: "100%"}}>
                                                                    <Typography.Text>{label}</Typography.Text>
                                                                </Flex>
                                                                <Flex justify={"end"} style={{width: "100%"}}>
                                                                    {
                                                                        deletable
                                                                            ?
                                                                            <Flex>
                                                                                <Button type={"text"}
                                                                                        icon={<DeleteOutlined/>}
                                                                                        onClick={() => editProgress(key, "")}/>
                                                                            </Flex>
                                                                            :
                                                                            null
                                                                    }
                                                                    {
                                                                        editable
                                                                            ?
                                                                            <Flex>
                                                                                <Popover
                                                                                    trigger={"click"}
                                                                                    content={
                                                                                        <Form
                                                                                            onFinish={(v) => {
                                                                                                editProgress(key, v.date)
                                                                                            }}
                                                                                        >
                                                                                            <Form.Item
                                                                                                name={"date"}
                                                                                                label={"تاریخ"}
                                                                                                rules={[{
                                                                                                    validator: dateValidator,
                                                                                                    required: true,
                                                                                                }]}
                                                                                            >
                                                                                                <Input/>
                                                                                            </Form.Item>
                                                                                            <Form.Item>
                                                                                                <Button block={true}
                                                                                                        type={"primary"}
                                                                                                        htmlType="submit">ثبت</Button>
                                                                                            </Form.Item>
                                                                                        </Form>
                                                                                    }
                                                                                >
                                                                                    <Button type={"text"}
                                                                                            icon={<EditOutlined/>}/>
                                                                                </Popover>
                                                                                <Button type={"text"}
                                                                                        icon={<DeleteOutlined/>}
                                                                                        onClick={() => editProgress(key, "")}/>
                                                                                <Tooltip title={"تبدیل به تاریخ امروز"}>
                                                                                    <Button type={"text"}
                                                                                            icon={<ReloadOutlined/>}
                                                                                            onClick={() => editProgress(key, today)}/>
                                                                                </Tooltip>
                                                                            </Flex>
                                                                            :
                                                                            null
                                                                    }
                                                                    <Typography.Text>{is_date ? DateRenderer(data) : data}</Typography.Text>
                                                                </Flex>
                                                            </Flex>
                                                            <Divider/>
                                                        </>);
                                                    })
                                                }
                                            </>
                                            :
                                            null
                        }
                    </Flex>
                </Card>

                <Flex vertical={true} style={{width: "40%"}} gap={"large"}>
                    <Card title={"خروجی ها"} style={{width: "100%"}}>
                        <Flex style={{width: "100%"}} gap={"small"}>
                            <Button type={"primary"} block={true}
                                    onClick={() => {
                                        openPrintModal(<Release setPrintTitle={setPrintTitle} soldierKey={targetKey}
                                                                refresher={new Date().getTime()}/>)
                                    }}
                            >
                                تسویه حساب
                            </Button>

                            <Popover
                                content={() => {
                                    return (
                                        <Flex gap={"large"}>
                                            <Button type={"primary"} block={true}
                                                    onClick={() => {
                                                        openPrintModal(<TransferIntroduction isOutsideOfPadafand={true}
                                                                                             setPrintTitle={setPrintTitle}
                                                                                             soldierKey={targetKey}
                                                                                             refresher={new Date().getTime()}/>)
                                                    }}
                                            >
                                                خارج سازمانی
                                            </Button>
                                            <Button type={"primary"} block={true}
                                                    onClick={() => {
                                                        openPrintModal(<TransferIntroduction isOutsideOfPadafand={false}
                                                                                             setPrintTitle={setPrintTitle}
                                                                                             soldierKey={targetKey}
                                                                                             refresher={new Date().getTime()}/>)
                                                    }}
                                            >
                                                درون سازمانی
                                            </Button>
                                        </Flex>
                                    );
                                }}
                                trigger={"click"}
                            >
                                <Button type={"primary"} block={true}>
                                    معرفی نامه انتقالی
                                </Button>
                            </Popover>

                            <Button type={"primary"} block={true}
                                    onClick={() => {
                                        openPrintModal(<StatusSummery setPrintTitle={setPrintTitle}
                                                                      soldierKey={targetKey}/>)
                                    }}
                            >
                                خلاصه وضعیت
                            </Button>
                        </Flex>


                    </Card>
                    {
                        soldier["release"]["release_type"] === "پایان خدمت"
                            ?
                            <Card title={"فرم الف"} style={{width: "100%"}}>
                                <Form
                                    onFinish={(v) => {
                                        alefForSingleSoldier(targetKey, v["form_number"]);
                                    }}
                                    layout={"inline"}
                                >
                                    <Form.Item
                                        name={"form_number"}
                                        label={"شماره فرم الف"}
                                        rules={[{
                                            required: true,
                                        }]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button block={true} type={"primary"} htmlType="submit">ثبت</Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                            :
                            null
                    }
                </Flex>

            </Flex>
        </Flex>
    );

}

export default SoldierRelease;