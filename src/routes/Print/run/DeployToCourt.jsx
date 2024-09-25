import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Card, Col, ConfigProvider, Flex, Image, notification, Row, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import {GetNumberLabel} from "../../../utils/Data.js";
import Sign from "../../../components/printElement/Sign.jsx";
import {getApiUrl} from "../../../utils/Config.js";
import axios from "axios";


function DeployToCourt({setPrintTitle, soldierKey, runIndex, forceRefresh}) {

    const [soldier, setSoldier] = useState({
        "target_run": {
            "absence_date": "",
            "run_date": "",
            "return_date": "",
            "run_letter_number": "",
            "run_letter_sender": "",
            "run_count": 1
        }
    });
    const [api, contextHolder] = notification.useNotification();
    const [readyForPrint, setReadyForPrint] = useState(false);
    const printComponent = useRef(null);

    useEffect(() => {
        setPrintTitle("فرم اعزام به قضایی");
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
                    "profile": 1,
                    "first_name": 1,
                    "last_name": 1,
                    "military_rank": 1,
                    "national_code": 1,
                    "father_name": 1,
                    "deployment_date": 1,
                    "phone": 1,
                    "run": 1,
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
                            "return_date": DateRenderer(res[0]["run"][runIndex]["return_date"]),
                            "run_date": DateRenderer(res[0]["run"][runIndex]["run_date"]),
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


    return(
        <div>
            {contextHolder}
            <ConfigProvider
                theme={{
                    components: {
                        Typography: {
                            fontSize: 16,
                            lineHeight: 2
                        }
                    }
                }}
            >
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
                        [...Array(3)].map((_) => {
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
                                    <Row style={{width:"90%", marginTop: "20px"}}>
                                        <Col flex={1}>
                                            <Flex>
                                                <Typography.Title level={5}>
                                                    بسمه تعالی
                                                </Typography.Title>
                                            </Flex>
                                        </Col>
                                        <Col flex={1}>
                                            <Flex justify={"center"} align={"center"} style={{height: "70%"}}>
                                                <Typography.Title level={5}>
                                                    فرم مراجعت از فرار کارکنان وظیفه
                                                </Typography.Title>
                                            </Flex>
                                        </Col>
                                        <Col flex={1}>
                                            <Flex justify={"end"}>
                                                <Image
                                                    preview={false} shape="square" width={90}
                                                    src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                                    style={{border: "solid black 2px", borderRadius: "5px"}}
                                                />
                                            </Flex>
                                        </Col>
                                    </Row>

                                    <Flex style={{width: "90%"}}>
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
                                                <Typography.Text strong={true}>
                                                    {" " + soldier["deployment_date"] + " "}
                                                </Typography.Text>

                                                <Typography.Text strong>
                                                    {" " + soldier["target_run"]["absence_date"] + " "}
                                                </Typography.Text>
                                                مبادرت به نهست و در تاریخ
                                                <Typography.Text strong>
                                                    {" " + soldier["target_run"]["run_date"] + " "}
                                                </Typography.Text>
                                                پس از
                                                <Typography.Text strong>
                                                    {" 15 روز "}
                                                </Typography.Text>
                                                غیبت متوالی از خدمت فراری و در تاریخ
                                                <Typography.Text strong>
                                                    {" " + soldier["target_run"]["return_date"] + " "}
                                                </Typography.Text>
                                                از فرار مراجعت نموده است. با توجه به اینکه نامه فرار و مراجعت وی جهت امضای مسئولین ارسال گردیده است، لذا مشارالیه جهت سیر مراحل حفاظتی و قضایی پیرامون فرار خود معرفی میگردد. ضمنا نامبرده برای
                                                <Typography.Text strong>
                                                    {" " + GetNumberLabel(soldier["target_run"]["run_count"]) + "ین بار "}
                                                </Typography.Text>
                                                مرتکب فرار از خدمت گردیده است.
                                            </Typography.Text>
                                        </ConfigProvider>
                                    </Flex>

                                    <Flex style={{width: "90%"}} justify={"end"}>
                                        <Sign.SingleInline
                                            defaultSign={"رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا"}
                                            fontSize={13}
                                            forceRefresh={runIndex}
                                        />
                                    </Flex>

                                    <Flex style={{width: "90%"}} gap={"small"}>
                                        <Card
                                            style={{width: "100%"}}
                                            size={"small"}
                                            title={<Flex style={{width: "100%"}} justify={"center"}><Typography.Text style={{fontSize: "14px"}}>نظریه حفاظت اطلاعات</Typography.Text></Flex>}
                                        >
                                            <Flex style={{height: "90px"}} vertical>
                                                <Typography.Text style={{fontSize: "12px"}}>
                                                    به کارگیری نامبرده از نظر امنیتی از تاریخ ................ بلامانع می باشد.
                                                </Typography.Text>
                                                <Flex align={"flex-end"} style={{height: "100%"}}>
                                                    <Typography.Text strong style={{fontSize: "12px"}}>
                                                        حفاظت اطلاعات پشتیبانی مرکز نپاجا:
                                                    </Typography.Text>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                        <Card
                                            style={{width: "100%"}}
                                            size={"small"}
                                            title={<Flex style={{width: "100%"}} justify={"center"}><Typography.Text style={{fontSize: "14px"}}>نظریه قضایی</Typography.Text></Flex>}
                                        >
                                            <Flex style={{height: "90px"}} vertical>
                                                <Typography.Text style={{fontSize: "12px"}}>
                                                     نامبرده در تاریخ ............. مورد بازجویی قرار گرفت و جهت سیر مراحل فرار به مراجع قضایی احاله می گردد.
                                                </Typography.Text>
                                                <Flex align={"flex-end"} style={{height: "100%"}}>
                                                    <Typography.Text strong style={{fontSize: "12px"}}>
                                                        حفاظت اطلاعات پشتیبانی مرکز نپاجا:
                                                    </Typography.Text>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    </Flex>
                                </Flex>
                            );
                        })
                    }
                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default DeployToCourt;