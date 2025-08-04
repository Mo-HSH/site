import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Input, notification, Row, Select, Table, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import LetterReceiver from "../../../components/printElement/LetterReceiver.jsx";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";
import {dateValidator} from "../../../utils/Validates.js";
import Sign from "../../../components/printElement/Sign.jsx";


function RunLetter({setPrintTitle, soldierKey, runIndex, forceRefresh}) {

    const [soldier, setSoldier] = useState({});
    const [api, contextHolder] = notification.useNotification();
    const [readyForPrint, setReadyForPrint] = useState(false);
    const printComponent = useRef(null);
    const [today, setToday] = useState("");
    const [input, setInput] = useState({"letter_number": "", "to_unit": ""});

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
                        console.log(res[0]["first_name"]);

                        setSoldier({
                            ...res[0],
                            "deployment_date": DateRenderer(res[0]["deployment_date"]),
                            "run_date": DateRenderer(res[0]["run"][runIndex]["run_date"]),
                            "absence_date": DateRenderer(res[0]["run"][runIndex]["absence_date"]),
                            "run_duration": `${res[0]["run"][runIndex]["run_duration"]} روز`,
                            "return_date": DateRenderer(res[0]["run"][runIndex]["return_date"]),
                            "md_run": res[0]["run"][runIndex]["md_run"]
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
                }
            )
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
                            label={"تاریخ معرفی به یگان"}
                            name={"to_unit"}
                            rules={[{validator: dateValidator, required: true}]}
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
                                            <>
                                                {soldier["unit"] === "فرماندهی پشتیبانی مرکز نپاجا - گ.خ" && "به: فرماندهي محترم گروه خدمات پاسداري فرماندهي پشتيباني مرکز نيروي پدافند هوايي آجا"}
                                            </>
                                            <>
                                                {soldier["unit"] === "فرماندهی پشتیبانی مرکز نپاجا - ت.ح" && "به: رياست محترم تامين حفاظت فرماندهي پشتيباني مرکز نيروي پدافند هوايي آجا"}
                                            </>
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
                                            {"یاد شده بالا از تاریخ های قید شده جدول ذیل مبادرت به غیبت و فرار "}
                                            <Typography.Text>
                                                {soldier["run_duration"] > 180 && "بیش از ۶ ماه "}
                                            </Typography.Text>
                                            {"و در تاریخ "}
                                            <Typography.Text>
                                                {soldier["return_date"]}
                                            </Typography.Text>
                                            {" خود را به این یگان معرفی و پس از طی مراحل قضایی و محکومیت به وی ابلاغ گردید که در مورخه "}
                                            <Typography.Text>
                                                {input["to_unit"]}
                                            </Typography.Text>
                                            {" خود را به آن گروه معرفی نماید. از اینرو خواهشمند است ضمن به کارگیری مشارالیه مراتب حضور وی را به این یگان اعلام تا کار بایسته بعمل آید."}
                                        </Typography.Text>
                                        <Flex justify="flex-end" style={{margin: "15px 0"}}>
                                            <Sign.SingleInline
                                                defaultSign={"مدیریت نیروی انسانی ف پش نیروی پدافند هوایی آجا"}
                                                fontSize={12}
                                            />
                                        </Flex>
                                        <Flex vertical={true}>
                                            <ConfigProvider theme={{
                                                components: {
                                                    Typography: {
                                                        fontSize: 14,
                                                        lineHeight: 2
                                                    }
                                                }
                                            }}>
                                                <Table dataSource={[soldier]} columns={[
                                                    {
                                                        title: "تاریخ غیبت",
                                                        dataIndex: "absence_date",
                                                        align: "center",
                                                    },
                                                    {
                                                        title: "تاریخ فرار",
                                                        dataIndex: "run_date",
                                                        align: "center",
                                                    },
                                                    {
                                                        title: "مدت غیبت و مراجعت",
                                                        dataIndex: "run_duration",
                                                        align: "center",
                                                    },
                                                    {
                                                        title: "تاریخ مراجعت",
                                                        dataIndex: "return_date",
                                                        align: "center",
                                                    },
                                                    {
                                                        title: "ماده دستور و غیبت و فرار",
                                                        dataIndex: "md_run",
                                                        align: "center",
                                                    },
                                                ]} style={{width: "100%"}} pagination={false} bordered={true}/>


                                            </ConfigProvider>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )
                        })
                    }
                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default RunLetter;