import {Button, Divider, Flex, Form, notification, Select, Table, Tooltip, Typography} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer, NativeRenderer} from "../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";
import * as XLSX from "xlsx"
import {saveAs} from "file-saver";
import {InputDatePicker} from "jalaali-react-date-picker";

function ReleaseReport() {

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
            "legal_release_date": {
                "$lte": toDate,
                "$gte": fromDate
            },
            "status": {
                "$in": ["حاضر"]
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
                "military_rank": 1,
                "first_name": 1,
                "last_name": 1,
                "national_code": 1,
                "father_name": 1,
                "unit": 1,
                "section": 1,
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
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                const transformedData = res.flatMap((soldier, index) => {
                    return ({
                        rowIndex: index + 1,
                        military_rank: soldier.military_rank,
                        first_name: soldier.first_name,
                        last_name: soldier.last_name,
                        national_code: soldier.national_code,
                        father_name: soldier.father_name,
                        unit: soldier.unit,
                        section: soldier.section,
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
                setData(transformedData);
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

    function download() {
        console.log(data);
        const worksheet = XLSX.utils.json_to_sheet(data.map((row, index) => ({
            'ردیف': index + 1,
            'درجه': row["military_rank"],
            'نام': row["first_name"],
            'نشان': row["last_name"],
            'کد ملی': row["national_code"],
            'تاریخ اعزام': row["deployment_date"],
            'نام پدر': row["father_name"],
            'بومی/غیربومی': row["is_native"],
            'مدت نهست': row["absence_discharge"],
            'اضافه سالیانه': row["extra_annual_leave"],
            'اضافه استعلاجی': row["extra_medical_leave"],
            'مدت فرار': row["run_discharge"],
            'تنبیه ماده 60': row["run_punish"],
            'بازداشت': row["arrest_punish"],
            'سنواتی': row["additional_service_day"],
            'ترخیص قانونی': row["legal_release_date"],
            'ترخیص کل': row["overall_release_date"],
            'ترخیص پیشنهادی': "",
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
                        >
                            <InputDatePicker
                                format="jYYYY/jMM/jDD"
                                required={true}
                            />
                        </Form.Item>
                    </Tooltip>
                    <Tooltip title={"تا تاریخ ترخیص قانونی"}>
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
                            title: "درجه",
                            dataIndex: "military_rank",
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
                            title: "تاریخ اعزام",
                            dataIndex: "deployment_date",
                        },
                        {
                            title: "نام پدر",
                            dataIndex: "father_name",
                        },
                        {
                            title: "بومی/غیربومی",
                            dataIndex: "is_native",
                        },
                        {
                            title: "مدت نهست",
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
                            title: "مدت فرار",
                            dataIndex: "run_discharge",
                        },
                        {
                            title: "تنبیه ماده 60",
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
                            title: "ترخیص قانونی",
                            dataIndex: "legal_release_date",
                        },
                        {
                            title: "ترخیص کل",
                            dataIndex: "overall_release_date",
                        },
                        {
                            title: "ترخیص پیشنهادی",
                            dataIndex: "",
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