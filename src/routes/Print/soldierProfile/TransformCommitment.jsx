import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, ConfigProvider, Flex, Form, Image, Input, notification, Row, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";


function TransformCommitment({setPrintTitle, soldierKey}) {

    const [soldier, setSoldier] = useState({});
    const printComponent = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const [today, setToday] = useState("");
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [input, setInput] = useState({});

    useEffect(() => {
        setPrintTitle("تغییر نشانی");

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
                        <Flex vertical={true} align={"center"}
                              style={{
                                  border: "solid gray 2px",
                                  borderRadius: "10px",
                                  background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`,
                                  padding: "30px"
                              }}
                              className={"break-after A5-landscape"}
                        >
                            <Flex style={{width: "100%", marginBottom: "40px"}} justify={"center"}>
                                <Typography.Text style={{fontSize: "28px"}} strong={true}>بسمه تعالی</Typography.Text>
                            </Flex>
                            <Flex style={{width: "100%", marginBottom: "5px"}}>
                                <Flex>
                                    <Typography.Text>از: </Typography.Text>
                                    <Typography.Text strong={true}>{`${soldier["military_rank"]} و ${soldier["first_name"]} ${soldier["last_name"]}`}</Typography.Text>
                                </Flex>
                            </Flex>
                            <Flex style={{width: "100%", marginBottom: "40px"}}>
                                <Flex>
                                    <Typography.Text>به: </Typography.Text>
                                    <Typography.Text strong={true}>ریاست محترم دایره وظیفه جناب سرگرد مهدی حاجی محمدی</Typography.Text>
                                </Flex>

                            </Flex>
                            <Flex style={{width: "100%", marginBottom: "40px"}}>
                                <Typography.Text style={{textAlign: "justify", lineHeight: "1.7"}}>اینجانب سرباز یاد شده بالا درخواست تغییر نشانی محل سکونت خود در سامانه جامع اطلاعات سرباز را بعلت جا به جایی دارم، از این رو خواهشمند است دستور فرمایید در این خصوص اقدام بایسته به عمل آورند.</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{textAlign: "left", width: "100%", marginBottom: "30px"}}>
                                <Typography.Text>با تقدیم شایسته ترین احترامات نظامی</Typography.Text>
                                <Typography.Text strong={true}>{`${soldier["military_rank"]} و ${soldier["first_name"]} ${soldier["last_name"]}`}</Typography.Text>
                            </Flex>

                            <Flex vertical={true} style={{width: "100%"}}>
                                <Typography.Text>نشانی محل سکونت جدید (به همراه کد پستی الزامی):</Typography.Text>
                            </Flex>
                        </Flex>
                    }

                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default TransformCommitment;