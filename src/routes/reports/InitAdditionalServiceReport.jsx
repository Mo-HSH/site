import {Button, Divider, Flex, Form, Input, notification, Select, Table, Tooltip, Typography} from "antd";
import {dateValidator} from "../../utils/Validates.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer} from "../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function InitAdditionalServiceReport() {

    const [unitSelectOptions, setUnitSelectOptions] = useState([]);
    const [soldiers, setSoldiers] = useState([]);

    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);

    useEffect(() => {
        axios.get(getApiUrl("config/unit"), {withCredentials: true}).then((res) => {
            setUnitSelectOptions(res.data.config.map(v => {
                return {
                    label: v.name,
                    value: v.name
                }
            }))
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تنظیمات یگان!"
            });
        });
    }, [])

    function onFinish(value) {
        const fromDate = GetQueryDate(value["from_date"]);
        const toDate = GetQueryDate(value["to_date"]);
        const unit = value["unit"];
        console.log(value);

        let filter = {
            "deployment_date": {
                "$lte": toDate,
                "$gte": fromDate
            },
            "status": {
                "$in": ["حاضر", "فرار"]
            },
            "additional_service_day": {
                "$gte": 1
            }
        }

        if (unit.length > 0) {
            filter["unit"] = {
                "$in": unit
            }
        }

        axios.post(getApiUrl("soldier/list"), {
            "query": {
                "filter": filter,
                "projection": {
                    "first_name": 1,
                    "last_name": 1,
                    "national_code": 1,
                    "father_name": 1,
                    "deployment_date": 1,
                    "unit": 1,
                    "section": 1,
                    "additional_service_day": 1,
                }
            }
        })
            .then((response) => {
                let res = response.data;
                console.log(res);
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
                        additional_service_day: soldier.additional_service_day,
                        deployment_date: DateRenderer(soldier.deployment_date),
                    });
                });
                setSoldiers(transformedData);
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
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
                    گزارش اضافه سنواتی
                </Typography.Title>
            </Flex>
            <Divider/>
            <Flex style={{marginBottom: "20px"}}>
                <Form
                    layout={"inline"}
                    onFinish={onFinish}
                >
                    <Tooltip title={"از تاریخ اعزام"}>
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
                    <Tooltip title={"تا تاریخ اعزام"}>
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
                                size: portrait;
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
                            onCell: (record) => ({
                                rowSpan: record.rowSpan,
                            }),
                        },
                        {
                            title: "نام",
                            dataIndex: "first_name",
                            onCell: (record) => ({
                                rowSpan: record.rowSpan,
                            }),
                        },
                        {
                            title: "نشان",
                            dataIndex: "last_name",
                            onCell: (record) => ({
                                rowSpan: record.rowSpan,
                            })
                        },
                        {
                            title: "کد ملی",
                            dataIndex: "national_code",
                            onCell: (record) => ({
                                rowSpan: record.rowSpan,
                            })
                        },
                        {
                            title: "نام پدر",
                            dataIndex: "father_name",
                            onCell: (record) => ({
                                rowSpan: record.rowSpan,
                            })
                        },
                        {
                            title: "اعزام",
                            dataIndex: "deployment_date",
                            onCell: (record) => ({
                                rowSpan: record.rowSpan,
                            })
                        },
                        {
                            title: "اضافه سنواتی",
                            dataIndex: "additional_service_day",
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

export default InitAdditionalServiceReport;