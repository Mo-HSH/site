import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";
import {Button, Flex, Form, Input, notification, Table, Typography} from "antd";
import {useReactToPrint} from "react-to-print";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";

function AlefForm({setPrintTitle, alefFormNumber, refresher}) {
    const [soldier, setSoldier] = useState([]);
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [alefFormDate, setAlefFormDate] = useState("");
    const [eachPageRow, setEachPageRow] = useState(30);

    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);

    useEffect(() => {
        setPrintTitle("فرم الف");

        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setAlefFormDate(DateRenderer({"$date": {"$numberLong": res.data}}));
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
            });
        });

        axios.post(getApiUrl("soldier/list"), {

            "filter":
                {
                    "release_progress.alef_form_number": alefFormNumber
                }
            ,
            "projection":
                {
                    "first_name": 1,
                    "last_name": 1,
                    "father_name": 1,
                    "folder_number": 1,
                    "personnel_code": 1,
                    "family": 1,
                    "national_code": 1,
                    "deployment_location": 1,
                    "military_rank": 1,
                    "deployment_date": 1,
                    "release": 1,
                }
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSoldier(res);

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
                });
            });
    }, [setPrintTitle, alefFormNumber, refresher]);

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    const columns = [
        {
            title: "ردیف",
            dataIndex: "",
            render: (text, record, index) => {
                return <>{index + 1}</>;
            }
        },
        {
            title: "نام",
            dataIndex: "first_name",
        },
        {
            title: "نام خانـوادگی",
            dataIndex: "last_name",
        },
        {
            title: "نام پدر",
            dataIndex: "father_name",
        },
        {
            title: "کد ملی",
            dataIndex: "national_code",
        },
        {
            title: "حوزه اعزام",
            dataIndex: "deployment_location",
        },
        {
            title: "درجه",
            dataIndex: "military_rank",
        },
        {
            title: "شروع خـدمت",
            dataIndex: "deployment_date",
            render: (text, record, index) => {
                if (text === undefined || text === null || text === "") {
                    return "-";
                } else {
                    return DateRenderer(text);
                }
            },
        },
        {
            title: "پایان خـدمت",
            dataIndex: "release",
            render: (v) => {
                v = v["release_date"];
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
        },
        {
            title: "خـدمت انجام شده",
            dataIndex: "release",
            render: (v) => v["duty_duration"]
        },
        {
            title: "کد پرسنلی",
            dataIndex: "personnel_code",
        },
        {
            title: "کد تفضیلی",
            dataIndex: "folder_number",
            render: (text, record, index) => {
                try {
                    return parseInt(text.split("-").join(""));
                } catch (e) {
                    return "";
                }
            }
        },
        {
            title: "توضیحات",
            dataIndex: "release",
            render: (data) => {
                let res = [];
                if (data["additional_service_day"] > 0) {
                    res.push(`انفصال ${data["additional_service_day"]} روز`)
                }
                if (data["additional_service_punish_day"] > 0) {
                    res.push(`اضافه خدمت ${data["additional_service_punish_day"]} روز`)
                }
                if (data["release_reason"] !== "قانونی") {
                    res.push(data["release_reason"])
                }
                return res.join(" - ");
            }
        },
        {
            title: "مدرک",
            dataIndex: "family",
            render: (data) => {
                if (data === undefined || data === null || data === "") {
                    return "";
                }
                let flag = false;
                data.forEach(item => {
                    if (item.relative in ["همسر", "فرزند"]) {
                        flag = true;
                    }
                })
                return flag ? "+" : "";
            }
        },
    ].map(v => {
        v["align"] = "center";
        return v;
    });

    return (
        <div className={"highlighter"}>
            {contextHolder}
            <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                  style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>

                <Button disabled={!readyForPrint} type={"primary"} onClick={handlePrint}>پرینت</Button>

                <Form
                    layout={"inline"}
                >
                    <Form.Item
                        label={"تاریخ"}
                    >
                        <Input value={alefFormDate} onChange={e => setAlefFormDate(e.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label={"تعداد در هر صفحه"}
                    >
                        <Input value={eachPageRow} onChange={e => setEachPageRow(e.target.value)}/>
                    </Form.Item>
                </Form>
            </Flex>

            <Flex justify={"center"} gap={"middle"} align={"center"} vertical={true} ref={printComponent}
                  style={{width: "100%", top: "50%", left: "50%"}}>
                <style>
                    {`
                            @media print {
                              @page {
                                size: landscape;
                              }
                            }
                        `}
                </style>
                <Flex vertical={true} align={"center"}
                      style={{
                          border: "solid gray 2px",
                          borderRadius: "10px",
                          width: "100%",
                          padding: 10
                      }}
                      className={"break-after A4-landscape no-border"} gap={"middle"}
                >

                    <Typography.Title level={5}>
                        &lrm;                    لیست صدور کارت پشتیبانی مرکز | شماره
                        &lrm;{alefFormDate}&lrm;
                        |
                        {alefFormNumber}&lrm;
                    </Typography.Title>

                    <Table
                        columns={columns}
                        dataSource={soldier}
                        bordered={true}
                        size={"small"}
                        pagination={false}
                        style={{width: "100%", fontSize: 11}}
                    />

                    <Flex style={{width: "95%"}} justify={"space-between"} align={"center"}>
                        {
                            [
                                "رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا",
                                "مدیریت نیروی انسانی ف پش نیروی پدافند هوایی آجا",
                                "فرماندهی پشتیبانی مرکز پدافند هوایی آجا",
                                "رئیس دایره صدور کارت"
                            ].map((v) => {
                                return (
                                    <Sign.Single
                                        defaultSign={v}
                                        fontSize={12}
                                    />
                                );
                            })
                        }
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
}

export default AlefForm;