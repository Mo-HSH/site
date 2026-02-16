import {Button, Divider, Flex, Form, notification, Select, Table, Tooltip, Typography} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer} from "../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import {getApiUrl} from "../../utils/Config.js";
import axios from "axios";
import * as XLSX from "xlsx"
import {saveAs} from "file-saver";
import {InputDatePicker} from "jalaali-react-date-picker";

function AbsenceIgnoredReport() {

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
        const fromDate = GetQueryDate(value["from_date"].format('jYYYY/jMM/jDD'));
        const toDate = GetQueryDate(value["to_date"].format('jYYYY/jMM/jDD'));
        const unit = value["unit"];

        let filter = {
            "absence": {
                "$elemMatch": {
                    "ignored_date": {
                        "$lte": toDate,
                        "$gte": fromDate
                    },
                    "is_ignored": true
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
                    "absence": {
                        "$filter": {
                            "input": "$absence",
                            "as": "absenceItem",
                            "cond": {
                                "$and": [
                                    {"$lte": ["$$absenceItem.ignored_date", toDate]},
                                    {"$gte": ["$$absenceItem.ignored_date", fromDate]},
                                    {"$eq": ["$$absenceItem.is_ignored", true]}
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
                    return soldier.absence.map((absence, index) => ({
                        rowIndex: index === 0 ? rowIndexCounter++ : null,
                        first_name: soldier.first_name,
                        last_name: soldier.last_name,
                        national_code: soldier.national_code,
                        father_name: soldier.father_name,
                        unit: soldier.unit,
                        section: soldier.section,
                        deployment_date: DateRenderer(soldier.deployment_date),
                        absence_start_date: DateRenderer(absence.start_date),
                        absence_end_date: DateRenderer(absence.end_date),
                        absence_duration: absence.duration,
                        absence_is_ignored: absence.is_ignored,
                        absence_ignored_date: DateRenderer(absence.ignored_date),
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

    function download() {
        console.log(data);
        const worksheet = XLSX.utils.json_to_sheet(data.map((row, index) => ({
            'ردیف': index + 1,
            'نام': row["first_name"],
            'نشان': row["last_name"],
            'کد ملی': row["national_code"],
            'نام پدر': row["father_name"],
            'تاریخ اعزام': row["deployment_date"],
            'یگان': row["unit"],
            'قسمت': row["section"],
            'تاریخ نهست': row["absence_start_date"],
            'مدت نهست': row["absence_duration"],
            'تاریخ کان لم یکن': row["absence_ignored_date"],
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
                    گزارش کان لم یکن
                </Typography.Title>
            </Flex>
            <Divider/>
            <Flex style={{marginBottom: "20px"}}>
                <Form
                    layout={"inline"}
                    onFinish={onFinish}
                >
                    <Tooltip title={"از تاریخ نهست"}>
                        <Form.Item
                            label={"از تاریخ"}
                            name={"from_date"}
                        >
                            <InputDatePicker
                                format="jYYYY/jMM/jDD"
                                required={true}
                            />
                        </Form.Item>
                    </Tooltip>
                    <Tooltip title={"تا تاریخ نهست"}>
                        <Form.Item
                            label={"تا تاریخ"}
                            name={"to_date"}
                        >
                            <InputDatePicker
                                format="jYYYY/jMM/jDD"
                                required={true}
                            />
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
                            title: "شروع نهست",
                            dataIndex: "absence_start_date",
                        },
                        {
                            title: "مدت",
                            dataIndex: "absence_duration",
                        },
                        {
                            title: "تاریخ کان لم یکن",
                            dataIndex: "absence_ignored_date",
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

export default AbsenceIgnoredReport;