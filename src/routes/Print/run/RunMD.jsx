import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Card, ConfigProvider, Flex, notification, Table, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import {GetNumberLabel} from "../../../utils/Data.js";
import Sign from "../../../components/printElement/Sign.jsx";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";

function RunMD({setPrintTitle, soldierKey, runIndex, forceRefresh}) {

    const [soldier, setSoldier] = useState({
        "target_run": {
            "absence_date": "",
            "run_date": "",
            "run_letter_number": "",
            "run_letter_sender": "",
            "run_count": 1
        }
    });
    const [api, contextHolder] = notification.useNotification();
    const [readyForPrint, setReadyForPrint] = useState(false);
    const printComponent = useRef(null);

    useEffect(() => {
        setPrintTitle("ماده دستور فرار");
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

    return (
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
                                      gap={"large"}
                                >
                                    <Flex align={"center"}>
                                        <Flex align={"flex-end"} gap={120}>
                                            <Typography.Title level={3} style={{height: "100%"}}>
                                                ماده
                                            </Typography.Title>
                                            <Typography.Title level={3} style={{height: "100%"}}>
                                                دستور
                                            </Typography.Title>
                                        </Flex>
                                    </Flex>

                                    <Flex vertical={true} style={{width: "90%"}} gap={"middle"}>
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
                                            <Typography.Text strong>
                                                {" " + soldier["deployment_date"] + " "}
                                            </Typography.Text>
                                            از تاریخ
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
                                            غیبت متوالی از خدمت فراری گردیده که به همین منظور کلیه حقوق و مزایای نامبردی
                                            قطع میگردد.
                                        </Typography.Text>

                                        <Typography.Text>
                                            مدرک:
                                            &nbsp;
                                            <Typography.Text strong>
                                                &rlm;
                                                {soldier["target_run"]["run_letter_number"]}
                                            </Typography.Text>
                                            <Typography.Text strong>
                                                &rlm;
                                                {" - " + DateRenderer(soldier["target_run"]["run_letter_date"])}
                                            </Typography.Text>
                                        </Typography.Text>
                                        <Typography.Text>
                                            صادره از:
                                            &nbsp;
                                            <Typography.Text strong>
                                                {soldier["target_run"]["run_letter_sender"]}
                                            </Typography.Text>
                                        </Typography.Text>
                                        <Typography.Text>
                                            مرحله فرار:
                                            &nbsp;
                                            <Typography.Text strong>
                                                {GetNumberLabel(soldier["target_run"]["run_count"])}
                                            </Typography.Text>
                                        </Typography.Text>
                                    </Flex>

                                    <Flex style={{width: "90%", height: "100%", marginBottom: "100px"}} align={"end"}>
                                        <Sign.MultiInline fontSize={13} singGap={70} defaultSign={[
                                            "مدیریت نیروی انسانی ف پش نپاجا",
                                            "رئیس دایره وظیفه های ف پش نپاجا",
                                            "رئیس شعبه دستور ف پش نپاجا",
                                        ]}
                                        />
                                    </Flex>

                                </Flex>
                            );
                        })
                    }
                    <Flex vertical={true} align={"center"}
                          style={{
                              border: "solid gray 2px",
                              borderRadius: "10px",
                              background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                          }}
                          className={"break-after A5-portrait"}
                          gap={"large"}
                    >
                        <Flex style={{width: "90%", marginTop: "30px"}}>
                            <Typography.Title level={5}>
                                بسمه تعالی
                            </Typography.Title>
                        </Flex>

                        <Flex style={{width: "90%"}} vertical={true} align={"center"}>
                            <Typography.Title level={5}>
                                طرح بازگشت به سنگر
                            </Typography.Title>
                            <Typography.Title level={5}>
                                مشخصات سرباز فراری
                            </Typography.Title>
                        </Flex>

                        <Flex style={{width: "90%"}}>
                            <Table
                                size={"small"}
                                pagination={false}
                                bordered={true}
                                dataSource={[soldier]}
                                locale={{
                                    emptyText: <span
                                        style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>, // Custom text for "No Data" view
                                }}
                                columns={[
                                    {
                                        title: "درجه",
                                        dataIndex: "military_rank",
                                        align: "center",
                                    },
                                    {
                                        title: "نام",
                                        dataIndex: "first_name",
                                        align: "center",
                                    },
                                    {
                                        title: "نشان",
                                        dataIndex: "last_name",
                                        align: "center",
                                    },
                                    {
                                        title: "کد ملی",
                                        dataIndex: "national_code",
                                        align: "center",
                                    },
                                    {
                                        title: "تاریخ اعزام",
                                        dataIndex: "deployment_date",
                                        align: "center",
                                    },
                                    {
                                        title: "تلفن",
                                        dataIndex: "phone",
                                        align: "center",
                                    },
                                ]}
                                style={{width: "100%"}}
                            />
                        </Flex>

                        <Flex style={{width: "90%"}}>
                            <Typography.Text>
                                توضیحات:
                            </Typography.Text>
                            <Typography.Text>
                                با نامبرده در تاریخ
                                &emsp;
                                &emsp;
                                &emsp;
                                &emsp;
                                &emsp;
                                تماس گرفته شد که نامبرده
                            </Typography.Text>
                        </Flex>


                        <Flex vertical={true} style={{width: "90%", height: "100%", marginBottom: "50px"}} align={"end"}
                              justify={"end"}>


                            <Card
                                bordered={true}
                                title={<Flex justify={"center"}>پیگیری کننده</Flex>}
                            >
                                <Flex style={{height: "100px"}}>
                                    <Sign.Single fontSize={14} defaultSign={
                                        "رئیس دایره وظیفه های ف پش نپاجا"
                                    }
                                    />
                                </Flex>
                            </Card>


                        </Flex>
                    </Flex>
                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default RunMD;