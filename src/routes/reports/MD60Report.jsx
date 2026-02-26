import {Button, Divider, Flex, Form, Input, notification, Select, Table, Tooltip, Typography} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer} from "../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import {getApiUrl} from "../../utils/Config.js";
import axios from "axios";
import * as XLSX from "xlsx"
import {saveAs} from "file-saver";
import {dateValidator} from "../../utils/Validates.js";

function MD60Report() {

    const [unitSelectOptions, setUnitSelectOptions] = useState([]);
    const [soldiers, setSoldiers] = useState([]);
    const [data, setData] = useState([]);
    const [downloading, setDownloading] = useState(false);

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

        let filter = {
            "run": {
                "$elemMatch": {
                    "run_date": {
                        "$lte": toDate,
                        "$gte": fromDate
                    },
                    "court_order": "اضافه خدمت"
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
                                {"$lte": ["$$runItem.run_date", toDate]},
                                {"$gte": ["$$runItem.run_date", fromDate]},
                                {"$eq": ["$$runItem.court_order", "اضافه خدمت"]}
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
                        run_return_date: DateRenderer(run.return_date),
                        run_day_punish: run.run_punish,
                        run_duration: run.run_duration,
                    }));
                });
                setData(transformedData);
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
                setSoldiers(rowSpanData);
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

    function download() {
        const worksheet = XLSX.utils.json_to_sheet(data.map((row, index) => ({
            'ردیف': index + 1,
            'نام': row["first_name"],
            'نشان': row["last_name"],
            'کد ملی': row["national_code"],
            'نام پدر': row["father_name"],
            'تاریخ اعزام': row["deployment_date"],
            'یگان': row["unit"],
            'قسمت': row["section"],
            'تاریخ نهست': row["run_absence_date"],
            'تاریخ فرار': row["run_date"],
            'تاریخ مراجعت': row["run_return_date"],
            'اضافه تنبیهی': row["run_day_punish"],
            'مدت فرار': row["run_duration"],
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
        saveAs(blob, `گزارش.xlsx`);
    }

    return (
        <Flex vertical={true} style={{width: "100%"}}>
            {contextHolder}
            <Flex justify={"center"}>
                <Typography.Title level={3}>
                    گزارش ماده 60
                </Typography.Title>
            </Flex>
            <Divider/>
            <Flex style={{marginBottom: "20px"}}>
                <Form
                    layout={"inline"}
                    onFinish={onFinish}
                >
                    <Tooltip title={"از تاریخ فرار"}>
                        <Form.Item
                            label={"از تاریخ"}
                            name={"from_date"}
                            rules={[{
                                validator: dateValidator, required: true,
                            }]}
                        >
                            <Input />
                        </Form.Item>
                    </Tooltip>
                    <Tooltip title={"از تاریخ فرار"}>
                        <Form.Item
                            label={"تا تاریخ"}
                            name={"to_date"}
                            rules={[{
                                validator: dateValidator, required: true,
                            }]}
                        >
                            <Input />
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
                    <Form.Item>
                        <Button block={true} type={"primary"} loading={downloading} onClick={()=> {
                            setDownloading(true);
                            download();
                            setDownloading(false);
                        }}>دانلود</Button>
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

export default MD60Report;