import {Button, Divider, Flex, Form, notification, Select, Table, Tooltip, Typography} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer, DutyGroupRenderer} from "../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import {getApiUrl} from "../../utils/Config.js";
import axios from "axios";
import * as XLSX from "xlsx"
import {saveAs} from "file-saver";
import {InputDatePicker} from "jalaali-react-date-picker";

function DutyGroupReport() {

    const [unitSelectOptions, setUnitSelectOptions] = useState([]);
    const [soldiers, setSoldiers] = useState([]);
    const [data, setData] = useState([]);
    const [downloading, setDownloading] = useState(false);

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
        const fromDate = GetQueryDate(value["from_date"].format('jYYYY/jMM/jDD'));
        const toDate = GetQueryDate(value["to_date"].format('jYYYY/jMM/jDD'));
        const unit = value["unit"];
        const dutyGroup = value["duty_group"];

        let filter = {
            "status": {"$in": ["حاضر", "فرار"]},
            "duty_group": dutyGroup,
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
            "military_rank": 1,
            "extra_info": 1,
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
                let rowIndexCounter = 1;

                const transformedData = res.flatMap(soldier => {
                    return soldier.duty_group_data.map((dutyGroup, index) => ({
                        rowIndex: index === 0 ? rowIndexCounter++ : null,
                        military_rank: soldier.military_rank,
                        first_name: soldier.first_name,
                        last_name: soldier.last_name,
                        national_code: soldier.national_code,
                        father_name: soldier.father_name,
                        unit: soldier.unit,
                        section: soldier.section,
                        deployment_date: DateRenderer(soldier.deployment_date),
                        duty_group_submit_date: DateRenderer(dutyGroup.submit_date),
                        duty_group_impart_date: DateRenderer(dutyGroup.impart_date),
                        duty_group: DutyGroupRenderer(dutyGroup.is_in_combat_group),
                        extra_info: soldier.extra_info,
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
        const worksheet = XLSX.utils.json_to_sheet(data.map((row, index) => ({
            'ردیف': index + 1,
            'درجه': row["military_rank"],
            'نام': row["first_name"],
            'نشان': row["last_name"],
            'کد ملی': row["national_code"],
            'تاریخ اعزام': row["deployment_date"],
            'گروه خدمتی': row["duty_group"],
            'تاریخ ثبت گروه خدمتی': row["duty_group_submit_date"],
            'تاریخ بهره مندی گروه خدمتی': row["duty_group_impart_date"],
            'گروه جسمانی': row["extra_info"].includes("معاف از رزم")? "معاف از رزم" : "سالم",
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
                        >
                            <InputDatePicker
                                format="jYYYY/jMM/jDD"
                                required={true}
                            />
                        </Form.Item>
                    </Tooltip>
                    <Tooltip title={"تا تاریخ کسر یا اضافه"}>
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

                    <Form.Item
                        label={"گروه خدمتی"}
                        name={"duty_group"}
                        rules={[{
                            required: true,
                        }]}
                        initialValue={true}
                    >
                        <Select
                                options={[{label: "رزمی", value: true}, {label: "غیر رزمی", value: false}]}
                                style={{minWidth: "100px"}}/>
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
                            title: "گروه خدمتی",
                            dataIndex: "duty_group",
                        },
                        {
                            title: dutyGroup ? "تاریخ اضافه" : "تاریخ کسر",
                            dataIndex: "duty_group_submit_date",
                        },
                        {
                            title: "تاریخ بهره مندی",
                            dataIndex: "duty_group_impart_date",
                        },
                        {
                            title: "گروه جسمانی",
                            dataIndex: "extra_info",
                            render: (value)=> {
                                return value.includes("معاف از رزم")? "معاف از رزم" : "سالم";
                            }
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