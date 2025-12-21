import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Image, Input, notification, Row, Table, Typography} from "antd";
import {DateRenderer, MarriageRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";


function AccidentComission({setPrintTitle, soldierKey}) {

    const [soldier, setSoldier] = useState({});
    const printComponent = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const [today, setToday] = useState("");
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [input, setInput] = useState({});
    const [signs, setSigns] = useState([]);

    useEffect(() => {
        setPrintTitle("صورت جلسه سانحه");

        axios.get(getApiUrl("config/signs"), {withCredentials: true}).then((res) => {
            let temp = [];
            res.data.config.forEach(({key, value}) => {
                if ([
                    "مدیر نیروی انسانی ف پش نپاجا",
                    "رئیس بازرسی ف پشتیبانی نپاجا",
                    "نماینده اداره بهداشت و امداد و درمان نپاجا",
                    "نماینده عقیدتی سیاسی ف پشتیبانی نپاجا",
                    "نماینده حفاظت اطلاعات ف پشتیبانی نپاجا",
                    "رئیس دایره قضایی ف پشتیبانی نپاجا",
                    "نماینده یگان"
                ].includes(key)) {
                    temp.push({key: key, value: value})
                }
            })
            setSigns(temp);
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تنظیمات امضا!"
            });
        });

        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setToday(DateRenderer({"$date": {"$numberLong": res.data}}));
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
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
                        "first_name": 1,
                        "last_name": 1,
                        "father_name": 1,
                        "military_rank": 1,
                        "deployment_date": 1,
                        "national_code": 1,
                        "entry_date": 1,
                        "personnel_code": 1,
                        "family": 1,
                        "status": 1,
                        "unit": 1,
                        "birthplace": 1,
                        "birth_certificate_issuing_place": 1,
                        "birthday": 1,
                        "state": 1,
                        "city": 1,
                        "address_house_number": 1,
                        "address_home_unit": 1,
                        "address_street": 1,
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
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        "entry_date": DateRenderer(res[0]["entry_date"]),
                        "birthday": DateRenderer(res[0]["birthday"]),
                        "marriage_status": MarriageRenderer(res[0]["family"])
                    });

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data
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

    const data = [
        {
            1: <>
                <div style={{fontWeight: "bold"}}>
                1- نام خانوادگی:<br/>
                </div>
                {soldier["last_name"]}
            </>,
            2: <>
                <div style={{fontWeight: "bold"}}>
                2- نام:<br/>
                </div>
                {soldier["first_name"]}
            </>,
            3: <>
                <div style={{fontWeight: "bold"}}>
                3- شماره پرسنلی:<br/>
                </div>
                {soldier["personnel_code"]}
            </>,
            4: <>
                <div style={{fontWeight: "bold"}}>
                4- درجه:<br/>
                </div>
                {soldier["military_rank"]}
            </>,
            5: <>
                <div style={{fontWeight: "bold"}}>
                5- تاریخ تشکیل کمیسیون:<br/>
                </div>
                {input["comission_date"]}
            </>,
            6: <>
                <div style={{fontWeight: "bold"}}>
                6- تاریخ آخرین ترفیع قبل از سانحه:<br/>
                </div>
                {input["last_rankup_date"]}
            </>,
        },
        {
            1: <>
                <div style={{fontWeight: "bold"}}>
                7- رسته:<br/>
                </div>
                {input["military_guild"]}
            </>,
            2: <>
                <div style={{fontWeight: "bold"}}>
                8- تاریخ تولد:<br/>
                </div>
                {soldier["birthday"]}
            </>,
            3: <>
                <div style={{fontWeight: "bold"}}>
                9- محل تولد:<br/>
                </div>
                {soldier["birthplace"]}
            </>,
            4: <>
                <div style={{fontWeight: "bold"}}>
                10- کد ملی:<br/>
                </div>
                {soldier["national_code"]}
            </>,
            5: <>
                <div style={{fontWeight: "bold"}}>
                11- محل صدور:<br/>
                </div>
                {soldier["birth_certificate_issuing_place"]}
            </>,
            6: <>
                <div style={{fontWeight: "bold"}}>
                12- نام پدر:<br/>
                </div>
                {soldier["father_name"]}
            </>,
            7: <>
                <div style={{fontWeight: "bold"}}>
                13- جنسیت:<br/>
                </div>
                مرد
            </>,
        },
        {
            1: <>
                <div style={{fontWeight: "bold"}}>
                14- وضعیت تاهل:<br/>
                </div>
                {soldier["marriage_status"]}
            </>,
            2: <>
                <div style={{fontWeight: "bold"}}>
                15- نوع خدمت:<br/>
                </div>
                وظیفه
            </>,
            3: <>
                <div style={{fontWeight: "bold"}}>
                16- تاریخ ورود:<br/>
                </div>
                {soldier["entry_date"]}
            </>,
            4: <>
                <div style={{fontWeight: "bold"}}>
                17- تاریخ اعزام:<br/>
                </div>
                {soldier["deployment_date"]}
            </>,
            5: <>
                <div style={{fontWeight: "bold"}}>
                18- یگان:<br/>
                </div>
                {soldier["unit"]}
            </>
        },
        {
            1: <>
                <div style={{fontWeight: "bold"}}>
                19- وضعیت خدمتی:<br/>
                </div>
                {soldier["status"]}
            </>,
            2: <>
                <div style={{fontWeight: "bold"}}>
                20- آدرس محل سکونت دائم:<br/>
                </div>
                {[soldier["state"], soldier["city"], soldier["address_street"], "(پ)", soldier["address_house_number"], "(طبقه/واحد)", soldier["address_home_unit"]].join(" - ")}
            </>,
        },
        {
            1: <>
                <div style={{fontWeight: "bold"}}>
                21- تاریخ سانحه:<br/>
                </div>
                {input["accident_date"]}
            </>,
            2: <>
                <div style={{fontWeight: "bold"}}>
                22- علت سانحه:<br/>
                </div>
                {input["accident_reason"]}
            </>,
            3: <>
                <div style={{fontWeight: "bold"}}>
                23- محل سانحه:<br/>
                </div>
                {input["accident_location"]}
            </>,
        },
        {
            1: <>
                <div style={{fontWeight: "bold"}}>
                24- شرح واقعه بطور مشروح:<br/>
                </div>
                <div style={{textAlign: "justify"}}>
                    {input["accident_description"]}
                </div>
            </>,
        },
        {
            1: <>
                <div style={{fontWeight: "bold"}}>
                25- امضا کنندگان صورت جلسه سانحه
                </div>
            </>,
        },
        {
            1: <div style={{fontWeight: "bold", textAlign: "center"}}>
                ردیف
                </div>,
            2: <div style={{fontWeight: "bold", textAlign: "center"}}>
                عنوان
            </div>,
            3: <div style={{fontWeight: "bold", textAlign: "center"}}>
                درجه نام و نشان
            </div>,
            4: <div style={{fontWeight: "bold", textAlign: "center"}}>
                امضا
            </div>,
        },
        ...signs.map((data, index) => {
            return ({
                1: <div style={{fontWeight: "bold", textAlign: "center"}}>
                    {index + 1}
                </div>,
                2: <div style={{fontWeight: "bold", textAlign: "center"}}>
                    {data.key}
                </div>,
                3: <div style={{fontWeight: "bold", textAlign: "center"}}>
                    {data.value}
                </div>,
            })
        })
    ]

    useEffect(() => {
        console.log(signs);
    }, [signs]);

    const columns = [...Array(8)].map((v, index) => {
        return ({
            dataIndex: index + 1,
            onCell: (data, i) => {
                const colSpanStyle = [
                    [2, 1, 1, 1, 1, 2, 0, 0],
                    [2, 1, 1, 1, 1, 1, 1, 0],
                    [2, 1, 1, 2, 2, 0, 0, 0],
                    [4, 4, 0, 0, 0, 0, 0, 0],
                    [2, 2, 4, 0, 0, 0, 0, 0],
                    [8, 0, 0, 0, 0, 0, 0, 0],
                    [8, 0, 0, 0, 0, 0, 0, 0],
                    [1, 4, 1, 2, 0, 0, 0, 0]
                ];
                return {
                    colSpan: i < 7 ? colSpanStyle[i][index] : colSpanStyle[7][index],
                    style: i > 7 ? {height: "70px"} : null
                };
            },
            render: (data) => {
                return (
                    <Typography.Text style={{fontSize: 11}}>
                        {data}
                    </Typography.Text>
                )
            }
        })
    });

    return (
        <div>
            <ConfigProvider

            >
                {contextHolder}
                <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                      style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>
                    <Form
                        layout={"inline"}
                        onValuesChange={(changedValues, allValues) => {
                            setInput(allValues);
                        }}
                    >
                        <Form.Item
                            label={"تاریخ تشکیل کمیسیون"}
                            name={"comission_date"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"تاریخ آخرین ترفیع"}
                            name={"last_rankup_date"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"رسته"}
                            name={"military_guild"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"تاریخ سانحه"}
                            name={"accident_date"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"علت سانحه"}
                            name={"accident_reason"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"محل سانحه"}
                            name={"accident_location"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"شرح واقعه"}
                            name={"accident_description"}
                        >
                            <Input.TextArea/>
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
                                size: portrait;
                              }
                            }
                        `}
                    </style>
                    {
                        [...Array(6)].map((_, index) => {
                            return (
                                <Flex vertical={true} align={"center"}
                                      style={{
                                          background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                      }}
                                      className={"break-after A4-portrait"}
                                >
                                    <Typography.Title level={4} style={{textAlign: "center"}}>
                                        صورت جلسه سانحه
                                    </Typography.Title>
                                    <Typography.Title level={5} style={{textAlign: "center"}}>
                                        نحوه در گذشت، فوت در حین انجام وظیفه، فوت عادی، جانباز، موارد مختلف معلولیت
                                    </Typography.Title>

                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Table: {
                                                    colorBgContainer: "rgba(255,255,255,0)"
                                                }
                                            }
                                        }}
                                    >
                                        <Table
                                            pagination={false}
                                            bordered={true}
                                            showHeader={false}
                                            size={"small"}
                                            columns={columns}
                                            dataSource={data}
                                            style={{width: "95%", background: "transparent"}}
                                        />
                                    </ConfigProvider>
                                </Flex>
                            );
                        })
                    }

                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default AccidentComission;