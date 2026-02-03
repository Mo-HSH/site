import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Input, notification, Row, Table, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import {GetNumberLabel} from "../../../utils/Data.js";
import LetterReceiver from "../../../components/printElement/LetterReceiver.jsx";
import {getApiUrl} from "../../../utils/Config.js";
import axios from "axios";
import {dateValidator} from "../../../utils/Validates.js";
import Sign from "../../../components/printElement/Sign.jsx";

function MarriageMD({setPrintTitle, soldierKey, forceRefresh}) {
    const [soldier, setSoldier] = useState({
        family: []
    });
    const [api, contextHolder] = notification.useNotification();
    const [readyForPrint, setReadyForPrint] = useState(false);
    const printComponent = useRef(null);
    const [today, setToday] = useState("");
    const [input, setInput] = useState({"marriage_date": ""});

    useEffect(() => {
        setPrintTitle("ماده دستور ازدواج و فرزند");

        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setToday(DateRenderer({"$date": {"$numberLong": res.data}}));
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
            });
        });
    }, []);

    useEffect(() => {
        axios.post(getApiUrl("soldier/list"), {
            "filter":
                {
                    "_id":
                        {
                            "$oid": soldierKey
                        }
                }
            ,
            "projection":
                {
                    "first_name": 1,
                    "last_name": 1,
                    "military_rank": 1,
                    "national_code": 1,
                    "father_name": 1,
                    "deployment_date": 1,
                    "family": 1,
                }
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                console.log("RES", res[0])
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSoldier({
                        ...res[0],
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        "family": res[0]["family"].filter(v => ["همسر", "فرزند"].includes(v.relative)),
                    });
                    console.log("TEST", res[0]["family"]);
                    console.log("TEST2", res[0]["family"].filter(v => ["همسر", "فرزند"].includes(v.relative)));

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
                });
            });
    }, [soldierKey, forceRefresh]);

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    return (
        <div>
            {contextHolder}
            <ConfigProvider
                theme={{
                    components: {
                        Typography: {
                            fontSize: 13,
                            fontSizeHeading4: 15,
                            fontSizeHeading5: 14,
                            lineHeight: 2,
                        },
                        Table: {
                            colorBgContainer: "rgba(255,255,255,0)",
                            borderColor: "rgba(5,5,5,0.15)",
                            fontSize: `13px`,
                            paddingXS: `4px`,
                        },
                    }
                }}
            >

                <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                      style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>
                    <Form
                        layout={"inline"}
                        onValuesChange={(changedValues, allValues) => {
                            setInput(allValues);
                        }}
                    >
                        <Form.Item
                            label={"تاریخ ازدواج"}
                            name={"marriage_date"}
                            rules={[{
                                validator: dateValidator, required: true
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Form>
                    <Button disabled={!readyForPrint} type={"primary"} onClick={handlePrint}>پرینت</Button>
                </Flex>
                <Flex justify={"center"} align={"center"} vertical={true} ref={printComponent}
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
                              background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                          }}
                          className={"break-after A5-landscape"}
                          gap={"small"}
                    >

                        <Flex align={"center"}>
                            <Flex align={"flex-end"} style={{width: "100%", justifyContent: "center"}} gap={120}>
                                <Typography.Title level={3} style={{height: "100%"}}>
                                    ماده
                                </Typography.Title>
                                <Typography.Title level={3} style={{height: "100%"}}>
                                    دستور
                                </Typography.Title>
                            </Flex>
                        </Flex>
                        <Flex vertical={true} style={{width: "90%"}} gap={"middle"}>
                            <Typography.Text style={{textAlign: "justify"}}>
                                <Typography.Text strong>
                                    {soldier["military_rank"] + " "}
                                </Typography.Text>
                                وظیفه
                                <Typography.Text strong>
                                    {" " + soldier["first_name"] + " " + soldier["last_name"] + " "}
                                </Typography.Text>
                                فرزند
                                <Typography.Text strong>
                                    {" " + soldier["father_name"] + " "}
                                </Typography.Text>
                                به شماره ملی
                                <Typography.Text strong>
                                    {" " + soldier["national_code"] + " "}
                                </Typography.Text>
                                اعزامی
                                <Typography.Text strong>
                                    {" " + soldier["deployment_date"] + " "}
                                </Typography.Text>
                                در تاریخ
                                <Typography.Text strong>
                                    {" " + input["marriage_date"] + " "}
                                </Typography.Text>
                                با دوشیزه
                                <Typography.Text strong>
                                    {" " + soldier["family"].find(r => r.relative === "همسر")?.full_name + " "}
                                </Typography.Text>
                                با مشخصات مصرحه ذیل ازدواج نموده که به همین منظور استحقاق بهره مندی از مزایای عایله مندی
                                و بیمه خدمات درمانی را دارد.
                            </Typography.Text>
                            <Typography.Text style={{textAlign: "left", marginBottom: "30px"}}>
                                مدرک:
                                <Typography.Text strong>
                                    {" "+"روگرفت سند ازدواج"}
                                </Typography.Text>
                            </Typography.Text>
                        </Flex>
                        <Flex style={{width: "90%", marginBottom: "10px"}} align={"end"}>
                            <Sign.MultiInline fontSize={13} singGap={30} defaultSign={[
                                "مدیر نیروی انسانی ف پش نپاجا",
                                "رئیس دایره وظیفه های ف پش نپاجا",
                                "رئیس شعبه دستور ف پش نپاجا",
                            ]}
                            />
                        </Flex>

                        <Flex style={{width: "90%"}}>
                            <Table
                                title={
                                    () => (
                                        <Typography.Text style={{textAlign: "center"}} strong>مشخصات همسر و فرزند</Typography.Text>
                                    )
                                }
                                size={"small"}
                                pagination={false}
                                bordered={true}
                                dataSource={[...soldier.family]}
                                locale={{
                                    emptyText: <span
                                        style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>, // Custom text for "No Data" view
                                }}
                                columns={[
                                    {
                                        title: "ردیف",
                                        align: "center",
                                        render: (value, record, index) => index + 1,
                                    },
                                    {
                                        title: "نام و نشان",
                                        dataIndex: "full_name",
                                        align: "center",
                                    },
                                    {
                                        title: "نام پدر",
                                        dataIndex: "father_name",
                                        align: "center",
                                    },
                                    {
                                        title: "کد ملی",
                                        dataIndex: "national_code",
                                        align: "center",
                                    },
                                    {
                                        title: "محل تولد",
                                        dataIndex: "birth_certificate_issuing_place",
                                        align: "center",
                                    },
                                    {
                                        title: "شغل",
                                        dataIndex: "job",
                                        align: "center",
                                    },
                                    {
                                        title: "تاریخ تولد",
                                        dataIndex: "birthday",
                                        align: "center",
                                    },
                                    {
                                        title: "نسبت",
                                        dataIndex: "relative",
                                        align: "center",
                                    },
                                ]}
                                style={{width: "100%"}}
                            />
                        </Flex>

                    </Flex>
                </Flex>
            </ConfigProvider>
        </div>
    );

}

export default MarriageMD;