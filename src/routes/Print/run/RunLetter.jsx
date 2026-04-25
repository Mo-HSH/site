import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Input, notification, Row, Table, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import {GetNumberLabel} from "../../../utils/Data.js";
import LetterReceiver from "../../../components/printElement/LetterReceiver.jsx";
import {getApiUrl} from "../../../utils/Config.js";
import axios from "axios";

function RunLetter({setPrintTitle, soldierKey, runIndex, forceRefresh}) {
    const [soldier, setSoldier] = useState({
        "target_run": {
            "absence_date": "",
            "run_date": "",
            "run_letter_number": "",
            "run_letter_sender": "",
            "m_run": "",
            "d_run": "",
            "run_count": 1,
            "war_mode": ""
        }
    });
    const [api, contextHolder] = notification.useNotification();
    const [readyForPrint, setReadyForPrint] = useState(false);
    const printComponent = useRef(null);
    const [today, setToday] = useState("");
    const [input, setInput] = useState({"date": "1234"});

    useEffect(() => {
        setPrintTitle("نامه فرار");

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
                    "phone": 1,
                    "run": 1,
                    "state": 1,
                    "city": 1,
                    "address_street": 1,
                    "address_house_number": 1,
                    "address_home_unit": 1,
                    "unit": 1,
                }
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    if (res[0]["run"][runIndex]["md_run"] === undefined || res[0]["run"][runIndex]["md_run"] === null || res[0]["run"][runIndex]["md_run"] === "") {
                        api["error"]({
                            message: "خطا", description: "ماده دستور فرار وارد نشده است!"
                        });
                        return;
                    }
                    setSoldier({
                        ...res[0],
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        "target_run": {
                            ...res[0]["run"][runIndex],
                            "absence_date": DateRenderer(res[0]["run"][runIndex]["absence_date"]),
                            "run_date": DateRenderer(res[0]["run"][runIndex]["run_date"]),
                            "m_run": res[0]["run"][runIndex]["md_run"].split("-")[1],
                            "d_run": res[0]["run"][runIndex]["md_run"].split("-")[0],
                        },
                    });

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
                });
            });
    }, [soldierKey, runIndex, forceRefresh]);

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
                            label={"شماره"}
                            name={"number"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"پیوست"}
                            name={"link"}
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
                        <Flex style={{width: "90%"}}>
                            <Flex style={{width: "80%"}} vertical={true}>
                                <Typography.Title level={4}>
                                    بسمه تعالی
                                </Typography.Title>
                                <Typography.Text>
                                    از: فرماندهی پشتیبانی مرکز نیروی پدافند هوایی آجا (مدن ا-وظیفه ها)
                                </Typography.Text>
                                <Typography.Text>
                                    به: فرماندهی محترم حفاظت اطلاعات فرماندهی پشتیبانی مرکز نیروی پدافند هوایی آجا
                                </Typography.Text>
                            </Flex>

                            <Flex vertical={true} style={{width: "20%", height: "100%"}}
                                  justify={"end"}>
                                <Row>
                                    <Col flex={1}>
                                        <Typography.Text>شماره:</Typography.Text>
                                    </Col>
                                    <Col flex={1}>
                                        <Flex style={{width: "100%", height: "100%"}}
                                              justify={"end"} align={"end"}>
                                            <Typography.Text>
                                                {input["number"]}
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
                                <Row>
                                    <Col flex={1}>
                                        <Typography.Text>پیوست:</Typography.Text>
                                    </Col>
                                    <Col flex={1}>
                                        <Flex style={{width: "100%", height: "100%"}}
                                              justify={"end"} align={"end"}>
                                            <Typography.Text>
                                                {input["link"]}
                                            </Typography.Text>
                                        </Flex>
                                    </Col>
                                </Row>
                            </Flex>
                        </Flex>
                        <Flex style={{width: "90%"}}>
                            <Row style={{width: "100%"}} gutter={[24, 24]}>
                                <Col>
                                    <Typography.Text>
                                        موضوع:
                                        {" " + soldier["military_rank"] + " وظیفه " + soldier["first_name"] + " " + soldier["last_name"] + " "}
                                    </Typography.Text>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        کد ملی:
                                        {" " + soldier["national_code"]}
                                    </Typography.Text>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        اعزامی:
                                        {" " + soldier["deployment_date"]}
                                    </Typography.Text>
                                </Col>
                            </Row>
                        </Flex>

                        <Flex vertical={true} style={{width: "90%"}}>
                            <Typography.Title level={5}>
                                سلام علیکم
                            </Typography.Title>
                            <Typography.Title level={5} style={{textIndent: "80px", marginTop: 5}}>
                                با صلوات بر محمد و آل محمد (ص)
                            </Typography.Title>
                            <Typography.Text level={5} style={{textIndent: "80px"}}>
                                وظیفه یاد شده بالا در تاریخ
                                {" "}
                                <Typography.Text strong underline>
                                    {soldier["target_run"]["absence_date"]}
                                </Typography.Text>
                                {" "}
                                مبادرت به نهست و در تاریخ
                                {" "}
                                <Typography.Text strong underline>
                                    {soldier["target_run"]["run_date"]}
                                </Typography.Text>
                                {" "}
                                پس از
                                {" "}
                                <Typography.Text strong underline>
                                    15 شبانه روز غیبت متوالی
                                </Typography.Text>
                                {" "}
                                فراری گردیده که مراتب در ماده
                                {" "}
                                <Typography.Text strong underline>
                                    {soldier["target_run"]["m_run"]}
                                </Typography.Text>
                                {" "}
                                دستور شماره
                                {" "}
                                <Typography.Text strong underline>
                                    {soldier["target_run"]["d_run"]}
                                </Typography.Text>
                                {" "}
                                این یگان درج که چگونگی جهت آگاهی و هرگونه اقدام بابسته اعلام می گردد.
                            </Typography.Text>
                        </Flex>

                        <Flex style={{width: "90%"}}>
                            <Table
                                size={"small"}
                                pagination={false}
                                bordered={true}
                                style={{width: "100%"}}
                                dataSource={[soldier]}
                                columns={[
                                    {
                                        title: "کد ملی",
                                        dataIndex: "national_code",
                                        align: "center",
                                    },
                                    {
                                        title: "آدرس محل سکونت",
                                        align: "center",
                                        children: [
                                            {
                                                title: "استان",
                                                dataIndex: "state",
                                                align: "center",
                                            },
                                            {
                                                title: "شهر",
                                                dataIndex: "city",
                                                align: "center",
                                            },
                                            {
                                                title: "خیابان",
                                                dataIndex: "address_street",
                                                align: "center",
                                            },
                                            {
                                                title: "پلاک",
                                                dataIndex: "address_house_number",
                                                align: "center",
                                            },
                                            {
                                                title: "واحد",
                                                dataIndex: "address_home_unit",
                                                align: "center",
                                            }
                                        ]
                                    },
                                    {
                                        title: "شماره تماس",
                                        dataIndex: "phone",
                                        align: "center",
                                    },
                                    {
                                        title: "مرحله فرار",
                                        align: "center",
                                        render: () => GetNumberLabel(soldier["target_run"]["run_count"])
                                    },
                                ]}
                                locale={{
                                    emptyText: <span
                                        style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>, // Custom text for "No Data" view
                                }}
                            />
                        </Flex>

                        <Flex style={{width: "90%"}} vertical={true}>
                            <Typography.Text strong>
                                گیرنده:
                            </Typography.Text>
                            <Typography.Text strong>
                                - ریاست محترم دایره بازجویی و قضایی فرماندهی پشتیبانی نیروی پدافند هوایی آجا - جهت آگاهی
                                و هرگونه اقدام بایسته.
                            </Typography.Text>
                            <Typography.Text strong>
                                - <LetterReceiver defaultValue={soldier["unit"]}/> {" "}
                                - بازگشت به نامه شماره
                                &rlm;
                                {" " + soldier["target_run"]["run_letter_number"] + " "}
                                جهت آگاهی و هرگونه اقدام بایسته.
                            </Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>
            </ConfigProvider>
        </div>
    );

}

export default RunLetter;