import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Image, Input, notification, Row, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";


function EmploymentCertificate({setPrintTitle, soldierKey}) {

    const [soldier, setSoldier] = useState({});
    const printComponent = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const [today, setToday] = useState("");
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [input, setInput] = useState({});

    useEffect(() => {
        setPrintTitle("گواهی اشتغال");

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
                        "profile": 1,
                        "folder_number": 1,
                        "first_name": 1,
                        "last_name": 1,
                        "father_name": 1,
                        "military_rank": 1,
                        "deployment_date": 1,
                        "national_code": 1,
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
                            label={"شماره نامه"}
                            name={"letter_no"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"به"}
                            name={"to"}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={"علت"}
                            name={"reason"}
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
                                size: portrait;
                              }
                            }
                        `}
                    </style>
                    {
                        [...Array(2)].map((_, index) => {
                            return (
                                <Flex vertical={true} align={"center"}
                                      style={{
                                          border: "solid gray 2px",
                                          borderRadius: "10px",
                                          background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                      }}
                                      className={"break-after A5-portrait"}
                                >
                                    <Flex style={{width: "100%"}} justify={"center"}>
                                        <Row style={{width: "90%", marginTop: "20px"}}>
                                            <Col span={8}>
                                                <Typography.Text strong={true}>بسمه تعالی</Typography.Text>
                                            </Col>
                                            <Col span={8}>
                                                <Flex style={{width: "100%"}} justify={"center"} align={"center"}>
                                                    <Image preview={false} src={padafandLogo} width={70}/>
                                                </Flex>
                                            </Col>
                                            <Col span={8} style={{height: "100%"}}>
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
                                                        {
                                                            index === 1
                                                                ?
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
                                                                :
                                                                null
                                                        }
                                                        <Row>
                                                            <Col flex={1}>
                                                                <Typography.Text>شماره نامه:</Typography.Text>
                                                            </Col>
                                                            <Col flex={1}>
                                                                <Flex style={{width: "100%", height: "100%"}}
                                                                      justify={"end"} align={"end"}>
                                                                    <Typography.Text>
                                                                        {input["letter_no"]}
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
                                    </Flex>
                                    <Flex style={{width: "100%"}} justify={"center"}>
                                        <Row style={{width: "90%", marginTop: "50px"}}>
                                            <Col span={5}></Col>
                                            <Col span={14}>
                                                <Flex vertical={true} align={"center"} justify={"center"}
                                                      gap={"middle"} style={{height: "100%"}}>
                                                    <ConfigProvider
                                                        theme={{
                                                            components: {
                                                                Typography: {
                                                                    fontSize: 17
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Typography.Text strong={true}>فرماندهی نیروی پدافند هوایی
                                                            آجا</Typography.Text>
                                                        <Typography.Text strong={true}>معاونت نیروی
                                                            انسانی</Typography.Text>
                                                        <Typography.Text strong={true}>گواهی اشتغال به
                                                            خدمت</Typography.Text>
                                                    </ConfigProvider>
                                                </Flex>
                                            </Col>
                                            <Col span={5} style={{height: "100%"}}>
                                                <Flex vertical={true} style={{width: "100%", height: "100%"}}
                                                      justify={"center"} align={"end"}>
                                                    <Image preview={false} shape="square" width={115}
                                                           src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                                           style={{border: "solid black 2px", borderRadius: "5px"}}/>
                                                </Flex>
                                            </Col>
                                        </Row>
                                    </Flex>
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Typography: {
                                                    fontSize: 15
                                                }
                                            }
                                        }}
                                    >
                                        <Flex style={{width: "90%", marginTop: "20px"}}>
                                            <Typography.Text strong={true}>گواهی می شود</Typography.Text>
                                        </Flex>
                                        <Flex style={{width: "90%", marginTop: "10px"}}>
                                            <Typography.Text style={{textAlign: "justify"}}>
                                                {[...Array(20)].map((elementInArray, index) => (
                                                        <>&nbsp;</>
                                                    )
                                                )}
                                                <Typography.Text strong={true}>
                                                    {soldier["military_rank"]}
                                                </Typography.Text>
                                                &nbsp;
                                                وظیفه
                                                &nbsp;
                                                <Typography.Text strong={true}>
                                                    {soldier["first_name"]}
                                                    &nbsp;
                                                    {soldier["last_name"]}
                                                </Typography.Text>
                                                &nbsp;
                                                فرزند
                                                &nbsp;
                                                <Typography.Text strong={true}>
                                                    {soldier["father_name"]}
                                                </Typography.Text>
                                                &nbsp;
                                                به شماره ملی
                                                &nbsp;
                                                <Typography.Text strong={true}>
                                                    {soldier["national_code"]}
                                                </Typography.Text>
                                                &nbsp;
                                                اعزامی
                                                &nbsp;
                                                <Typography.Text strong={true}>
                                                    {soldier["deployment_date"]}
                                                </Typography.Text>
                                                &nbsp;
                                                در این یگان مشغول انجام وظیفه می باشد. این گواهی بنا به درخواست مشارالیه
                                                صرفاً به منظور ارائه به
                                                &nbsp;
                                                <Typography.Text strong={true}>
                                                    {input["to"]}
                                                </Typography.Text>
                                                &nbsp;
                                                جهت
                                                &nbsp;
                                                <Typography.Text strong={true}>
                                                    {input["reason"]}
                                                </Typography.Text>
                                                &nbsp;
                                                صادر گردیده و در سایر موارد از درجه اعتبار ساقط می باشد.
                                            </Typography.Text>
                                        </Flex>
                                    </ConfigProvider>
                                    <Flex justify={"flex-end"} align={"center"}
                                          style={{width: "90%", height: "100%", marginTop: "60px"}}>
                                        <Sign.Single
                                            defaultSign={"مدیریت نیروی انسانی ف پش نیروی پدافند هوایی آجا"}
                                            fontSize={12}
                                        />
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

export default EmploymentCertificate;