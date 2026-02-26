import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Divider, Flex, Image, notification, Row, Table, Typography} from "antd";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import {getApiUrl} from "../../../utils/Config.js";
import axios from "axios";

function Release({setPrintTitle, soldierKey, refresher}) {

    const [soldier, setSoldier] = useState({
        "folder_number": "",
        "release": {
            "create_date": "",
            "military_guild": ""
        }
    });
    const [legalDutyDuration, setLegalDutyDuration] = useState({});
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [releaseSign, setReleaseSign] = useState("");

    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);

    useEffect(() => {
        setPrintTitle("تسویه");
        axios.get(getApiUrl("config/signs"), {withCredentials: true}).then((res) => {
            res.data.config.forEach(({key, value}) => {
                if (key === "رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا") {
                    setReleaseSign(value);
                }
            })
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تنظیمات امضا!"
            });
        });

        axios.get(getApiUrl("config/duty-duration"), {withCredentials: true}).then((res) => {
            setLegalDutyDuration(res.data.config);
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تنظیمات مدت خدمت!"
            });
        });

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
                    "folder_number": 1,
                    "first_name": 1,
                    "last_name": 1,
                    "father_name": 1,
                    "military_rank": 1,
                    "deployment_date": 1,
                    "national_code": 1,
                    "release": 1,
                    "birth_certificate_issuing_place": 1,
                    "birthday": 1,
                    "birthplace": 1,
                    "deployment_location": 1,
                    "learning_unit": 1,
                    "eye_color": 1,
                    "blood_type": 1,
                    "height": 1,
                    "state": 1,
                    "city": 1,
                    "address_street": 1,
                    "address_house_number": 1,
                    "address_home_unit": 1,
                    "education": 1,
                    "field_of_study": 1,
                    "personnel_code": 1,
                    "phone": 1,
                    "unit": 1,
                    "is_native": 1,
                    "mental_health": 1,
                    "duty_group": 1,
                    "extra_info": 1,
                    "run_discharge": 1,
                    "deficit": 1,
                    "run_punish": 1,
                    "section":1,
                }
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    if (res[0]["release"]["release_type"] === "پایان خدمت") {
                        setSoldier({
                            ...res[0],
                            deficit: res[0]["deficit"].reduce((acc, i) => i.day + acc, 0),
                            health_group: res[0]["mental_health"] === "گروه ب فراجا" || res[0]["mental_health"] === "گروه ب پش مرکز" || res[0]["extra_info"].includes("معاف از رزم") ? "معاف از رزم" : "سالم",
                            release_type: "قانونی"
                        });
                    } else {
                        setSoldier({
                            ...res[0],
                            deficit: res[0]["deficit"].reduce((acc, i) => i.day + acc, 0),
                            health_group: res[0]["mental_health"] === "گروه ب فراجا" || res[0]["mental_health"] === "گروه ب پش مرکز" || res[0]["extra_info"].includes("معاف از رزم") ? "معاف از رزم" : "سالم",
                            release_type: res[0]["release"]["release_type"],
                        });
                    }



                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
                });
            });
    }, [setPrintTitle, soldierKey, refresher]);

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    function getReleaseSigns() {

        if (soldier["release"]["signs"] === "امریه") {
            return ([
                [
                    "شعبه حقوقی فرماندهی پشتیبانی مرکز",
                    "خدمات درمانی نیرو های مسلح",
                    "دایره تامین حفاظت فرماندهی پشتیبانی مرکز"
                ],
                [
                    "عقیدتی سیاسی فرماندهی مرکز (آموزش)",
                    "عقیدتی سیاسی فرماندهی پشتیبانی مرکز (نظارت و ارزشیابی مکتبی)",
                    "دایره قضایی و بازجویی فرماندهی پشتیبانی مرکز"
                ],
                [
                    "بازرسی و ایمنی فرماندهی پشتیبانی مرکز",
                    "حفاظت اطلاعات فرماندهی پشتیبانی مرکز",
                    ""
                ]
            ]);
        } else {
            let firstRow = [];
            firstRow.push("شعبه حقوقی فرماندهی پشتیبانی مرکز");
            if (soldier["release"]["signs"] === "گروه خدمات پاسداری") {
                firstRow.push("فرماندهی گروه خدمات و پاسداری");
            } else {
                firstRow.push("فرماندهی دژبانی قصر فیروزه (1و2)");
            }
            firstRow.push("خدمات درمانی نیروهای مسلح");

            return ([
                firstRow,
                [
                    "اسلحه خانه قصر فیروزه 2",
                    "پاسدار خانه قصر فیروزه 2",
                    "معاونت  آماد و پش (ترابری)"
                ],
                [
                    "دایره تامین حفاظت فرماندهی پشتیبانی مرکز",
                    "عقیدتی سیاسی فرماندهی پشتیبانی مرکز (آموزش)",
                    "عقیدتی سیاسی فرماندهی پشتیبانی مرکز (نظارت و ارزشیابی مکتبی)"
                ],
                [
                    "دایره قضایی و بازجویی فرماندهی پشتیبانی مرکز",
                    "بازرسی و ایمنی فرماندهی پشتیبانی مرکز",
                    "حفاظت اطلاعات فرماندهی پشتیبانی مرکز"
                ],
                [
                    "مرکز بهداشت روان مستقر در پش مرکز",
                    "مهارت آموزی و عملیات روانی",
                    ""
                ],
            ]);
        }
    }

    return (
        <div className={"highlighter"}>
            <ConfigProvider
                theme={{
                    components: {
                        Typography: {
                            fontSize: 12,
                            fontSizeHeading5: 14,
                        },
                        Table: {
                            borderColor: "rgba(5,5,5,0.15)",
                            fontSize: "13px",
                        }
                    },
                }}
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
                                size: portrait;
                              }
                            }
                        `}
                    </style>
                    {
                        soldier["release"]["release_type"] !== "پایان خدمت"
                            ?
                            null
                            :
                            <>
                                <Flex
                                    vertical={true} align={"center"}
                                    className={"break-after A5-portrait"}
                                    gap={"small"}
                                    style={{
                                        border: "solid gray 2px",
                                        borderRadius: "10px",
                                        background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                    }}
                                >
                                    <Flex style={{width: "90%", marginTop: "30px"}} justify={"end"}>
                                        <Typography.Text>
                                            {soldier["folder_number"]}
                                        </Typography.Text>
                                    </Flex>

                                    <Row gutter={[12, 0]} style={{width: "95%"}}>
                                        <Col span={4}>
                                            <Flex style={{width: "100%", height: "100%", border: "solid black 1px"}}>
                                                <Flex vertical={true} style={{marginRight: "5px"}}>
                                                    <Typography.Text style={{fontSize: "9px", marginTop: "10px"}}>
                                                        وضعیت خدمتی:
                                                    </Typography.Text>
                                                    <Typography.Text style={{fontSize: "9px"}}>
                                                        امریه دار
                                                    </Typography.Text>
                                                    <Typography.Text style={{fontSize: "9px"}}>
                                                        عادی
                                                    </Typography.Text>
                                                </Flex>
                                            </Flex>
                                        </Col>
                                        <Col span={16} style={{height: "100%"}}>
                                            <Flex vertical={true} align={"center"} justify={"end"}
                                                  style={{width: "100%", height: "100%"}} gap={2}>
                                                <Flex vertical={true} align={"center"} justify={"start"}
                                                      style={{width: "100%", height: "100%"}}>
                                                    <Typography.Text>
                                                        بسمه تعالی
                                                    </Typography.Text>
                                                    <Typography.Text>
                                                        فرم درخواست کارت
                                                    </Typography.Text>
                                                </Flex>
                                                <Row style={{width: "100%"}}>
                                                    <Col span={6} style={{
                                                        textAlign: "center",
                                                        padding: "5px",
                                                        border: "solid black 1px",
                                                        borderLeft: 0
                                                    }}>
                                                        <Typography.Text>
                                                            کد تفضیلی
                                                        </Typography.Text>
                                                    </Col>
                                                    <Col span={6} style={{
                                                        textAlign: "center",
                                                        padding: "5px",
                                                        border: "solid black 1px",
                                                        borderLeft: 0
                                                    }}>
                                                        <Typography.Text>
                                                            {parseInt(soldier["folder_number"].split("-").join(""))}
                                                        </Typography.Text>
                                                    </Col>
                                                    <Col span={6} style={{
                                                        textAlign: "center",
                                                        padding: "5px",
                                                        border: "solid black 1px",
                                                        borderLeft: 0
                                                    }}>
                                                        <Typography.Text>
                                                            تاریخ
                                                        </Typography.Text>
                                                    </Col>
                                                    <Col span={6}
                                                         style={{
                                                             textAlign: "center",
                                                             padding: "5px",
                                                             border: "solid black 1px"
                                                         }}>
                                                        <Typography.Text>
                                                            {DateRenderer(soldier["release"]["release_date"])}
                                                        </Typography.Text>
                                                    </Col>
                                                </Row>
                                            </Flex>
                                        </Col>
                                        <Col span={4}>
                                            <Image preview={false} shape="square" width={"100%"}
                                                   src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                                   style={{border: "solid black 2px"}}
                                            />
                                        </Col>
                                    </Row>
                                    <Flex align={"center"} justify={"center"} style={{width: "100%", height: "100%"}}>
                                        <Row style={{width: "90%"}}>
                                            <Col span={12} style={{border: "solid black 2px", borderLeft: 0}}>
                                                {
                                                    [
                                                        {label: "نام", data: soldier["first_name"]},
                                                        {label: "نشان", data: soldier["last_name"]},
                                                        {label: "نام پدر", data: soldier["father_name"]},
                                                        {label: "شماره شناسنامه", data: soldier["national_code"]},
                                                        {
                                                            label: "محل صدور",
                                                            data: soldier["birth_certificate_issuing_place"]
                                                        },
                                                        {label: "تاریخ تولد", data: DateRenderer(soldier["birthday"])},
                                                        {label: "محل تولد", data: soldier["birthplace"]},
                                                        {
                                                            label: "حوزه اعزام کننده",
                                                            data: soldier["deployment_location"]
                                                        },
                                                        {label: "کد ملی", data: soldier["national_code"]},
                                                        {label: "یگان آموزشی", data: soldier["learning_unit"]},
                                                        {label: "رنگ چشم", data: soldier["eye_color"]},
                                                        {label: "گروه خون", data: soldier["blood_type"]},
                                                        {label: "قد", data: soldier["height"]},
                                                        {
                                                            label: "آدرس",
                                                            data: ""
                                                        },
                                                    ].map(({label, data}) => {
                                                        return (
                                                            <Row style={{borderBottom: "solid black 1px"}}>
                                                                <Typography.Text style={{margin: "4px 4px 4px 0"}}>
                                                                    {label}:
                                                                    <Typography.Text strong={true}>
                                                                        {" " + data}
                                                                    </Typography.Text>
                                                                </Typography.Text>
                                                            </Row>
                                                        );
                                                    })
                                                }
                                                <Row>
                                                    <Flex vertical={true} style={{margin: "4px 4px 4px 0"}}>
                                                        <Typography.Text>
                                                            صحت مندرجات جداول فرم 111 مورد تایید اینجانب میباشد.
                                                        </Typography.Text>
                                                        <Typography.Text>
                                                            درجه:
                                                        </Typography.Text>
                                                        <Typography.Text>
                                                            نام و نشان:
                                                        </Typography.Text>
                                                        <Typography.Text>
                                                            امضاء و اثر انگشت:
                                                        </Typography.Text>
                                                    </Flex>
                                                </Row>
                                            </Col>
                                            <Col span={12} style={{border: "solid black 2px"}}>
                                                {
                                                    [
                                                        {label: "درجه", data: soldier["military_rank"]},
                                                        {
                                                            label: "رسته خدمتی",
                                                            data: soldier["release"]["military_guild"]
                                                        },
                                                        {
                                                            label: "مدرک تحصیلی",
                                                            data: soldier["education"] + " " + soldier["field_of_study"]
                                                        },
                                                        {
                                                            label: "تاریخ شروع خدمت",
                                                            data: DateRenderer(soldier["deployment_date"])
                                                        },
                                                        {
                                                            label: "تاریخ خاتمه خدمت",
                                                            data: DateRenderer(soldier["release"]["release_date"])
                                                        },
                                                        {
                                                            label: "مدت خدمت انجام شده",
                                                            data: soldier["release"]["duty_duration"]
                                                        },
                                                        {label: "شماره پرسنلی", data: soldier["personnel_code"]},
                                                        {label: "کسری", data: soldier["release"]["release_reason"]},
                                                        {label: "شماره تماس", data: ""},
                                                        {label: "یگان", data: soldier["unit"]},
                                                        {label: "کد تخصص", data: ""},
                                                        {label: "یگان ترخیص کننده", data: "ف پش مرکز نپاجا"},
                                                        {label: "محل خدمت", data: soldier["section"]},
                                                        {
                                                            label: "مدت قانونی خدمت",
                                                            data: soldier["is_native"] === undefined ? "" : soldier["is_native"] ? legalDutyDuration["native_duty_month"] + " ماه" : legalDutyDuration["none_native_duty_month"] + " ماه"
                                                        },
                                                    ].map(({label, data}) => {
                                                        return (
                                                            <Row style={{
                                                                height: "5.5%",
                                                                borderBottom: "solid black 1px"
                                                            }}>
                                                                <Typography.Text style={{margin: "4px 4px 4px 0"}}>
                                                                    {label}:
                                                                    <Typography.Text strong={true}>
                                                                        {" " + data}
                                                                    </Typography.Text>
                                                                </Typography.Text>
                                                            </Row>
                                                        );
                                                    })
                                                }
                                                <Row style={{height: "20%", width: "100%"}}>
                                                    <Flex justify={"center"} align={"center"}
                                                          style={{height: "100%", width: "100%"}}>
                                                        <Sign.Single
                                                            defaultSign={"رئیس دایره وظیفه های ف پش نپاجا"}
                                                            fontSize={10}
                                                        />
                                                    </Flex>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Flex>
                                </Flex>
                                <Flex
                                    vertical={true} align={"center"}
                                    className={"break-after A5-portrait"}
                                    gap={"small"}
                                    style={{
                                        border: "solid gray 2px",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <Flex
                                        style={{border: "solid black 2px", width: "90%", marginTop: "20px"}}
                                        align={"center"}
                                        vertical={true}
                                    >
                                        <Row style={{width: "95%", marginTop: "20px"}}>
                                            <Col span={6}>
                                                <Typography.Text strong={true}>بسمه تعالی</Typography.Text>
                                            </Col>
                                            <Col span={13}>
                                                <Flex vertical={true} style={{width: "100%"}} justify={"center"}
                                                      align={"center"}>
                                                    <Image preview={false} src={padafandLogo} width={70}/>
                                                    <Typography.Title level={5} strong={true}>کارت موقت پایان خدمت
                                                        کارکنان
                                                        وظیفه</Typography.Title>
                                                </Flex>
                                            </Col>
                                            <Col span={5} style={{height: "100%"}}>
                                                <Flex style={{width: "100%"}} justify={"end"}>
                                                    <Image preview={false} shape="square" width={"75%"}
                                                           src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                                           style={{border: "solid black 2px"}}
                                                    />
                                                </Flex>
                                            </Col>
                                        </Row>

                                        <Flex style={{width: "90%", marginTop: "20px"}}>
                                            <Typography.Text style={{textAlign: "justify"}}>
                                                <Typography.Text
                                                    strong={true}>{soldier["military_rank"] + " "}</Typography.Text>
                                                وظیفه
                                                <Typography.Text
                                                    strong={true}>{" " + soldier["first_name"] + " " + soldier["last_name"] + " "}</Typography.Text>
                                                فرزند
                                                <Typography.Text
                                                    strong={true}>{" " + soldier["father_name"] + " "}</Typography.Text>
                                                به شماره ملی
                                                <Typography.Text
                                                    strong={true}>{" " + soldier["national_code"] + " "}</Typography.Text>
                                                اعزامی
                                                <Typography.Text
                                                    strong={true}>{" " + DateRenderer(soldier["deployment_date"]) + " "}</Typography.Text>
                                                در تاریخ
                                                <Typography.Text
                                                    strong={true}>{" " + DateRenderer(soldier["release"]["release_date"]) + " "}</Typography.Text>
                                                خدمت مقدس سربازی را به مدت
                                                <Typography.Text
                                                    strong={true}>{" " + soldier["release"]["duty_duration"] + " "}</Typography.Text>
                                                به پایان رسانیده است. ضمنا مدت اعتبار این کارت 2 ماه از تاریخ صدور است.
                                            </Typography.Text>
                                        </Flex>


                                        <Flex style={{width: "90%", marginTop: "20px", marginBottom: "20px"}}
                                              justify={"flex-end"}
                                              align={"center"}>
                                            <Sign.Single
                                                defaultSign={"مدیر نیروی انسانی ف پش نپاجا"}
                                                fontSize={12}
                                            />
                                        </Flex>
                                    </Flex>

                                    <Flex align={"center"} vertical={true} style={{width: "90%", marginTop: "20px"}}>
                                        <Typography.Text>
                                            (کارت اصلی 1ماه پس از انقضاء این کارت توسط ناجا صادر میگردد)
                                        </Typography.Text>
                                        <Divider/>
                                    </Flex>

                                    <Flex justify={"flex-end"} align={"center"}
                                          style={{width: "90%", height: "100%", marginTop: "60px"}}>
                                        <Sign.Single
                                            defaultSign={"رئیس دایره وظیفه های ف پش نپاجا"}
                                            fontSize={12}
                                        />
                                    </Flex>
                                </Flex>
                                {
                                    [...Array(soldier["release"]["signs"] === "امریه" ? 0 : 2)].map((_) => {
                                        return (
                                            <Flex
                                                vertical={true} align={"center"}
                                                className={"break-after A5-portrait"}
                                                gap={"small"}
                                                style={{
                                                    border: "solid gray 2px",
                                                    borderRadius: "10px",
                                                    background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                                }}
                                            >
                                                <Flex style={{width: "90%", marginTop: "40px"}} align={"center"}
                                                      vertical={true}>
                                                    <Typography.Title level={5}>
                                                        گواهی سابقه کار تخصصی در طول خدمت سربازی
                                                    </Typography.Title>
                                                    <Typography.Title level={5}>
                                                        (پیوست شماره 1)
                                                    </Typography.Title>
                                                </Flex>

                                                <Row style={{width: "90%", marginTop: "20px"}}>
                                                    <Col span={19}>

                                                    </Col>
                                                    <Col span={5}>
                                                        <Flex vertical={true} style={{width: "100%"}}
                                                              justify={"center"}>
                                                            <Image preview={false} shape="square" width={"100%"}
                                                                   src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                                                   style={{border: "solid black 2px"}}
                                                            />
                                                            <Row style={{marginTop: "10px"}}>
                                                                <Col flex={1}>
                                                                    <Typography.Text>شماره:</Typography.Text>
                                                                </Col>
                                                                <Col flex={1}>
                                                                    <Flex style={{width: "100%", height: "100%"}}
                                                                          justify={"end"} align={"end"}>
                                                                        <Typography.Text>
                                                                            1613-2
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
                                                                            {DateRenderer(soldier["release"]["create_date"])}
                                                                        </Typography.Text>
                                                                    </Flex>
                                                                </Col>
                                                            </Row>
                                                        </Flex>
                                                    </Col>
                                                </Row>

                                                <Flex style={{width: "90%"}} vertical={true}>
                                                    <Typography.Text>
                                                        گواهی میشود
                                                    </Typography.Text>
                                                    <Typography.Text style={{textIndent: 60, textAlign: "justify"}}>
                                                        جناب آقای
                                                        <Typography.Text strong={true}>
                                                            {" " + soldier["first_name"] + " " + soldier["last_name"] + " "}
                                                        </Typography.Text>
                                                        به شماره ملی
                                                        <Typography.Text strong={true}>
                                                            {" " + soldier["national_code"] + " "}
                                                        </Typography.Text>
                                                        فرزند
                                                        <Typography.Text strong={true}>
                                                            {" " + soldier["father_name"] + " "}
                                                        </Typography.Text>
                                                        به پایه خدمتی
                                                        <Typography.Text strong={true}>
                                                            {" " + soldier["release"]["duty_duration"] + " "}
                                                        </Typography.Text>
                                                        از تاریخ
                                                        <Typography.Text strong={true}>
                                                            {" " + DateRenderer(soldier["deployment_date"]) + " "}
                                                        </Typography.Text>
                                                        تا تاریخ
                                                        <Typography.Text strong={true}>
                                                            {" " + DateRenderer(soldier["release"]["release_date"]) + " "}
                                                        </Typography.Text>
                                                        به مدت
                                                        <Typography.Text strong={true}>
                                                            {" " + soldier["release"]["duty_duration"] + " "}
                                                        </Typography.Text>
                                                        در استان
                                                        <Typography.Text strong={true}>
                                                            {" " + "تهران" + " "}
                                                        </Typography.Text>
                                                        شهرستان
                                                        <Typography.Text strong={true}>
                                                            {" " + "تهران،" + " "}
                                                        </Typography.Text>
                                                        نیروی پدافند هوایی یگان پشتیبانی مرکز به عنوان
                                                        <Typography.Text strong={true}>
                                                            {" " + soldier["release"]["proficiency"] + " "}
                                                        </Typography.Text>
                                                        مشغول کار بوده است.
                                                    </Typography.Text>
                                                    <Typography.Text style={{marginTop: "10px", textAlign: "justify"}}>
                                                        ضمن آرزوی موفقیت برای جنابعالی در تمام مراحل زندگی فردی و
                                                        اجتماعی از
                                                        اهتمام
                                                        شایسته، تلاش
                                                        و جدیت شما در طول مدت خدمت سربازی تقدیر میگردد.
                                                    </Typography.Text>
                                                </Flex>

                                                <Flex justify={"flex-end"} align={"center"}
                                                      style={{width: "90%", height: "100%", marginTop: "60px"}}>
                                                    <Sign.Single
                                                        defaultSign={"مدیر نیروی انسانی ف پش نپاجا"}
                                                        fontSize={12}
                                                    />
                                                </Flex>
                                            </Flex>
                                        )
                                    })
                                }
                            </>
                    }
                    {
                        [...Array(soldier["release"]["signs"] === "امریه" ? 2 : 3)].map((_) => {
                            return (
                                <Flex
                                    vertical={true} align={"center"}
                                    className={"break-after A5-portrait"}
                                    gap={"small"}
                                    style={{
                                        border: "solid gray 2px",
                                        borderRadius: "10px",
                                        background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                    }}
                                >
                                    <Typography.Title level={5} style={{marginTop: "20px"}}>فرم تسویه حساب
                                        کارکنان وظیفه
                                        فرماندهی پش مرکز
                                        نپاجا</Typography.Title>

                                    <Row style={{width: "90%"}} gutter={[12, 0]}>
                                        <Col span={19} style={{height: "100%"}}>
                                            <Row style={{
                                                height: soldier["release"]["release_reason"] === "انتقالی" ? "33%" : "50%",
                                                border: "solid black 2px",
                                                borderBottom: "solid black 1px"
                                            }}>
                                                {
                                                    [
                                                        {label: "درجه", data: soldier["military_rank"]},
                                                        {
                                                            label: "نام و",
                                                            label2: "نشان",
                                                            data: soldier["first_name"] + " " + soldier["last_name"]
                                                        },
                                                        {label: "کدملی", data: soldier["national_code"]},
                                                    ].map(({label, label2, data}, index) => {
                                                        return (
                                                            <>
                                                                <Col flex={1}
                                                                     style={{borderLeft: "solid black 1px"}}>
                                                                    <Flex justify={"center"} align={"center"}
                                                                          style={{
                                                                              width: "100%",
                                                                              height: "100%"
                                                                          }}>
                                                                        <Typography.Text style={{
                                                                            fontSize: "10px",
                                                                            textAlign: "center"
                                                                        }}>
                                                                            {label}
                                                                            <br/>
                                                                            {label2}
                                                                        </Typography.Text>
                                                                    </Flex>
                                                                </Col>
                                                                <Col flex={1}
                                                                     style={{borderLeft: index === 2 ? 0 : "solid black 1px"}}>
                                                                    <Flex justify={"center"} align={"center"}
                                                                          style={{
                                                                              width: "100%",
                                                                              height: "100%"
                                                                          }}>
                                                                        <Typography.Text strong={true}
                                                                                         style={{fontSize: "10px"}}>
                                                                            {data}
                                                                        </Typography.Text>
                                                                    </Flex>
                                                                </Col>
                                                            </>
                                                        );
                                                    })
                                                }
                                            </Row>
                                            <Row style={{
                                                height: soldier["release"]["release_reason"] === "انتقالی" ? "33%" : "50%",
                                                border: "solid black 2px",
                                                borderTop: 0
                                            }}>
                                                {
                                                    [
                                                        {label: "نام پدر", data: soldier["father_name"]},
                                                        {
                                                            label: "تاریخ",
                                                            label2: "ترخیص",
                                                            data: DateRenderer(soldier["release"]["release_date"])
                                                        },
                                                        {
                                                            label: "تاریخ",
                                                            label2: "تسویه",
                                                            data: DateRenderer(soldier["release"]["create_date"])
                                                        },
                                                        {
                                                            label: "اعزامی",
                                                            data: DateRenderer(soldier["deployment_date"])
                                                        },
                                                    ].map(({label, label2, data}, index) => {
                                                        return (
                                                            <>
                                                                <Col flex={1}
                                                                     style={{borderLeft: "solid black 1px"}}>
                                                                    <Flex justify={"center"} align={"center"}
                                                                          style={{
                                                                              width: "100%",
                                                                              height: "100%"
                                                                          }}>
                                                                        <Typography.Text style={{
                                                                            fontSize: "10px",
                                                                            textAlign: "center"
                                                                        }}>
                                                                            {label}
                                                                            <br/>
                                                                            {label2}
                                                                        </Typography.Text>
                                                                    </Flex>
                                                                </Col>
                                                                <Col flex={1}
                                                                     style={{borderLeft: index === 3 ? 0 : "solid black 1px"}}>
                                                                    <Flex justify={"center"} align={"center"}
                                                                          style={{
                                                                              width: "100%",
                                                                              height: "100%"
                                                                          }}>
                                                                        <Typography.Text strong={true}
                                                                                         style={{fontSize: "10px"}}>
                                                                            {data}
                                                                        </Typography.Text>
                                                                    </Flex>
                                                                </Col>
                                                            </>
                                                        );
                                                    })
                                                }
                                            </Row>
                                            {
                                                soldier["release"]["release_reason"] === "انتقالی"
                                                    ?
                                                    <Row style={{
                                                        height: "33%",
                                                        border: "solid black 2px",
                                                        borderTop: 0
                                                    }}>
                                                        {
                                                            [
                                                                {
                                                                    label: "یگان منتقله",
                                                                    data: soldier["release"]["move_location"]
                                                                },
                                                                {
                                                                    label: "شماره امریه انتقال",
                                                                    data: soldier["release"]["move_order"]
                                                                },
                                                            ].map(({label, data}, index) => {
                                                                return (
                                                                    <>
                                                                        <Col flex={1}
                                                                             style={{borderLeft: "solid black 1px"}}>
                                                                            <Flex justify={"center"} align={"center"}
                                                                                  style={{
                                                                                      width: "100%",
                                                                                      height: "100%"
                                                                                  }}>
                                                                                <Typography.Text style={{
                                                                                    fontSize: "10px",
                                                                                    textAlign: "center"
                                                                                }}>
                                                                                    {label}
                                                                                </Typography.Text>
                                                                            </Flex>
                                                                        </Col>
                                                                        <Col flex={1}
                                                                             style={{borderLeft: index === 1 ? 0 : "solid black 1px"}}>
                                                                            <Flex justify={"center"} align={"center"}
                                                                                  style={{
                                                                                      width: "100%",
                                                                                      height: "100%"
                                                                                  }}>
                                                                                <Typography.Text strong={true}
                                                                                                 style={{fontSize: "10px"}}>
                                                                                    {data}
                                                                                </Typography.Text>
                                                                            </Flex>
                                                                        </Col>
                                                                    </>
                                                                );
                                                            })
                                                        }
                                                    </Row>
                                                    :
                                                    <></>
                                            }
                                        </Col>
                                        <Col span={5}>
                                            <Image preview={false} shape="square" width={"100%"}
                                                   src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                                   style={{border: "solid black 2px"}}
                                            />
                                        </Col>
                                    </Row>

                                    <Flex style={{width: "90%", marginTop: "20px", textAlign: "justify"}}>
                                        <Typography.Text>
                                            به علت
                                            <Typography.Text strong={true}>
                                                {" " + soldier["release"]["release_reason"] + " "}
                                            </Typography.Text>
                                            {
                                                soldier["release"]["release_reason"] === "انتقالی"
                                                    ?
                                                    " از این یگان "
                                                    :
                                                    " از خدمت مقدس سربازی "
                                            }
                                            ترخیص که چگونگی در
                                            {
                                                soldier["release"]["release_reason"] === "انتقالی"
                                                    ?
                                                    " ماده 4 دستور"
                                                    :
                                                    " ماده 13 دستور"
                                            }
                                            &nbsp;
                                            &nbsp;
                                            این یگان درج
                                            گردیده است.
                                            لذا خواهشمند است دستور فرمائید در این مورد بررسی و چنانچه نامبرده از
                                            نظر
                                            مالی و اداری فاقد مشکل می باشد، محل مربوطه راامضاء و ممهور به مهر
                                            فرمائید.
                                            (ضمناً مهلت تکمیل تسویه حساب از تاریخ صدور یک هفته می باشد و بدیهی
                                            است در
                                            صورت عدم ارائه تسویه حساب، نسبت به نهست و فرار اقدام خواهد گردید.)
                                        </Typography.Text>
                                    </Flex>

                                    <Flex style={{width: "90%", marginTop: "20px"}} justify={"end"}>
                                        <Sign.SingleInline
                                            defaultSign={"مدیر نیروی انسانی ف پش نپاجا"}
                                            fontSize={12}
                                        />
                                    </Flex>

                                    <Row style={{width: "90%", height: "50%", border: "solid black 2px"}}>
                                        {
                                            getReleaseSigns().map((arr, index, all) => {
                                                return (
                                                    <Row style={{
                                                        width: "100%",
                                                        borderBottom: all.length - 1 === index ? null : "solid black 1px"
                                                    }}>
                                                        {
                                                            arr.map((text, innerIndex, innerAll) => {
                                                                return (<Col span={8}
                                                                             style={{borderLeft: innerAll.length - 1 === innerIndex ? null : "solid black 1px"}}>
                                                                    <Flex justify={"center"} align={"center"}
                                                                          style={{
                                                                              width: "100%",
                                                                              height: "100%"
                                                                          }}>
                                                                        {
                                                                            all.length - 1 === index && innerAll.length - 1 === innerIndex
                                                                                ?
                                                                                <Typography.Text
                                                                                    style={{textAlign: "center"}}>
                                                                                    رئیس دایره وظیفه های مد ن ا
                                                                                    و پش
                                                                                    مرکز نپاجا
                                                                                    <br/>
                                                                                    {releaseSign}
                                                                                </Typography.Text>
                                                                                :
                                                                                <Typography.Text
                                                                                    style={{textAlign: "center"}}>
                                                                                    {text}
                                                                                </Typography.Text>
                                                                        }
                                                                    </Flex>
                                                                </Col>);
                                                            })
                                                        }
                                                    </Row>
                                                );
                                            })
                                        }
                                    </Row>

                                </Flex>
                            );
                        })
                    }
                    {
                        [...Array(2)].map((_) => {
                            return (
                                <Flex
                                    vertical={true} align={"center"}
                                    className={"break-after A5-portrait"}
                                    gap={"small"}
                                    style={{
                                        border: "solid gray 2px",
                                        borderRadius: "10px",
                                        background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                    }}
                                >
                                    <Flex align={"center"}>
                                        <Flex align={"flex-end"} gap={120}>
                                            <Typography.Title level={4} style={{height: "100%"}}>
                                                ماده
                                            </Typography.Title>
                                            <Typography.Title level={4} style={{height: "100%"}}>
                                                دستور
                                            </Typography.Title>
                                        </Flex>
                                    </Flex>

                                    <Flex style={{width: "90%"}}>
                                        <Typography.Text style={{textAlign: "justify"}}>
                                            <Typography.Text strong>
                                                {soldier["military_rank"] + " "}
                                            </Typography.Text>
                                            وظیفه
                                            <Typography.Text strong={true}>
                                                {" " + soldier["first_name"] + " " + soldier["last_name"] + " "}
                                            </Typography.Text>
                                            اعزامی
                                            <Typography.Text
                                                strong={true}>{" " + DateRenderer(soldier["deployment_date"]) + " "}
                                            </Typography.Text>
                                            برابر جدول ذیل در تاریخ
                                            <Typography.Text
                                                strong={true}>{" " + DateRenderer(soldier["release"]["release_date"]) + " "}
                                            </Typography.Text>
                                            {
                                                soldier["release"]["release_type"] === "معافیت"
                                                    ?
                                                    "بعلت معافیت "
                                                    :
                                                    soldier["release"]["release_type"] === "معافیت موقت"
                                                        ?
                                                        "بعلت 6 ماه معافیت موقت "
                                                        :
                                                        ""
                                            }
                                            {
                                                soldier["release"]["release_type"] === "انتقالی"
                                                    ?
                                                    <Typography.Text strong={true}>
                                                        به {soldier["release"]["move_location"]} منتقل
                                                    </Typography.Text>
                                                    :
                                                    "از خدمت مقدس سربازی"
                                            }
                                            {
                                                soldier["release"]["release_type"] === "معافیت موقت"
                                                    ?
                                                    <Typography.Text strong={true}>
                                                        {" موقتاً ترخیص "}
                                                    </Typography.Text>
                                                    :
                                                    soldier["release"]["release_type"] === "انتقالی"
                                                        ?
                                                        " و به همین منظور "
                                                        :
                                                        <>
                                                            <Typography.Text strong={true}>
                                                                {" ترخیص "}
                                                            </Typography.Text>
                                                            {"و "}
                                                        </>
                                            }
                                            از همان تاریخ کلیه حقوق و مزایای نامبرده
                                            {
                                                soldier["release"]["release_type"] === "انتقالی"
                                                    ?
                                                    " به یگان منتقله کد به کد "
                                                    :
                                                    " قطع "
                                            }
                                            میگردد.
                                        </Typography.Text>
                                    </Flex>

                                    <Flex style={{width: "90%"}} justify={"end"}>
                                        <Typography.Text>
                                            شماره نامه:
                                            <Typography.Text strong={true}>
                                                {" " + soldier["release"]["letter_number"]}
                                            </Typography.Text>
                                            &emsp;
                                            مورخ:
                                            <Typography.Text strong={true}>
                                                {" " + DateRenderer(soldier["release"]["letter_date"])}
                                            </Typography.Text>
                                            &emsp;
                                            صادره از:
                                            <Typography.Text strong={true}>
                                                {" " + soldier["release"]["letter_sender"]}
                                            </Typography.Text>
                                        </Typography.Text>
                                    </Flex>

                                    <Flex style={{width: "90%", marginTop: "20px"}} justify={"end"}>
                                        <Sign.MultiInline fontSize={13} singGap={50} defaultSign={[
                                            "مدیر نیروی انسانی ف پش نپاجا",
                                            "رئیس دایره وظیفه های ف پش نپاجا",
                                            "رئیس شعبه دستور ف پش نپاجا",
                                        ]}
                                        />
                                    </Flex>

                                    <Flex style={{width: "90%", height: "60%"}} align={"center"}>
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
                                            columns={[...Array(5)].map((v, index) => {
                                                return ({
                                                    align: "center",
                                                    dataIndex: index
                                                })
                                            })}
                                            style={{width: "100%"}}
                                            dataSource={[
                                                {
                                                    0: "درجه",
                                                    1: "نام و نشان",
                                                    2: "نام پدر",
                                                    3: "کد ملی",
                                                    4: "مدرک تحصیلی",
                                                },
                                                {
                                                    0: soldier["military_rank"],
                                                    1: soldier["first_name"] + " " + soldier["last_name"],
                                                    2: soldier["father_name"],
                                                    3: soldier["national_code"],
                                                    4: soldier["education"],
                                                },
                                                {
                                                    0: soldier["release"]["release_reason"] === "انتقالی" ? "تاریخ انتقالی" : "تاریخ ترخیص",
                                                    1: "نوع ترخیص",
                                                    2: "مدت خدمت",
                                                    3: "مدت نهست",
                                                    4: "اضافه خدمت انظباطی",
                                                },
                                                {
                                                    0: DateRenderer(soldier["release"]["release_date"]),
                                                    1: soldier["release_type"],
                                                    2: `${soldier["release"]["duty_duration"]} ${soldier["deficit"] ? `(${soldier["deficit"]} روز کسری خدمت)` : ""}`,
                                                    3: soldier["release"]["absence_discharge"],
                                                    4: soldier["release"]["additional_service_day"],
                                                },
                                                {
                                                    0: "اضافه خدمت سنواتی",
                                                    1: "اضافه خدمت استعلاجی و سالیانه",
                                                    2: "مدت فرار",
                                                    3: "اضافه خدمت ماده 60",
                                                    4: "جمع کل",
                                                },
                                                {
                                                    0: soldier["release"]["additional_service_punish_day"],
                                                    1: soldier["release"]["extra_annual_leave"] + soldier["release"]["extra_medical_leave"],
                                                    2: soldier["release"]["run_discharge"],
                                                    3: soldier["run_punish"],
                                                    4: soldier["release"]["absence_discharge"] + soldier["release"]["additional_service_punish_day"] + soldier["release"]["additional_service_day"] + soldier["release"]["extra_annual_leave"] + soldier["release"]["extra_medical_leave"] + soldier["release"]["run_discharge"] + soldier["run_punish"],
                                                },
                                                {
                                                    0: "گروه سلامت",
                                                    1: soldier["health_group"],
                                                    2: "گروه خدمتی",
                                                    3: soldier["duty_group"] ? "رزمی" : "غیر رزمی",
                                                }
                                            ]}
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
        ;
}

export default Release;
