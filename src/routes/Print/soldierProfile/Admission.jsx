import {Button, Card, Col, ConfigProvider, Divider, Flex, Image, notification, Row, Table, Typography} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import bimehOmr from "../../../assets/img/BimehOmr.png";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {BorderOutlined} from "@ant-design/icons";
import {useReactToPrint} from "react-to-print";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";


function Admission({setPrintTitle, soldierKey}) {
    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [soldier, setSoldier] = useState({"family": []});
    const [today, setToday] = useState("");
    const [sign1, setSign1] = useState("");
    const [sign2, setSign2] = useState("");
    const [travelData, setTravelData] = useState([]);

    useEffect(() => {
        setPrintTitle("پذیرش");

        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setToday(DateRenderer({"$date": {"$numberLong": res.data}}));
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
            });
        });

        axios.get(getApiUrl("config/duty-duration"), {withCredentials: true}).then((res) => {
            Object.entries(res.data.config).forEach((v) => {
                if (v[1]["key"] === "رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا") {
                    setSign1(v[1]["value"]);
                }
                if (v[1]["key"] === "مدیریت نیروی انسانی ف پش نیروی پدافند هوایی آجا") {
                    setSign2(v[1]["value"]);
                }
            });
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تنظیمات امضا!"
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
                        "birth_certificate_issuing_place": 1,
                        "first_name": 1,
                        "last_name": 1,
                        "military_rank": 1,
                        "national_code": 1,
                        "father_name": 1,
                        "personnel_code": 1,
                        "deployment_date": 1,
                        "birthday": 1,
                        "birthplace": 1,
                        "religion": 1,
                        "education": 1,
                        "field_of_study": 1,
                        "mental_health": 1,
                        "extra_info": 1,
                        "blood_type": 1,
                        "height": 1,
                        "eye_color": 1,
                        "state": 1,
                        "city": 1,
                        "address_street": 1,
                        "address_house_number": 1,
                        "address_home_unit": 1,
                        "phone": 1,
                        "family": 1,
                        "is_native": 1,
                        "legal_release_date": 1,
                        "overall_release_date": 1,
                        "done_service_day": 1,
                        "additional_service_day": 1,
                        "folder_number": 1,
                        "previous_unit": 1,
                        "entry_date": 1,
                        "bank_account": 1,
                        "unit": 1,
                        "section": 1,
                        "skill_to_learn": 1,
                        "skill": 1,
                        "vaccine": 1,
                        "learning_unit": 1,
                        "deployment_location": 1,
                        "have_passport": 1,
                        "foreign_travels": 1,
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
                    setSoldier({
                        ...res[0],
                        "birthday": DateRenderer(res[0]["birthday"]),
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        "entry_date": DateRenderer(res[0]["entry_date"]),
                        "payroll_status": "برقرار شده است",
                        "insurance_status": "دریافت نموده ام",
                        "custom_education": res[0]["education"] + " " + res[0]["field_of_study"],
                        "full_name": res[0]["first_name"] + " " + res[0]["last_name"],
                        "body_health_status": res[0]["extra_info"].includes("معاف از رزم") ? "معاف از رزم" : "سالم",
                        "vaccine_status": res[0]["vaccine"] ? "کزاز/منژیت" : "نزده",
                        "marriage_status": marriage_check(res[0]["family"]),
                        "have_passport_text": res[0]["have_passport"] ? "می باشم" : "نمی باشم",
                    });
                    let temp = [];
                    for (const ElementKey in res[0]["foreign_travels"]) {
                        temp.push({
                            "key": parseInt(ElementKey) + 1,
                            "go_date": DateRenderer(res[0]["foreign_travels"][ElementKey]["go_date"]),
                            "return_date": DateRenderer(res[0]["foreign_travels"][ElementKey]["return_date"]),
                            "country": res[0]["foreign_travels"][ElementKey]["country"],
                            "reason": res[0]["foreign_travels"][ElementKey]["reason"],
                        });
                    }
                    setTravelData(temp);

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err
                });
            });
    }, [soldierKey]);

    function marriage_check(family) {
        for (const familyKey in family) {
            if (family[familyKey].relative === "همسر") {
                return "متأهل";
            }
        }

        return "مجرد";
    }

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    const familyInfoColumn = [
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
            title: "محل صدور شناسنامه",
            dataIndex: "birth_certificate_issuing_place",
            align: "center",
        },
        {
            title: "شغل",
            dataIndex: "job",
            align: "center",
        },
        {
            title: "نسبت",
            dataIndex: "relative",
            align: "center",
        },
    ];

    const addressInfoColumn = [
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
        },
        {
            title: "تلفن",
            dataIndex: "phone",
            align: "center",
        }
    ];

    const medicalInfoColumn = [
        {
            title: "قد",
            dataIndex: "height",
            align: "center",
        },
        {
            title: "رنگ چشم",
            dataIndex: "eye_color",
            align: "center",
        },
        {
            title: "گروه خون",
            dataIndex: "blood_type",
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
            title: "واکسن",
            dataIndex: "vaccine_status",
            align: "center",
        },
    ];

    const abilitiesInfoColumn = [
        {
            title: "تحصیلات",
            dataIndex: "custom_education",
            align: "center",
        },
        {
            title: "گواهینامه مهارت",
            dataIndex: "skill",
            align: "center",
        },
        {
            title: "علاقه مند به یادگیری مهارت",
            dataIndex: "skill_to_learn",
            align: "center",
        },
    ];

    const payrollInfoColumn = [
        {
            title: "شماره حساب",
            dataIndex: "bank_account",
            align: "center",
        },
        {
            title: "وضعیت حقوقی",
            dataIndex: "payroll_status",
            align: "center",
        },
        {
            title: "دفترچه خدمات درمانی",
            dataIndex: "insurance_status",
            align: "center",
        },
    ];

    const admissionInfoColumn = [
        {
            title: "تاریخ پذیرش",
            dataIndex: "entry_date",
            align: "center",
        },
        {
            title: "یگان",
            dataIndex: "unit",
            align: "center",
        },
        {
            title: "قسمت",
            dataIndex: "section",
            align: "center",
        },
        {
            title: "اضافه خدمت سنواتی",
            dataIndex: "additional_service_day",
            align: "center",
        },
        {
            title: "سابقه خدمت قبلی",
            dataIndex: "done_service_day",
            align: "center",
        },
    ]

    const foreignTravelInfoColumn = [
        {
            title: "ردیف",
            dataIndex: "key",
            align: "center",
        },
        {
            title: "تاریخ رفت",
            dataIndex: "go_date",
            align: "center",
        },
        {
            title: "تاریخ برگشت",
            dataIndex: "return_date",
            align: "center",
        },
        {
            title: "کشور",
            dataIndex: "country",
            align: "center",
        },
        {
            title: "دلیل",
            dataIndex: "reason",
            align: "center",
        },
    ];

    const militaryInfoColumn = [
        {
            title: "درجه",
            dataIndex: "military_rank",
            align: "center",
        },
        {
            title: "شماره پرسنلی",
            dataIndex: "personnel_code",
            align: "center",
        },
        {
            title: "شماره پرونده",
            dataIndex: "folder_number",
            align: "center",
        },
        {
            title: "تاریخ اعزام",
            dataIndex: "deployment_date",
            align: "center",
        },
        {
            title: "یگان قبلی",
            dataIndex: "previous_unit",
            align: "center",
        },
        {
            title: "یگان آموزشی",
            dataIndex: "learning_unit",
            align: "center",
        },
        {
            title: "حوزه اعزام",
            dataIndex: "deployment_location",
            align: "center",
        },
    ];

    const personalInfoColumn = [
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
            title: "تاریخ تولد",
            dataIndex: "birthday",
            align: "center",
        },
        {
            title: "محل تولد",
            dataIndex: "birthplace",
            align: "center",
        },
        {
            title: "محل صدور شناسنامه",
            dataIndex: "birth_certificate_issuing_place",
            align: "center",
        },
        {
            title: "تأهل",
            dataIndex: "marriage_status",
            align: "center",
        },
        {
            title: "دین و مذهب",
            dataIndex: "religion",
            align: "center",
        },
    ];

    return (
        <div>
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            colorBgContainer: "rgba(255,255,255,0)",
                            borderColor: "rgba(5,5,5,0.15)",
                            fontSize: `12px`,
                            paddingXS: `6px`,
                        },
                        Divider: {
                            margin: `10px`,
                            fontSizeLG: "14px",
                        },
                        Card: {
                            fontSizeLG: "12px"
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
                    <Flex vertical={true} align={"center"}
                          style={{
                              border: "solid gray 2px",
                              borderRadius: "10px",
                          }}
                          className={"break-after A4-portrait"}
                    >
                        <Flex style={{marginTop: "10px"}} vertical={true} align={"center"}>
                            <Image preview={false} src={padafandLogo} width={70}/>
                            <Typography.Title level={5} style={{marginTop: "5px"}}>برگه پذیرش کارکنان وظیفه جدیدالورود
                                فرماندهی پشتیبانی مرکز نپاجا</Typography.Title>
                        </Flex>
                        <Divider dashed orientation={"left"}>فرم اطلاعات فردی و مهارت آموزی</Divider>
                        <Flex vertical={true} style={{width: "100%"}} align={"center"} gap={"middle"}>
                            {
                                [
                                    {dataSource: [soldier], columns: personalInfoColumn, title: "اطلاعات فردی",},
                                    {dataSource: [soldier], columns: militaryInfoColumn, title: "اطلاعات خدمتی",},
                                    {dataSource: [soldier], columns: admissionInfoColumn, title: "اطلاعات پذیرش"},
                                    {dataSource: [soldier], columns: payrollInfoColumn, title: "اطلاعات حقوقی"},
                                    {dataSource: [soldier], columns: medicalInfoColumn, title: "اطلاعات جسمانی/روانی"},
                                    {dataSource: [soldier], columns: abilitiesInfoColumn, title: "مهارت"},
                                    {dataSource: [soldier], columns: addressInfoColumn, title: "نشانی"},
                                ].map(({dataSource, columns, title, extraTable}) => {
                                    return (
                                        <Flex vertical={true} style={{width: "100%"}} align={"center"} gap={0}>
                                            <Table
                                                size={"small"}
                                                pagination={false}
                                                bordered={true}
                                                dataSource={dataSource}
                                                locale={{
                                                    emptyText: <span
                                                        style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>, // Custom text for "No Data" view
                                                }}
                                                columns={columns}
                                                title={() => <Flex justify={"center"}>{title}</Flex>}
                                                style={{width: "90%"}}
                                            />
                                            {
                                                extraTable ?
                                                    <ConfigProvider
                                                        theme={{
                                                            components: {
                                                                Table: {
                                                                    headerBorderRadius: 0
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Table
                                                            size={"small"}
                                                            pagination={false}
                                                            bordered={true}
                                                            dataSource={extraTable.dataSource}
                                                            locale={{
                                                                emptyText: <span
                                                                    style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>, // Custom text for "No Data" view
                                                            }}
                                                            columns={extraTable.columns}
                                                            style={{width: "90%"}}
                                                        /> </ConfigProvider> :
                                                    null
                                            }
                                        </Flex>
                                    );
                                })
                            }
                        </Flex>
                    </Flex>
                    <Flex vertical={true} align={"center"}
                          style={{
                              border: "solid gray 2px",
                              borderRadius: "10px",
                          }}
                          className={"break-after A4-portrait"}
                    >
                        <Divider dashed orientation={"left"}>مشخصات بستگان و عائله تحت تکفل</Divider>
                        <Table
                            size={"small"}
                            pagination={false}
                            bordered={true}
                            dataSource={soldier["family"]}
                            locale={{
                                emptyText: <span
                                    style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>, // Custom text for "No Data" view
                            }}
                            columns={familyInfoColumn}
                            style={{width: "90%"}}
                        />
                        <Flex vertical={true} align={"center"}
                              style={{width: "100%"}}>
                            <Row
                                gutter={[32, 32]}
                                style={{marginTop: "32px"}}
                            >
                                <Col>
                                    صحت مندرجات فوق مورد تایید است.
                                </Col>
                                <Col>
                                    درجه: {soldier["military_rank"]}
                                </Col>
                                <Col>
                                    نام و نشان: {soldier["full_name"]}
                                </Col>
                                <Col>
                                    تاریخ: {today}
                                </Col>
                            </Row>
                            <Flex justify={"end"} style={{width: "90%", marginTop: "32px"}}>
                                <Typography.Text>امضا و اثر انگشت</Typography.Text>
                            </Flex>

                            <Divider dashed orientation={"left"}>اطلاعات گذرنامه</Divider>
                            <Flex vertical={true} align={"start"} style={{width: "90%"}}>
                                <Flex>
                                    <Typography.Text style={{marginBottom: "8px"}}>
                                        1- دارای گذرنامه
                                        &nbsp;
                                    </Typography.Text>
                                    <Typography.Text strong={true}>
                                        {soldier["have_passport_text"]}
                                    </Typography.Text>
                                </Flex>
                                <Flex justify={"center"} style={{width: "100%"}}>
                                    <Table
                                        size={"small"}
                                        pagination={false}
                                        bordered={true}
                                        dataSource={travelData}
                                        locale={{
                                            emptyText: <span
                                                style={{fontSize: '16px'}}>به سفر های خارجه نرفته ام</span>, // Custom text for "No Data" view
                                        }}
                                        columns={foreignTravelInfoColumn}
                                        style={{width: "100%"}}
                                    />
                                </Flex>
                            </Flex>

                            <Flex vertical={true} align={"start"} style={{width: "90%"}}>
                                <Typography.Text style={{marginTop: "8px", marginBottom: "8px"}}>2-
                                    تعهدنامه</Typography.Text>
                                <Typography.Text>
                                    اینجانب
                                    {" " + soldier["military_rank"] + " "}
                                    وظیفه
                                    {" " + soldier["full_name"] + " "}
                                    اعزامی
                                    {" " + soldier["deployment_date"] + " "}
                                    با شماره ملی
                                    {" " + soldier["national_code"] + " "}
                                    متعهد میگردم که چنانچه دارای گذرنامه می باشم، گذرنامه خود را در اولین فرصت تحویل
                                    دایره
                                    وظیفه های نیروی انسانی ف پش مرکز نمایم و در صورت عدم تحویل برابر روش با اینجانب
                                    رفتار
                                    گردد.
                                </Typography.Text>
                                <Flex justify={"end"} style={{width: "100%"}}>
                                    <Row
                                        gutter={[32, 32]}
                                        style={{marginTop: "32px"}}
                                    >
                                        <Col>
                                            درجه: {soldier["military_rank"]}
                                        </Col>
                                        <Col>
                                            نام و نشان: {soldier["full_name"]}
                                        </Col>
                                        <Col>
                                            تاریخ: {today}
                                        </Col>
                                        <Col>
                                            امضا و اثر انگشت
                                        </Col>
                                    </Row>
                                </Flex>
                            </Flex>

                            <Divider dashed orientation={"left"}>مصاحبه</Divider>
                            <Flex vertical={true} align={"center"} gap={10} style={{width: "100%"}}>
                                <Row gutter={10} style={{width: "90%"}}>
                                    {
                                        [
                                            "دایره وظیفه ها",
                                            "نماینده عقیدتی سیاسی ف پش",
                                            "نماینده حفاظت اطلاعات ف پش",
                                        ].map(title => (
                                            <Col span={8}>
                                                <Card title={<Flex justify={"center"}>{title}</Flex>} bordered={true}>
                                                    <div style={{height: "60px"}}></div>
                                                </Card>
                                            </Col>
                                        ))
                                    }
                                </Row>
                                <Row gutter={10} style={{width: "90%"}}>
                                    {
                                        [
                                            "نماینده بازرسی و ایمنی",
                                            "مهارت آموزی",
                                            "نماینده بهداشت و درمان",
                                        ].map(title => (
                                            <Col span={8}>
                                                <Card title={<Flex justify={"center"}>{title}</Flex>} bordered={true}>
                                                    <div style={{height: "60px"}}></div>
                                                </Card>
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </Flex>


                        </Flex>
                    </Flex>

                    <Flex vertical={true} align={"center"}
                          style={{
                              border: "solid gray 2px",
                              borderRadius: "10px",
                          }}
                          className={"break-after A4-portrait"}
                          gap={"small"}
                    >
                        <Divider dashed orientation={"left"}>فرم ذی نفعان بیمه عمر</Divider>
                        <Flex style={{width: "100%"}}>
                            <svg width="100%" height="auto" viewBox="0 0 800 600">
                                <image href={bimehOmr} x="0" y="0" width="800" height="600"/>
                                {[
                                    {fontSize: "9.5", x: 437 - 14, y: 63, text: soldier["personnel_code"]},
                                    {fontSize: "9.5", x: 497, y: 98 - 18, text: soldier["first_name"]},
                                    {fontSize: "9.5", x: 395, y: 98 - 18, text: soldier["last_name"]},
                                    {fontSize: "9.5", x: 302 - 14, y: 98 - 18, text: soldier["father_name"]},
                                    {fontSize: "9.5", x: 475, y: 114 - 18, text: soldier["national_code"]},
                                    {fontSize: "9.5", x: 377 - 14, y: 114 - 18, text: soldier["national_code"]},
                                    {fontSize: "9.5", x: 300 - 14, y: 114 - 18, text: soldier["birthday"]},
                                    {fontSize: "9.5", x: 330 - 14, y: 127 - 18, text: soldier["phone"]},
                                    {fontSize: "9.5", x: 282, y: 179, text: today},
                                    {fontSize: "9.5", x: 562, y: 215, text: soldier["full_name"]},
                                    {fontSize: "9.5", x: 350, y: 240, text: today},
                                    {fontSize: "6.5", x: 495, y: 554, text: sign1},
                                    {fontSize: "6.5", x: 315, y: 554, text: sign2},
                                ].map((item, index) => (
                                    <text
                                        key={index}
                                        x={item.x}
                                        y={item.y}
                                        fill="black"
                                        fontSize={item.fontSize}
                                        font-weight="bold"
                                        textAnchor="left"
                                        alignmentBaseline="middle"
                                    >
                                        {item.text}
                                    </text>
                                ))}
                            </svg>
                        </Flex>
                        <Divider dashed orientation={"left"}>تعیین وضعیت سلامت روان</Divider>
                        <Flex style={{marginTop: "10px"}} vertical={true} align={"center"}>
                            <Image preview={false} src={padafandLogo} width={50}/>
                            <Typography.Text style={{marginTop: "5px", fontSize: "10px"}}>
                                قرارگاه پدافند هوایی خاتم النبیاء (ص) آجا
                            </Typography.Text>
                            <Typography.Text style={{marginTop: "5px", fontSize: "10px"}}>
                                اداره بهداشت امداد و درمان / معاونت بهداشت - دایره بهداشت روان
                            </Typography.Text>
                        </Flex>
                        <Flex justify={"start"} style={{width: "90%"}}>
                            <Typography.Text strong style={{fontSize: "10px"}}>
                                برگ تعیین وضعیت سلامت روان کارکنان وظیفه
                            </Typography.Text>
                        </Flex>
                        <Flex vertical={true} align={"start"}
                              style={{width: "90%", border: "solid black 1px", padding: "10px"}} gap={"middle"}>
                            <Flex style={{width: "90%"}} gap={"large"} justify={"space-between"}>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    نام و نشان:
                                    {" " + soldier["full_name"] + " "}
                                </Typography.Text>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    نام پدر:
                                    {" " + soldier["father_name"] + " "}
                                </Typography.Text>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    تاریخ تولد:
                                    {" " + soldier["birthday"] + " "}
                                </Typography.Text>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    تاریخ اعزام:
                                    {" " + soldier["deployment_date"] + " "}
                                </Typography.Text>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    تأهل:
                                    {" " + marriage_check() + " "}
                                </Typography.Text>
                            </Flex>
                            <Flex style={{width: "85%"}} gap={"large"} justify={"space-between"}>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    میزان تحصیلات:
                                    {" " + soldier["education"] + " "}
                                </Typography.Text>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    کد دوره:
                                </Typography.Text>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    پایه خدمتی:
                                </Typography.Text>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    محل اجرای آزمون:
                                </Typography.Text>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    تاریخ آزمون:
                                </Typography.Text>
                            </Flex>
                        </Flex>
                        <Flex style={{width: "100%", marginTop: "12px"}} align={"center"} vertical={true} gap={"small"}>

                            <Flex style={{width: "40%"}} justify={"space-between"}>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    نامبرده فوق در گروه:
                                </Typography.Text>
                                <Flex>
                                    <Typography.Text style={{fontSize: "10px"}}>
                                        الف
                                    </Typography.Text>
                                    <BorderOutlined/>
                                </Flex>
                                <Flex>
                                    <Typography.Text style={{fontSize: "10px"}}>
                                        ب
                                    </Typography.Text>
                                    <BorderOutlined/>
                                </Flex>
                                <Typography.Text style={{fontSize: "10px"}}>
                                    طبقه بندی می شود.
                                </Typography.Text>
                            </Flex>

                            <Typography.Text style={{fontSize: "10px"}}>
                                بکارگیری گروه ب بر اساس بند 5 ((دستورات اجرایی)) ((دستورالعمل سنجش و ارزیابی سلامت روانی
                                کارکنان وظیفه )) می باشد.
                            </Typography.Text>
                        </Flex>
                        <Flex justify={"start"} style={{width: "90%"}}>
                            <Typography.Text style={{fontSize: "10px"}}>
                                محدودیت های خدمتی و توصیه ها:
                            </Typography.Text>
                        </Flex>

                        <Flex vertical={"true"} justify={"end"}
                              style={{width: "90%", height: "100%", marginBottom: "40px"}}>
                            <Row style={{width: "100%"}}>
                                <Col flex={3}>
                                    <Typography.Text style={{fontSize: "10px"}}>
                                        تذکر: نتیجه اعلام شده مربوط به وضعیت فعلی فرد می باشد.
                                    </Typography.Text>
                                </Col>
                                <Col flex={1}>
                                    <Typography.Text style={{fontSize: "10px"}}>
                                        نام و امضاء روان شناس
                                    </Typography.Text>
                                </Col>
                                <Col flex={1}>
                                    <Typography.Text style={{fontSize: "10px"}}>
                                        مهر بهداشت و درمان
                                    </Typography.Text>
                                </Col>
                            </Row>
                            <Row style={{width: "100%"}}>
                                <Col>
                                    <Typography.Text style={{fontSize: "10px"}}>
                                        اطلاعات مندرج در این برگه محرمانه بوده و فقط باید در اختیار افراد مسئول قرار
                                        گیرد.
                                    </Typography.Text>
                                </Col>
                            </Row>

                        </Flex>

                    </Flex>

                </Flex>

            </ConfigProvider>
        </div>
    );

}

export default Admission;