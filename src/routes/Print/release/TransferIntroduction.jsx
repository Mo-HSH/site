import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Image, Input, notification, Row, Table, Typography} from "antd";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import Sign from "../../../components/printElement/Sign.jsx";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {getApiUrl} from "../../../utils/Config.js";
import axios from "axios";

function TransferIntroduction({setPrintTitle, soldierKey, refresher, isOutsideOfPadafand}) {

    const [soldier, setSoldier] = useState({
        "folder_number": "",
        "release": {
            "create_date": "",
            "military_guild": ""
        }
    });
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [introductionDate, setIntroductionDate] = useState("");

    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);

    useEffect(() => {
        setPrintTitle(isOutsideOfPadafand ? "معرفی نامه انتقالی خارج سازمانی" : "معرفی نامه انتقالی درون سازمانی");

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
                    "father_name": 1,
                    "military_rank": 1,
                    "deployment_date": 1,
                    "national_code": 1,
                    "personnel_code": 1,
                    "release": 1,
                    "extra_info": 1,
                    "mental_health": 1,
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
                        "body_status": res[0]["extra_info"].includes("معاف از رزم") ? "معاف از رزم" : "سالم",
                    });

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
                });
            });

    }, [refresher, soldierKey, isOutsideOfPadafand]);

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    return (
        <div>
            <ConfigProvider>
                {contextHolder}
                <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                      style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>
                    <Input style={{width: "300px"}} value={introductionDate}
                           onChange={(e) => setIntroductionDate(e.target.value)} addonBefore={"تاریخ معرفی"}/>

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
                        [...Array(2)].map((_, index) => {
                            return (
                                <Flex
                                    vertical={true} align={"center"}
                                    className={"break-after A5-landscape"}
                                    gap={"small"}
                                    style={{
                                        border: "solid gray 2px",
                                        borderRadius: "10px",
                                        background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                    }}
                                >
                                    <Flex
                                        style={{width: "90%", marginTop: "20px"}}
                                        align={"center"}
                                        vertical={true}
                                    >
                                        <Row style={{width: "95%"}}>
                                            <Col span={6}>
                                                <Typography.Text strong={true}>بسمه تعالی</Typography.Text>
                                            </Col>
                                            <Col span={12}>
                                                <Flex vertical={true} style={{width: "100%"}} justify={"center"}
                                                      align={"center"}>
                                                    {/*<Image preview={false} src={padafandLogo} width={70}/>*/}
                                                    <Typography.Text level={5} strong={true}
                                                                     style={{textAlign: "center"}}>
                                                        فرماندهی کل آجا
                                                        <br/>
                                                        نیروی پدافند هوایی
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>
                                            <Col span={6} style={{height: "100%"}}>
                                                <Flex style={{width: "100%"}} justify={"end"}>
                                                    <Image preview={false} shape="square" width={"55%"}
                                                           src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                                           style={{border: "solid black 2px"}}
                                                    />
                                                </Flex>
                                            </Col>
                                        </Row>
                                    </Flex>

                                    <Flex style={{width: "90%"}}>
                                        <Typography.Text style={{textAlign: "justify"}}>
                                            در اجرای امریه شماره:
                                            <Typography.Text strong={true}>
                                                {" " + soldier["release"]["move_order"] + " "}
                                            </Typography.Text>
                                            صادره از معاونت نیروی انسانی نپاجا به
                                            <Typography.Text strong={true}>
                                                {" " + soldier["military_rank"] + " "}
                                            </Typography.Text>
                                            وظیفه
                                            <Typography.Text strong={true}>
                                                {" " + soldier["first_name"] + " " + soldier["last_name"] + " "}
                                            </Typography.Text>
                                            فرزند
                                            <Typography.Text strong={true}>
                                                {" " + soldier["father_name"] + " "}
                                            </Typography.Text>
                                            به شماره ملی
                                            <Typography.Text strong={true}>
                                                {" " + soldier["national_code"] + " "}
                                            </Typography.Text>
                                            اعزامی
                                            <Typography.Text strong={true}>
                                                {" " + DateRenderer(soldier["deployment_date"]) + " "}
                                            </Typography.Text>
                                            به شماره پرسنلی
                                            <Typography.Text strong={true}>
                                                {" " + soldier["personnel_code"] + " "}
                                            </Typography.Text>
                                            ابلاغ گردید تا در تاریخ
                                            <Typography.Text strong={true}>
                                                {" " + introductionDate + " "}
                                            </Typography.Text>
                                            خود را به
                                            <Typography.Text strong={true}>
                                                {" " + soldier["release"]["move_location"] + " "}
                                            </Typography.Text>
                                            معرفی نماید، لذا خواهشمند است دستور فرمایید پس از معرفی نسبت بکارگیری
                                            نامبرده یکی از مشاغل سازمانی متناسب با رشته تحصیلی و تخصص اقدام و در صورت
                                            تکمیل بودن جداول سازمان با توجه به نیاز یگان در نزدیکترین شغل به مدرک تحصیلی
                                            و تخصص بکارگیری گردد(ضمنا تعداد یک برگ خلاصه وضعیت خدمتی نامبرده نیز بپیوست
                                            ارسال میگردد).
                                        </Typography.Text>
                                    </Flex>

                                    <Flex style={{width: "90%", marginTop: "20px", marginBottom: "20px"}}
                                          justify={"flex-end"}
                                          align={"center"}>
                                        <Sign.Single
                                            defaultSign={isOutsideOfPadafand ? "فرماندهی پشتیبانی مرکز پدافند هوایی آجا" : "مدیریت نیروی انسانی ف پش نیروی پدافند هوایی آجا"}
                                            fontSize={12} forceRefresh={true}
                                        />
                                    </Flex>

                                    <Flex style={{width: "90%"}}>
                                        <Table
                                            pagination={false}
                                            size={"small"}
                                            bordered={true}
                                            style={{width: "100%"}}
                                            dataSource={[{}]}
                                            columns={[
                                                {
                                                    title: "وضعیت جیره استحقاقی",
                                                    render: () => {
                                                        return ("دریافت نموده است");
                                                    },
                                                    align: "center"
                                                },
                                                {
                                                    title: "وضعیت دفترچه خدمات درمانی",
                                                    render: () => {
                                                        return ("دریافت نموده است");
                                                    },
                                                    align: "center"
                                                },
                                                {
                                                    title: "وضعیت حقوقی",
                                                    render: () => {
                                                        return ("برقرار می باشد");
                                                    },
                                                    align: "center"
                                                },
                                                {
                                                    title: "وضعیت جسمانی",
                                                    render: () => {
                                                        return (soldier["mental_health"] + " - " + soldier["body_status"]);
                                                    },
                                                    align: "center"
                                                },

                                            ]}
                                        />
                                    </Flex>

                                    {
                                        index === 1
                                            ?
                                            <Flex style={{width: "90%"}}>
                                                {
                                                    isOutsideOfPadafand
                                                        ?
                                                        <Row style={{width: "100%", marginTop: "10px"}}>
                                                            <Col span={12}>
                                                                <Flex style={{width: "100%"}} justify={"start"}>
                                                                    <Sign.Single
                                                                        defaultSign={"رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا"}
                                                                        fontSize={12} forceRefresh={true}
                                                                    />
                                                                </Flex>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Flex style={{width: "100%"}} justify={"end"}>
                                                                    <Sign.Single
                                                                        defaultSign={"مدیریت نیروی انسانی ف پش نیروی پدافند هوایی آجا"}
                                                                        fontSize={12} forceRefresh={true}
                                                                    />
                                                                </Flex>
                                                            </Col>
                                                        </Row>
                                                        :
                                                        <Flex style={{width: "100%", marginTop: "10px"}} vertical={true}
                                                              align={"end"}>
                                                            <Flex align={"center"} gap={70}>
                                                                <Typography.Text style={{fontSize: 12}}>
                                                                    متصدی اقدام
                                                                </Typography.Text>
                                                                <Sign.Single
                                                                    defaultSign={"رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا"}
                                                                    fontSize={12} forceRefresh={true}
                                                                />
                                                            </Flex>
                                                        </Flex>
                                                }
                                            </Flex>
                                            :
                                            null
                                    }

                                </Flex>
                            );
                        })
                    }
                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default TransferIntroduction;