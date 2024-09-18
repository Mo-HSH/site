import {Button, Divider, Flex, Form, Input, notification, Select, Table, Tooltip, Typography} from "antd";
import {dateValidator} from "../../utils/Validates.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer, NativeRenderer} from "../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";

function ReleaseReport() {

    const [unitSelectOptions, setUnitSelectOptions] = useState([]);
    const [soldiers, setSoldiers] = useState([]);

    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);

    useEffect(() => {
        invoke("get_config", {configName: "unit"})
            .then((res) => {
                setUnitSelectOptions(res.config.map(v => {
                    return {
                        label: v.name,
                        value: v.name
                    }
                }))
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا",
                    description: "خطا در دریافت اطلاعات."
                });
            });
    }, [])

    function onFinish(value) {
        const fromDate = GetQueryDate(value["from_date"]);
        const toDate = GetQueryDate(value["to_date"]);
        const unit = value["unit"];

        let filter = {
            "legal_release_date": {
                "$lte": toDate,
                "$gte": fromDate
            },
            "status": {
                "$in": ["حاضر", "فرار"]
            }
        }

        if (unit.length > 0) {
            filter["unit"] = {
                "$in": unit
            }
        }

        invoke("get_soldiers", {
            "query": {
                "filter": filter,
                "projection": {
                    "first_name": 1,
                    "last_name": 1,
                    "national_code": 1,
                    "father_name": 1,
                    "unit": 1,
                    "section": 1,
                    "status": 1,
                    "is_native": 1,
                    "absence_discharge": 1,
                    "extra_annual_leave": 1,
                    "extra_medical_leave": 1,
                    "run_discharge": 1,
                    "run_punish": 1,
                    "arrest_punish": 1,
                    "additional_service_day": 1,
                    "deployment_date": 1,
                    "legal_release_date": 1,
                    "overall_release_date": 1,
                }
            }
        })
            .then((res) => {
                const transformedData = res.flatMap((soldier, index) => {
                    return ({
                        rowIndex: index+1,
                        first_name: soldier.first_name,
                        last_name: soldier.last_name,
                        national_code: soldier.national_code,
                        father_name: soldier.father_name,
                        unit: soldier.unit,
                        section: soldier.section,
                        status: soldier.status,
                        is_native: NativeRenderer(soldier.is_native),
                        absence_discharge: soldier.absence_discharge,
                        extra_annual_leave: soldier.extra_annual_leave,
                        extra_medical_leave: soldier.extra_medical_leave,
                        run_discharge: soldier.run_discharge,
                        run_punish: soldier.run_punish,
                        arrest_punish: soldier.arrest_punish,
                        additional_service_day: soldier.additional_service_day,
                        deployment_date: DateRenderer(soldier.deployment_date),
                        legal_release_date: DateRenderer(soldier.legal_release_date),
                        overall_release_date: DateRenderer(soldier.overall_release_date),
                    });
                });
                setSoldiers(transformedData);
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err
                });
            });
    }

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    return (
        <Flex vertical={true} style={{width: "100%"}}>
            {contextHolder}
            <Flex justify={"center"}>
                <Typography.Title level={3}>
                    گزارش ترخیص
                </Typography.Title>
            </Flex>
            <Divider/>
            <Flex style={{marginBottom: "20px"}}>
                <Form
                    layout={"inline"}
                    onFinish={onFinish}
                >
                    <Tooltip title={"از تاریخ ترخیص قانونی"}>
                    <Form.Item
                        label={"از تاریخ"}
                        name={"from_date"}
                        rules={[{
                            validator: dateValidator, required: true,
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    </Tooltip>
                    <Tooltip title={"تا تاریخ ترخیص قانونی"}>
                    <Form.Item
                        label={"تا تاریخ"}
                        name={"to_date"}
                        rules={[{
                            validator: dateValidator, required: true,
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    </Tooltip>
                    <Form.Item
                        label={"یگان"}
                        name={"unit"}
                        rules={[{
                            required: false,
                        }]}
                        initialValue={[]}
                    >
                        <Select allowClear={true} mode={"multiple"} options={unitSelectOptions}
                                style={{minWidth: "300px"}}/>
                    </Form.Item>

                    <Form.Item>
                        <Button block={true} type={"primary"} htmlType="submit">جستجو</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button block={true} type={"primary"} onClick={handlePrint}>پرینت</Button>
                    </Form.Item>
                </Form>
            </Flex>
            <Flex
                ref={printComponent}
                style={{width: "100%"}}
            >
                <style>
                    {`
                            @media print {
                              @page {
                                size: landscape;
                              }
                            }
                            thead {
                                display: table-header-group;
                            }
                            tfoot {
                                display: table-footer-group;
                            }
                            table {
                                page-break-inside: auto;
                            }
                            tr {
                                page-break-inside: avoid;
                                page-break-after: auto;
                            }
                        `}
                </style>
                <Table
                    style={{width: "100%"}}
                    dataSource={soldiers}
                    bordered={true}
                    size={"small"}
                    pagination={false}
                    columns={[
                        {
                            title: 'ردیف',
                            dataIndex: "rowIndex",
                            key: 'rowIndex',
                        },
                        {
                            title: "نام",
                            dataIndex: "first_name",
                        },
                        {
                            title: "نشان",
                            dataIndex: "last_name",
                        },
                        {
                            title: "کد ملی",
                            dataIndex: "national_code",
                        },
                        {
                            title: "نام پدر",
                            dataIndex: "father_name",
                        },
                        {
                            title: "وضعیت",
                            dataIndex: "status",
                        },
                        {
                            title: "سکونت",
                            dataIndex: "is_native",
                        },
                        {
                            title: "انفصال نهست",
                            dataIndex: "absence_discharge",
                        },
                        {
                            title: "اضافه سالیانه",
                            dataIndex: "extra_annual_leave",
                        },
                        {
                            title: "اضافه استعلاجی",
                            dataIndex: "extra_medical_leave",
                        },
                        {
                            title: "انفصال فرار",
                            dataIndex: "run_discharge",
                        },
                        {
                            title: "تنبیهی فرار",
                            dataIndex: "run_punish",
                        },
                        {
                            title: "بازداشت",
                            dataIndex: "arrest_punish",
                        },
                        {
                            title: "سنواتی",
                            dataIndex: "additional_service_day",
                        },
                        {
                            title: "اعزام",
                            dataIndex: "deployment_date",
                        },
                        {
                            title: "ترخیص قانونی",
                            dataIndex: "legal_release_date",
                        },
                        {
                            title: "ترخیص کل",
                            dataIndex: "overall_release_date",
                        },
                    ].map(v => {
                        v["align"] = "center";
                        return v;
                    })}
                />
            </Flex>
        </Flex>
    );
}

export default ReleaseReport;