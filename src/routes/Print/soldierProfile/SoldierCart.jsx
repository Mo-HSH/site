import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Image, Input, notification, Row, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";


function SoldierCart({setPrintTitle, soldierKey}) {

    const [soldier, setSoldier] = useState({});
    const printComponent = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const [today, setToday] = useState("");
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [input, setInput] = useState({});

    useEffect(() => {
        setPrintTitle("کارت سرباز");

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
                        "organizational_job": 1,
                        "section": 1
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
                    console.log(res[0])
                    setSoldier({
                        ...res[0],
                        "job_title": res[0].organizational_job[0].job_title,
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
                      style={{width: "100%", zIndex: 2, marginBottom: "20px", paddingTop: "20px"}}>
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
                        <Flex vertical={true}
                              style={{
                                  border: "solid gray 2px",
                                  borderRadius: "10px",
                                  background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`,
                                  width: "10cm",
                                  height: "7cm",
                              }}
                              className={"break-after A5-landscape"}
                        >
                            <Flex vertical={true} style={{padding: "2px 15px"}} align={"flex-start"}>
                                <Flex vertical={"true"} style={{width: "100%", textAlign: "center", marginBottom: "8px"}}>
                                    <Typography.Text style={{fontSize: "12px"}} strong={true}>کارت شناسایی کارکنان وظیفه ی فرماندهی پشتیبانی مرکز نپاجا</Typography.Text>
                                </Flex>
                                <Flex justify={"space-between"} style={{width: "100%"}}>

                                    <Flex style={{width: "70%"}}>
                                        <Flex vertical={true} style={{width: "70%"}} gap={7}>
                                            <Flex gap={2}>
                                                <Typography.Text>درجه:</Typography.Text>
                                                <Typography.Text strong={true}>
                                                    {soldier["military_rank"]}
                                                </Typography.Text>
                                            </Flex>
                                            <Flex gap={2}>
                                                <Typography.Text>نام:</Typography.Text>
                                                <Typography.Text strong={true}>
                                                    {soldier["first_name"]}
                                                </Typography.Text>
                                            </Flex>
                                            <Flex gap={2}>
                                                <Typography.Text>نشان:</Typography.Text>
                                                <Typography.Text strong={true}>
                                                    {soldier["last_name"]}
                                                </Typography.Text>
                                            </Flex>
                                            <Flex gap={2}>
                                                <Typography.Text>کد ملی:</Typography.Text>
                                                <Typography.Text strong={true}>
                                                    {soldier["national_code"]}
                                                </Typography.Text>
                                            </Flex>
                                            <Flex gap={2}>
                                                <Typography.Text>اعزامی:</Typography.Text>
                                                <Typography.Text strong={true}>
                                                    {soldier["deployment_date"]}
                                                </Typography.Text>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                    <Flex style={{width: "30%"}}>
                                        <Image preview={false} shape="square" width={115}
                                               src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                               style={{border: "solid black 2px", borderRadius: "5px", width: "100%"}}/>
                                    </Flex>
                                </Flex>
                                <Flex vertical={true} style={{width: "100%"}}>
                                    <Flex gap={2}>
                                        <Typography.Text>یگان خدمتی:</Typography.Text>
                                        <Typography.Text strong={true}>
                                            {soldier["section"]}
                                        </Typography.Text>
                                    </Flex>
                                    <Flex gap={2} style={{marginBottom: "5px"}}>
                                        <Typography.Text style={{fontSize: "10px"}}>شغل سازمانی:</Typography.Text>
                                        <Typography.Text strong={true} style={{fontSize: "10px"}}>
                                            {soldier["job_title"]}
                                        </Typography.Text>
                                    </Flex>
                                    <Flex vertical={true} style={{textAlign: "left", fontWeight: "700"}}>
                                        {/*<Typography.Text style={{fontSize: "12px"}}>مدیریت نیروی انسانی ف پش نیرو پدافند هوایی آجا</Typography.Text>*/}
                                        {/*<Typography.Text style={{fontSize: "12px"}}>سرهنگ امیرعلی کریمی</Typography.Text>*/}
                                        <Sign.Single
                                            defaultSign={"مدیر نیروی انسانی ف پش نپاجا"}
                                            fontSize={11}
                                        />
                                    </Flex>
                                </Flex>

                            </Flex>
                        </Flex>
                    }

                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default SoldierCart;