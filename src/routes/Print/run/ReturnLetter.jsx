import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Input, notification, Row, Select, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import LetterReceiver from "../../../components/printElement/LetterReceiver.jsx";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";


function RunLetter({setPrintTitle, soldierKey, runIndex, forceRefresh}) {

    const [soldier, setSoldier] = useState({
        "target_run": {
            "absence_date": "",
            "run_date": "",
            "run_letter_number": "",
            "run_letter_sender": "",
            "m_run": "",
            "d_run": "",
            "run_count": 1
        }
    });
    const [api, contextHolder] = notification.useNotification();
    const [readyForPrint, setReadyForPrint] = useState(false);
    const printComponent = useRef(null);
    const [today, setToday] = useState("");
    const [input, setInput] = useState({"letter_number": "", "letter_link": ""});

    useEffect(() => {
        setPrintTitle("نامه مراجعت");
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
                    "run": 1,
                    "unit": 1
                }
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSoldier({
                        ...res[0],
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        "target_run": {
                            ...res[0]["run"][runIndex],
                            "absence_date": DateRenderer(res[0]["run"][runIndex]["absence_date"]),
                            "run_date": DateRenderer(res[0]["run"][runIndex]["run_date"]),
                            "return_date": DateRenderer(res[0]["run"][runIndex]["return_date"]),
                            "m_run": res[0]["run"][runIndex]["md_run"].split("-")[1],
                            "d_run": res[0]["run"][runIndex]["md_run"].split("-")[0],
                        },
                    });
                    axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
                        setToday(DateRenderer({"$date": {"$numberLong": res.data}}));
                    }).catch(() => {
                        api["error"]({
                            message: "خطا",
                            description: "خطا در دریافت تاریخ!"
                        });
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
                            fontSize: 14,
                            lineHeight: 2
                        }
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
                            name={"letter_number"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"پیوست"}
                            name={"letter_link"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"به"}
                            name={"to"}
                        >
                            <Select style={{width:150}} options={[
                                {value: "حفاظت اطلاعات", label: "حفاظت اطلاعات"},
                                {value: "صدور کارت", label: "صدور کارت"}
                            ]}/>
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
                          gap={"large"}
                    >
                        <Flex style={{width: "90%", marginTop: "10px"}}>
                            <Row style={{width: "100%"}}>
                                <Col span={18}>
                                    <Flex style={{height: "100%"}} align={"center"}>
                                        <Typography.Text strong>
                                            بسمه تعالی
                                        </Typography.Text>
                                    </Flex>
                                </Col>
                                <Col span={6}>
                                    <Flex style={{width: "100%"}} vertical={true}>
                                        {
                                            [
                                                {label: "شماره:", value: input.letter_number},
                                                {label: "تاریخ:", value: today},
                                                {label: "پیوست:", value: input.letter_link},
                                            ].map(({label, value}) => {
                                                return (
                                                    <Row style={{width: "100%"}}>
                                                        <Col flex={"auto"}>
                                                            <Flex style={{width: "100%"}} justify={"start"}>
                                                                <Typography.Text>
                                                                    {label}
                                                                </Typography.Text>
                                                            </Flex>
                                                        </Col>
                                                        <Col flex={"auto"}>
                                                            <Flex style={{width: "100%"}} justify={"end"}>
                                                                <Typography.Text>
                                                                    {value}
                                                                </Typography.Text>
                                                            </Flex>
                                                        </Col>
                                                    </Row>
                                                );
                                            })
                                        }
                                    </Flex>
                                </Col>
                            </Row>
                        </Flex>
                        <Flex style={{width: "90%"}} vertical={true}>
                            <Typography.Text>
                                از: فرماندهی پشتیبانی مرکز نیروی پدافند هوایی آجا (مدن ا-وظیفه ها)
                            </Typography.Text>
                            <Typography.Text>
                                {
                                    input.to === "حفاظت اطلاعات"
                                        ?
                                        "به: فرماندهی محترم حفاظت اطلاعات فرماندهی پشتیبانی مرکز نیروی پدافند هوایی آجا"
                                        :
                                        "به: امیر معاونت محترم نیروی انسانی نیروی پدافند هوایی آجا (مد وظیفه و احتیاط - صدور کارت)"
                                }
                            </Typography.Text>
                            <Row style={{width: "100%"}} gutter={[24, 0]}>
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
                        <Flex style={{width: "90%"}} vertical={true}>
                            <Typography.Text strong>
                                سلام علیکم
                            </Typography.Text>
                            <Typography.Text strong style={{textIndent: "60px"}}>
                                با صلوات بر محمد و آل محمد(ص)
                            </Typography.Text>
                            <Typography.Text>
                                وظیفه یاد شده فوق در تاریخ
                                <Typography.Text strong={true}>
                                    {" " + soldier["target_run"]["absence_date"] + " "}
                                </Typography.Text>
                                مبادرت به نهست و در تاریخ
                                <Typography.Text strong={true}>
                                    {" " + soldier["target_run"]["run_date"] + " "}
                                </Typography.Text>
                                پس از
                                <Typography.Text strong={true}>
                                    15 شبانه روز
                                </Typography.Text>
                                غیبت متوالی از خدمت فراری و در تاریخ
                                <Typography.Text strong={true}>
                                    {" " + soldier["target_run"]["return_date"] + " "}
                                </Typography.Text>
                                مراجعت نموده که مراتب برقراری حقوق وی در ماده
                                {" "}
                                <Typography.Text strong underline>
                                    {soldier["target_run"]["m_run"]}
                                </Typography.Text>
                                {" "}
                                دستور
                                {" "}
                                <Typography.Text strong underline>
                                    {soldier["target_run"]["d_run"]}
                                </Typography.Text>
                                {" "}
                                این یگان درج که چگونگی جهت آگاهی و هرگونه اقدام بابسته اعلام می گردد.
                            </Typography.Text>
                        </Flex>
                        <Flex style={{width: "90%"}} vertical={true}>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Typography: {
                                            fontSize: 12,
                                            lineHeight: 2,
                                        },
                                    }
                                }}
                            >
                                <Typography.Text strong>
                                    گیرنده:
                                </Typography.Text>
                                {
                                    input.to === "صدور کارت"
                                        ?
                                        <Typography.Text strong>
                                            -  فرماندهی محترم حفاظت اطلاعات فرماندهی پشتیبانی مرکز نیروی پدافند هوایی آجا - جهت آگاهی و هرگونه اقدام بایسته.
                                        </Typography.Text>
                                        :
                                        null
                                }
                                <Typography.Text strong>
                                    - ریاست محترم حقوقی و قضایی فرماندهی پشتیبانی نیروی پدافند هوایی آجا (وظیفه ها) -
                                    بازگشت به نامه شماره

                                    جهت آگاهی و هرگونه اقدام بایسته.
                                </Typography.Text>
                                <Typography.Text strong>
                                    - <LetterReceiver defaultValue={soldier["unit"]}/> {" "}
                                    - بازگشت به نامه شماره
                                    &rlm;
                                    {" " + soldier["target_run"]["run_letter_number"] + " "}
                                    جهت آگاهی و هرگونه اقدام بایسته.
                                </Typography.Text>
                            </ConfigProvider>
                        </Flex>
                    </Flex>

                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default RunLetter;