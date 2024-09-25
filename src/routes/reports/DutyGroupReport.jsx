import {Button, Divider, Flex, Form, Input, notification, Select, Table, Tooltip, Typography} from "antd";
import {dateValidator} from "../../utils/Validates.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer, DutyGroupRenderer} from "../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import {getApiUrl} from "../../utils/Config.js";
import axios from "axios";

function DutyGroupReport() {

    const [unitSelectOptions, setUnitSelectOptions] = useState([]);
    const [soldiers, setSoldiers] = useState([]);

    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);
    const [form] = Form.useForm();

    const dutyGroup = Form.useWatch('duty_group', form);

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
        const dutyGroup = value["duty_group"];

        let filter = {
            "duty_group_data": {
                "$elemMatch": {
                    "submit_date": {
                        "$lte": toDate,
                        "$gte": fromDate
                    },
                    "is_in_combat_group": dutyGroup
                }
            }
        }

        console.log(filter);

        if (unit.length > 0) {
            filter["unit"] = {
                "$in": unit
            }
        }

        let projection = {
            "first_name": 1,
            "last_name": 1,
            "national_code": 1,
            "father_name": 1,
            "deployment_date": 1,
            "unit": 1,
            "section": 1,
            "duty_group_data": {
                "$filter": {
                    "input": "$duty_group_data",
                    "as": "dutyGroupItem",
                    "cond": {
                        "$and": [
                            {"$lte": ["$$dutyGroupItem.submit_date", toDate]},
                            {"$gte": ["$$dutyGroupItem.submit_date", fromDate]},
                            {"$eq": ["$$dutyGroupItem.is_in_combat_group", dutyGroup]}
                        ]
                    }
                }
            }
        };

        axios.post(getApiUrl("soldier/list"), {
            "filter": filter,
            "projection": projection
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                console.log("res:", res);
                let rowIndexCounter = 1;

                const transformedData = res.flatMap(soldier => {
                    return soldier.duty_group_data.map((dutyGroup, index) => ({
                        rowIndex: index === 0 ? rowIndexCounter++ : null,
                        first_name: soldier.first_name,
                        last_name: soldier.last_name,
                        national_code: soldier.national_code,
                        father_name: soldier.father_name,
                        unit: soldier.unit,
                        section: soldier.section,
                        deployment_date: DateRenderer(soldier.deployment_date),
                        duty_group_submit_date: DateRenderer(dutyGroup.submit_date),
                        duty_group: DutyGroupRenderer(dutyGroup.is_in_combat_group),
                    }));
                });
                console.log("transformedData:", transformedData);
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
                    گزارش گروه خدمتی
                </Typography.Title>
            </Flex>
            <Divider/>
            <Flex style={{marginBottom: "20px"}}>
                <Form
                    layout={"inline"}
                    onFinish={onFinish}
                    form={form}
                >
                    <Tooltip title={"از تاریخ کسر یا اضافه"}>
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
                    <Tooltip title={"تا تاریخ کسر یا اضافه"}>
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

                    <Form.Item
                        label={"گروه خدمتی"}
                        name={"duty_group"}
                        rules={[{
                            required: true,
                        }]}
                        initialValue={true}
                    >
                        <Select allowClear={true}
                                options={[{label: "رزمی", value: true}, {label: "غیر رزمی", value: false}]}
                                style={{minWidth: "100px"}}/>
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
                            title: dutyGroup ? "تاریخ اضافه" : "تاریخ کسر",
                            dataIndex: "duty_group_submit_date",
                        },
                        {
                            title: "گروه خدمتی",
                            dataIndex: "duty_group",
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

export default DutyGroupReport;