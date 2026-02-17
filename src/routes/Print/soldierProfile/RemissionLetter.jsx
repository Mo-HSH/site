import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Input, notification, Row, Select, Table, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import LetterReceiver from "../../../components/printElement/LetterReceiver.jsx";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";
import Sign from "../../../components/printElement/Sign.jsx";
import {calculateDate} from "../../../utils/date.js";


function RemissionLetter({setPrintTitle, soldierKey}) {

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
    const [input, setInput] = useState({"letter_number": "", "letter_link": "", "all_additional_day": "0", "remission_day": "0"});

    useEffect(() => {
        setPrintTitle("نامه گردشکار");
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
                    "run": 1,
                    "unit": 1,
                    "legal_release_date": 1,
                    "additional_service_day": 1,

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
                        "legal_date": calculateDate(res[0]["legal_release_date"]["$date"]["$numberLong"], res[0]["additional_service_day"]),
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
    }, [soldierKey]);

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
                <Flex vertical={false} gap={"small"} align={"center"} justify={"center"}
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
                            label={"مدت کل اضافه سنواتی"}
                            name={"all_additional_day"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"مدت بخشش"}
                            name={"remission_day"}
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
                          gap={"middle"}
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
                                    soldier["unit"] === "فرماندهی پشتیبانی مرکز نپاجا - ت.ح" ? "به: ریاست محترم تامین حفاظت فرماندهی پشتیبانی مرکز نیروی پدافند هوایی آجا" : "به: فرماندهی محترم گروه خدمات و پاسداری ف پشتیبانی مرکز نیروی پدافند هوایی آجا"
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
                            <Typography.Text strong={true} style={{textAlign: "right", display:"block"}}>سلام علیکم</Typography.Text>
                            <Typography.Text strong={true} style={{textAlign: "right", display:"block", textIndent: "30px"}}>با صلوات بر محمد و آل محمد (ص)</Typography.Text>

                        </Flex>
                        <Flex style={{width: "90%"}} vertical={true}>
                            <Typography.Text style={{textAlign: "justify", display:"block", textIndent: "30px", fontSize: "16px"}}>
                                مراتب اضافه خدمت وظیفه مشروحه جدول ذیل، جهت بخشش طی گردشکاری بعرض فرماندهی محترم پشتیبانی مرکز رسید و ایشان با بخشش اضافه خدمت وی برابر شرح ذیل موافقت نموده اند. از اینرو چگونگی جهت آگاهی و هرگونه اقدام بایسته اعلام میگردد.
                            </Typography.Text>
                        </Flex>
                        <Flex style={{width: "90%", marginTop: "15px"}} justify={"end"}>
                            <Sign.SingleInline
                                defaultSign={"مدیر نیروی انسانی ف پش نپاجا"}
                                fontSize={12}/>
                        </Flex>
                        <Flex style={{width: "90%"}} justify={"end"}>
                            <Table
                                pagination={false}
                                size={"small"}
                                bordered={true}
                                rowClassName={(record, index) => {
                                    if (index % 2 === 0) {
                                        return ("gray-background");
                                    } else {
                                        return ("");
                                    }
                                }}
                                showHeader={false}
                                columns={[...Array(6)].map((v, index) => {
                                    return ({
                                        align: "center",

                                        dataIndex: index
                                    })
                                })}
                                style={{width: "100%"}}
                                dataSource={[
                                    {
                                        0: "ردیف",
                                        1: "نام و نشان",
                                        2: "مدت اضافه خدمت سنواتی",
                                        3: "مدت بخشش اضافه خدمت سنواتی",
                                        4: "تاریخ ترخیص قانونی",
                                        5: "خدمات برجسته در طول خدمت",
                                    },
                                    {
                                        0: "1",
                                        1: `${soldier["first_name"]} ${soldier["last_name"]}`,
                                        2: soldier["deployment_date"],
                                        3: `${input.all_additional_day}روز`,
                                        4: `${input.remission_day}روز`,
                                        5: DateRenderer(soldier["legal_release_date"]),
                                    },
                                ]}
                            />
                        </Flex>
                    </Flex>

                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default RemissionLetter;