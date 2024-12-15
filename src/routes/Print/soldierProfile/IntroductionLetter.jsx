import {useCallback, useEffect, useRef, useState} from "react";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {Button, Col, ConfigProvider, Flex, notification, Row, Space, Table, Typography} from "antd";
import {useReactToPrint} from "react-to-print";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";

function IntroductionLetter({setPrintTitle, soldierKey}) {
    const [today, setToday] = useState("");
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);
    const [soldier, setSoldier] = useState({});


    useEffect(() => {
        setPrintTitle("معرفی نامه");

        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setToday(DateRenderer({"$date": {"$numberLong": res.data}}));
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
            });
        });

        axios.post(getApiUrl("soldier/list"),
            {
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
                        "folder_number": 1,
                        "first_name": 1,
                        "last_name": 1,
                        "military_rank": 1,
                        "deployment_date": 1,
                        "national_code": 1,
                        "personnel_code": 1,
                        "order_number": 1,
                        "unit": 1,
                        "section": 1,
                        "absence": 1,
                        "additional_service_day": 1,
                        "extra_info": 1,
                        "mental_health": 1,
                    }
            },
            {withCredentials: true}
        )
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    let initialAbsence = 0;
                    for (const key in res[0]["absence"]) {
                        if (res[0]["absence"][key]["is_initial"]) {
                            initialAbsence = res[0]["absence"][key]["duration"];
                        }
                    }

                    setSoldier({
                        ...res[0],
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        "body_health_status": res[0]["extra_info"].includes("معاف از رزم") ? "معاف از رزم" : "سالم",
                        "initial_absence": initialAbsence
                    });

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err
                });
            });

    }, [soldierKey]);

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    return (
        <div className={"highlighter"}>
            <ConfigProvider

            >
                {contextHolder}
                <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                      style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>
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
                    {
                        [...Array(2)].map((_) => {
                            return (
                                <Flex vertical={true} align={"center"}
                                      style={{
                                          border: "solid gray 2px",
                                          borderRadius: "10px",
                                          background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                      }}
                                      className={"break-after A5-landscape"}
                                >
                                    <Row style={{width: "90%", marginTop: "20px"}}>
                                        <Col flex={3}>
                                            <Flex style={{width: "100%", height: "100%"}} vertical={true}
                                                  align={"start"} justify={"space-between"}
                                            >
                                                <Typography.Text>
                                                    از: مدیریت نیروی انسانی فرماندهی پشتیبانی مرکز نپاجا(وظیفه ها)
                                                </Typography.Text>
                                                <Space/>
                                                <Typography.Text>
                                                    {
                                                        soldier["unit"] === "فرماندهی پشتیبانی مرکز نپاجا - گ.خ"
                                                            ?
                                                            "به: فرماندهی محترم گروه خدمات پاسداری پشتیبانی مرکز نپاجا"
                                                            :
                                                            soldier["unit"] === "فرماندهی پشتیبانی مرکز نپاجا - ت.ح"
                                                                ?
                                                                "به: ریاست محترم تامین حفاظتی پشتیبانی مرکز نپاجا"
                                                                :
                                                                ""
                                                    }
                                                </Typography.Text>
                                            </Flex>
                                        </Col>
                                        <Col flex={1}>
                                            <ConfigProvider
                                                theme={{
                                                    components: {
                                                        Typography: {
                                                            fontSize: 12
                                                        }
                                                    },
                                                }}
                                            >
                                                <Flex vertical={true} style={{width: "100%", height: "100%"}}
                                                      justify={"center"}>

                                                    <Row>
                                                        <Col flex={1}>
                                                            <Typography.Text>شماره پرونده:</Typography.Text>
                                                        </Col>
                                                        <Col flex={1}>
                                                            <Flex style={{width: "100%", height: "100%"}}
                                                                  justify={"end"} align={"end"}>
                                                                <Typography.Text>
                                                                    {soldier["folder_number"]}
                                                                </Typography.Text>
                                                            </Flex>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col flex={1}>
                                                            <Typography.Text>شماره:</Typography.Text>
                                                        </Col>
                                                        <Col flex={1}>
                                                            <Flex style={{width: "100%", height: "100%"}}
                                                                  justify={"end"} align={"end"}>
                                                                <Typography.Text>
                                                                    1613-1
                                                                </Typography.Text>
                                                            </Flex>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col flex={1}>
                                                            <Typography.Text>تاریخ:</Typography.Text>
                                                        </Col>
                                                        <Col flex={1}>
                                                            <Flex style={{width: "100%", height: "100%"}}
                                                                  justify={"end"} align={"end"}>
                                                                <Typography.Text>
                                                                    {today}
                                                                </Typography.Text>
                                                            </Flex>
                                                        </Col>
                                                    </Row>
                                                </Flex>
                                            </ConfigProvider>
                                        </Col>
                                    </Row>
                                    <Flex vertical={true} style={{width: "90%", marginTop: "20px"}} gap={"middle"}>
                                        <Typography.Text>
                                            موضوع:
                                            &nbsp;
                                            <Typography.Text strong={true}>
                                                {soldier.military_rank}
                                            </Typography.Text>
                                            &nbsp;
                                            وظیفه
                                            &nbsp;
                                            <Typography.Text strong={true}>
                                                {soldier.first_name}
                                                &nbsp;
                                                {soldier.last_name}
                                            </Typography.Text>
                                            &nbsp;
                                            اعزامی
                                            &nbsp;
                                            <Typography.Text strong={true}>
                                                {soldier.deployment_date}
                                            </Typography.Text>
                                            &nbsp;
                                            به شماره ملی
                                            &nbsp;
                                            <Typography.Text strong={true}>
                                                {soldier.national_code}
                                            </Typography.Text>
                                            &nbsp;
                                            و شماره پرسنلی
                                            &nbsp;
                                            <Typography.Text strong={true}>
                                                {soldier.personnel_code}
                                            </Typography.Text>
                                        </Typography.Text>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Typography: {
                                                        fontSize: 13
                                                    }
                                                },
                                            }}
                                        >

                                            <Typography.Text style={{textAlign: "justify"}}>
                                                1- محل خدمتی یاد شده بالا برابر امریه شماره
                                                &nbsp;
                                                <Typography.Text strong={true} underline={true}>
                                                    {soldier.order_number}
                                                </Typography.Text>
                                                &nbsp;
                                                صادره از معاونت نیروی انسانی نپاجا/مد وظیفه و احتیاط
                                                &nbsp;
                                                <Typography.Text strong={true} underline={true}>
                                                    {soldier.unit}
                                                    &nbsp;
                                                    -
                                                    &nbsp;
                                                    {soldier.section}
                                                </Typography.Text>
                                                &nbsp;
                                                تعیین گردیده. از اینرو خواهشمند است دستور فرمایید نامبرده را از تاریخ
                                                &nbsp;
                                                <Typography.Text strong={true} underline={true}>
                                                    {today}
                                                </Typography.Text>
                                                &nbsp;
                                                در آمار آن یگان منظور و مراتب را به این نیروی انسانی اعلام فرمایید.
                                            </Typography.Text>

                                            <Typography.Text style={{textAlign: "justify"}}>
                                                2- مشارالیه می بایست قبل از هرگونه بکارگیری جهت تعیین سطح سلامت روان و
                                                انجام معاینات روان سنجی به مرکز سلامت روان مستقر در این پشتیبانی اعزام
                                                گردد.
                                            </Typography.Text>
                                            <Typography.Text style={{textAlign: "justify"}}>
                                                3- وضعیت پذیرش و سلامت نامبرده شرح جدول ذیل می باشد. همچنین مشارالیه با
                                                &nbsp;
                                                <Typography.Text strong={true} underline={true}>
                                                    {soldier.initial_absence} روز
                                                </Typography.Text>
                                                &nbsp;
                                                غیبت خود را به این یگان معرفی نموده است.
                                            </Typography.Text>
                                        </ConfigProvider>
                                    </Flex>
                                    <Flex style={{width: "90%", marginTop: "30px"}} justify={"end"}>
                                        <Sign.SingleInline
                                            defaultSign={"مدیریت نیروی انسانی ف پش نیروی پدافند هوایی آجا"}
                                            fontSize={12}/>
                                    </Flex>

                                    <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                                        <Table
                                            size={"small"}
                                            pagination={false}
                                            bordered={true}
                                            locale={{
                                                emptyText: <span
                                                    style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>, // Custom text for "No Data" view
                                            }}
                                            columns={[
                                                {
                                                    title: "عقیدتی سیاسی",
                                                    render: () => "پذیرش گردیده",
                                                    align: "center",
                                                },
                                                {
                                                    title: "حفاظت اطلاعات",
                                                    render: () => "پذیرش گردیده",
                                                    align: "center",
                                                },
                                                {
                                                    title: "سلامت جسمانی",
                                                    dataIndex: "body_health_status",
                                                    align: "center",
                                                },
                                                {
                                                    title: "سلامت روانی",
                                                    dataIndex: "mental_health",
                                                    align: "center",
                                                },
                                                {
                                                    title: "اضافه خدمت سنواتی",
                                                    dataIndex: "additional_service_day",
                                                    align: "center",
                                                },
                                            ]}
                                            dataSource={[soldier]}
                                            style={{width: "90%"}}
                                        />
                                    </Flex>
                                </Flex>
                            );
                        })
                    }

                </Flex>
            </ConfigProvider>
        </div>
    )
}

export default IntroductionLetter;