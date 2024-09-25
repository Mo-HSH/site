import {Button, Divider, Flex, Form, Input, notification, Select, Table, Tooltip, Typography} from "antd";
import {dateValidator} from "../../utils/Validates.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer} from "../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function ReturnReport() {

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
        console.log(value)
        const fromDate = GetQueryDate(value["from_date"]);
        const toDate = GetQueryDate(value["to_date"]);
        const unit = value["unit"];

        let filter = {
            "run": {
                "$elemMatch": {
                    "return_date": {
                        "$lte": toDate,
                        "$gte": fromDate
                    }
                }
            }
        }

        if (unit.length > 0) {
            filter["unit"] = {
                "$in": unit
            }
        }

        axios.post(getApiUrl("soldier/list"), {
            "filter": filter,
            "projection": {
                "first_name": 1,
                "last_name": 1,
                "national_code": 1,
                "father_name": 1,
                "deployment_date": 1,
                "unit": 1,
                "section": 1,
                "run": {
                    "$filter": {
                        "input": "$run",
                        "as": "runItem",
                        "cond": {
                            "$and": [
                                {"$lte": ["$$runItem.return_date", toDate]},
                                {"$gte": ["$$runItem.return_date", fromDate]}
                            ]
                        }
                    }
                }
            }
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                let rowIndexCounter = 1;

                const transformedData = res.flatMap(soldier => {
                    return soldier.run.map((run, index) => ({
                        rowIndex: index === 0 ? rowIndexCounter++ : null,
                        first_name: soldier.first_name,
                        last_name: soldier.last_name,
                        national_code: soldier.national_code,
                        father_name: soldier.father_name,
                        unit: soldier.unit,
                        section: soldier.section,
                        deployment_date: DateRenderer(soldier.deployment_date),
                        run_absence_date: DateRenderer(run.absence_date),
                        run_date: DateRenderer(run.run_date),
                        run_return_date: run.return_date ? DateRenderer(run.return_date) : "",
                        run_day_punish: run.return_date ? run.run_punish : "",
                        run_duration: run.return_date ? run.run_duration : "",
                        run_court_order: run.return_date ? run.court_order : "",
                    }));
                });
                const rowSpanData = transformedData.reduce((acc, item, index, array) => {
                    const prevItem = index > 0 ? array[index - 1] : null;
                    if (!prevItem || prevItem.national_code !== item.national_code) {
                        const count = array.filter(el => el.national_code === item.national_code).length;
                        acc.push({...item, rowSpan: count});
                    } else {
                        acc.push({...item, rowSpan: 0});
                    }
                    return acc;
                }, []);
                console.log(rowSpanData);
                setSoldiers(rowSpanData);
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
                    گزارش مراجعت
                </Typography.Title>
            </Flex>
            <Divider/>
            <Flex style={{marginBottom: "20px"}}>
                <Form
                    layout={"inline"}
                    onFinish={onFinish}
                >
                    <Tooltip title={"از تاریخ مراجعت"}>
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
                    <Tooltip title={"تا تاریخ مراجعت"}>
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
                            title: "تاریخ نهست",
                            dataIndex: "run_absence_date",
                        },
                        {
                            title: "تاریخ فرار",
                            dataIndex: "run_date",
                        },
                        {
                            title: "تاریخ مراجعت",
                            dataIndex: "run_return_date",
                        },
                        {
                            title: "حکم قضایی",
                            dataIndex: "run_court_order",
                        },
                        {
                            title: "اضافه تنبیهی",
                            dataIndex: "run_day_punish",
                        },
                        {
                            title: "مدت فرار",
                            dataIndex: "run_duration",
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

export default ReturnReport;