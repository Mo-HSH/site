import {
    Button, Cascader,
    Checkbox,
    Col,
    Drawer,
    Flex,
    Form,
    Input,
    notification,
    Popover,
    Row,
    Select,
    Table,
    Typography
} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";
import {DateRenderer, DutyGroupRenderer, NativeRenderer} from "../../utils/TableRenderer.jsx";
import * as XLSX from "xlsx"
import {saveAs} from "file-saver";
import {dateValidator} from "../../utils/Validates.js";
import {GetQueryDate} from "../../utils/Calculative.js";

function ListSoldier() {
    const [filter, setFilter] = useState({});
    const [projection, setProjection] = useState({});
    const [columns, setColumns] = useState([0, 1, 2, 3, 4, 5]);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [openSettingDrawer, setOpenSettingDrawer] = useState(false);
    const [data, setData] = useState([]);
    const [unitSectionOptions, setUnitSectionOptions] = useState([]);
    const [stateCityOptions, setStateCityOptions] = useState([]);

    const [statusOptions, setStatusOptions] = useState([]);
    const [mentalHealthOptions, setMentalHealthOptions] = useState([]);
    const [rankOptions, setRankOptions] = useState([]);

    const [filterForm, projectionForm] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        [
            {configName: "unit", setOptions: setUnitSectionOptions},
            {configName: "state", setOptions: setStateCityOptions},

            {configName: "status", setOptions: setStatusOptions},
            {configName: "mental-health", setOptions: setMentalHealthOptions},
            {configName: "rank", setOptions: setRankOptions},
        ].forEach(({configName, setOptions}) => {
            axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
                .then((response) => {
                    let temp = [];
                    response.data.config.forEach((value) => {
                        if (typeof (value) === "string") {
                            temp.push({
                                value: value,
                                label: value
                            });
                        } else {
                            temp.push({
                                value: value.name,
                                label: value.name,
                                children: [...value.config.map(i => {
                                    return ({
                                        value: i,
                                        label: i
                                    })
                                })]
                            })
                        }
                    });
                    setOptions(temp);
                })
                .catch(() => {
                });
        })
    }, []);


    useEffect(() => {
        axios.post(getApiUrl("soldier/list"), {
            "filter": filter.length > 0 ? {"$and": filter} : {},
            "projection": projection
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                setData(res);
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.response.data
                });
            });
    }, [filter, projection]);

    function columnsChange(checkedValues) {
        setColumns(checkedValues);
    }

    const options = [
        {
            label: "ردیف",
            value: {
                title: "ردیف",
                render: (text, record, index) => (
                    index + 1
                )
            }
        },
        {
            label: "درجه",
            value: {
                title: "درجه",
                dataIndex: "military_rank",
            },
        },
        {
            label: "نام",
            value: {
                title: "نام",
                dataIndex: "first_name",
            },
        },
        {
            label: "نشان",
            value: {
                title: "نشان",
                dataIndex: "last_name",
            },
        },
        {
            label: "کد ملی",
            value: {
                title: "کد ملی",
                dataIndex: "national_code",
            },
        },
        {
            label: "تاریخ اعزام",
            value: {
                title: "تاریخ اعزام",
                dataIndex: "deployment_date",
                render: DateRenderer
            },
        },
        {
            label: "مدرک تحصیلی",
            value: {
                title: "مدرک تحصیلی",
                dataIndex: "education",
                render: ((v) => {
                    try {
                        return v[0];
                    } catch {
                        return " ";
                    }
                })
            },
        },
        {
            label: "تاریخ تولد",
            value: {
                title: "تاریخ تولد",
                dataIndex: "birthday",
                render: DateRenderer
            },
        },
        {
            label: "نام پدر",
            value: {
                title: "نام پدر",
                dataIndex: "father_name",
            },
        },
        {
            label: "استان",
            value: {
                title: "استان",
                dataIndex: "state",
            },
        },
        {
            label: "شهر",
            value: {
                title: "شهر",
                dataIndex: "city",
            },
        },
        {
            label: "آدرس",
            value: {
                title: "آدرس",
                dataIndex: "address_street",
            },
        },
        {
            label: "یگان",
            value: {
                title: "یگان",
                dataIndex: "unit",
            },
        },
        {
            label: "قسمت",
            value: {
                title: "قسمت",
                dataIndex: "section",
            },
        },
        {
            label: "محل تولد",
            value: {
                title: "محل تولد",
                dataIndex: "birthplace",
            },
        },
        {
            label: "رشته تحصیلی",
            value: {
                title: "رشته تحصیلی",
                dataIndex: "field_of_study",
                render: ((v) => {
                    try {
                        return v[0];
                    } catch {
                        return " ";
                    }
                })
            },
        },
        {
            label: "تاریخ ترخیص قانونی",
            value: {
                title: "تاریخ ترخیص قانونی",
                dataIndex: "legal_release_date",
                render: DateRenderer
            },
        },
        {
            label: "تاریخ ترخیص کل",
            value: {
                title: "تاریخ ترخیص کل",
                dataIndex: "overall_release_date",
                render: DateRenderer
            },
        },
        {
            label: "بومی/غیر بومی",
            value: {
                title: "بومی/غیر بومی",
                dataIndex: "is_native",
                render: NativeRenderer
            },
        },
        {
            label: "دین",
            value: {
                title: "دین",
                dataIndex: "religion"
            },
        },
        {
            label: "وضعیت خدمتی",
            value: {
                title: "وضعیت خدمتی",
                dataIndex: "status"
            },
        },
        {
            label: "تاریخ ورود",
            value: {
                title: "تاریخ ورود",
                dataIndex: "entry_date",
                render: DateRenderer
            },
        },
        {
            label: "تاریخ نهست فرار",
            value: {
                title: "تاریخ نهست فرار",
                dataIndex: "run",
                render: ((run) => {
                    try {
                        let dates = run.sort((a, b) => a.absence_date.$date.$numberLong - b.absence_date.$date.$numberLong);
                        return DateRenderer(dates[dates.length - 1].absence_date);
                    } catch {
                        return " ";
                    }
                })
            },
        },
        {
            label: "تاریخ فرار",
            value: {
                title: "تاریخ فرار",
                dataIndex: "run",
                render: ((run) => {
                    try {
                        let dates = run.sort((a, b) => a.run_date.$date.$numberLong - b.run_date.$date.$numberLong);
                        return DateRenderer(dates[dates.length - 1].run_date);
                    } catch {
                        return " ";
                    }
                })
            },
        },
        {
            label: "تاریخ مراجعت",
            value: {
                title: "تاریخ مراجعت",
                dataIndex: "run",
                render: ((run) => {
                    try {
                        let dates = run.sort((a, b) => a.run_date.$date.$numberLong - b.run_date.$date.$numberLong);
                        return DateRenderer(dates[dates.length - 1].return_date);
                    } catch {
                        return " ";
                    }
                })
            },
        },
        {
            label: "تاریخ ترخیص",
            value: {
                title: "تاریخ ترخیص",
                dataIndex: "release",
                render: ((v) => {
                    if (v) {
                        return DateRenderer(v["release_date"]);
                    }
                    return "";
                })
            },
        },
        {
            label: "نوع ترخیص",
            value: {
                title: "نوع ترخیص",
                dataIndex: "release",
                render: ((v) => {
                    if (v) {
                        return v["release_type"];
                    }
                    return "";
                })
            },
        },
        {
            label: "سلامت روان",
            value: {
                title: "سلامت روان",
                dataIndex: "mental_health"
            }
        },
        {
            label: "سلامت جسمانی",
            value: {
                title: "سلامت جسمانی",
                dataIndex: "extra_info",
                render: ((v) => v.includes("معاف از رزم") ? "معاف از رزم" : "سالم")
            }
        },
        {
            label: "گروه خونی",
            value: {
                title: "گروه خونی",
                dataIndex: "blood_type"
            }
        },
        {
            label: "وضعیت تاهل",
            value: {
                title: "وضعیت تاهل",
                dataIndex: "family",
                render: ((v) => v.findIndex(i => i.relative === "همسر") > -1 ? "متاهل" : "مجرد")
            }
        },
        {
            label: "رنگ چشم",
            value: {
                title: "رنگ چشم",
                dataIndex: "eye_color"
            }
        },
        {
            label: "قد",
            value: {
                title: "قد",
                dataIndex: "height"
            }
        },
        {
            label: "شماره پرونده",
            value: {
                title: "شماره پرونده",
                dataIndex: "folder_number"
            }
        },
        {
            label: "یگان قبلی",
            value: {
                title: "یگان قبلی",
                dataIndex: "previous_unit"
            }
        },
        {
            label: "شغل سازمانی - عنوان یگان",
            value: {
                title: "شغل سازمانی - عنوان یگان",
                dataIndex: "organizational_job",
                render: ((v) => {
                    try {
                        return v[v.length - 1].unit_title;
                    } catch {
                        return "";
                    }
                })
            }
        },
        {
            label: "شغل سازمانی - عنوان شغل",
            value: {
                title: "شغل سازمانی - عنوان شغل",
                dataIndex: "organizational_job",
                render: ((v) => {
                    try {
                        return v[v.length - 1].job_title;
                    } catch {
                        return "";
                    }
                })
            }
        },
        {
            label: "شماره تماس",
            value: {
                title: "شماره تماس",
                dataIndex: "phone"
            }
        },
        {
            label: "گروه خدمتی",
            value: {
                title: "گروه رزمی",
                dataIndex: "duty_group",
                render: DutyGroupRenderer,
            }
        },
        {
            label: "مدت نهست",
            value: {
                title: "مدت نهست",
                dataIndex: "absence_discharge",
            }
        },
        {
            label: "مدت بازداشت",
            value: {
                title: "مدت بازداشت",
                dataIndex: "arrest_punish",
            }
        },
        {
            label: "مدت مرخصی استحقاقی",
            value: {
                title: "مدت مرخصی استحقاقی",
                dataIndex: "leave",
                render: ((v) => {
                    return v.reduce((acc, cur) => acc + cur.annual, 0)
                })
            }
        },
        {
            label: "مدت مرخصی استعلاجی",
            value: {
                title: "مدت مرخصی استعلاجی",
                dataIndex: "leave",
                render: ((v) => {
                    return v.reduce((acc, cur) => acc + cur.medical, 0)
                })
            }
        }
    ]

    function download() {
        let res = data.map((dataItem, index) => {
            let tempRes = columns.map((colIndex => {
                let temp = {};
                temp[options[colIndex].value.title] = dataItem[options[colIndex].value.dataIndex];
                return temp;
            }))
            let t = {};
            tempRes.forEach((v) => {
                const key = Object.keys(v)[0];
                if (v[key] === undefined) {
                    t[key] = index + 1;
                } else if (typeof v[key] === "object") {
                    let renderer = options.find((v) => v.label === key).value.render;
                    if (renderer) {
                        t[key] = renderer(v[key]);
                    } else {
                        t[key] = DateRenderer(v[key]);
                    }
                } else {

                    let renderer = options.find((v) => v.label === key)?.value.render;
                    console.log(options);
                    if (renderer) {
                        t[key] = renderer(v[key]);
                    } else {
                        t[key] = v[key];
                    }
                }
            })
            return t;
        })

        const worksheet = XLSX.utils.json_to_sheet(res);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
        saveAs(blob, `گزارش.xlsx`);
    }

    const filters = [
        {label: "نام", dataIndex: "first_name", type: "str"},
        {label: "نشان", dataIndex: "last_name", type: "str"},
        {label: "کد ملی", dataIndex: "national_code", type: "str"},
        {label: "نام پدر", dataIndex: "father_name", type: "str"},

        {label: "تاریخ تولد", dataIndex: "birthday", type: "date"},
        {label: "تاریخ اعزام", dataIndex: "deployment_date", type: "date"},
        {label: "تاریخ ورود", dataIndex: "entry_date", type: "date"},
        {label: "تاریخ ترخیص", dataIndex: "release.release_date", type: "date"},
        {label: "تاریخ ترخیص قانونی", dataIndex: "legal_release_date", type: "date"},
        {label: "تاریخ ترخیص کل", dataIndex: "overall_release_date", type: "date"},

        {
            label: "یگان-قسمت",
            dataIndex: "unit",
            dataIndex_child: "section",
            type: "treeSelect",
            options: unitSectionOptions
        },
        {
            label: "استان-شهر",
            dataIndex: "state",
            dataIndex_child: "city",
            type: "treeSelect",
            options: stateCityOptions
        },

        {label: "وضعیت خدمتی", dataIndex: "status", type: "select", options: statusOptions},
        {
            label: "نوع ترخیص", dataIndex: "release.release_type", type: "select", options: [
                {label: "پایان خدمت", value: "پایان خدمت"},
                {label: "ایست خدمت", value: "ایست خدمت"},
                {label: "فوت", value: "فوت"},
                {label: "معافیت", value: "معافیت"},
                {label: "انتقالی", value: "انتقالی"},
            ]
        },
        {label: "وضعیت سلامت روان", dataIndex: "mental_health", type: "select", options: mentalHealthOptions},
        {
            label: "وضعیت معاف از رزم",
            dataIndex: "physical_health",
            type: "select",
            options: [{label: "سالم", value: "سالم"}, {label: "معاف از رزم", value: "معاف از رزم"}]
        },
        {label: "درجه", dataIndex: "military_rank", type: "select", options: rankOptions},
        {
            label: "تاهل",
            dataIndex: "is_married",
            type: "select",
            options: [{label: "متاهل", value: "متاهل"}, {label: "مجرد", value: "مجرد"}]
        },
        {
            label: "گروه خدمتی",
            dataIndex: "duty_group",
            type: "select",
            options: [{label: "رزمی", value: "رزمی"}, {label: "غیررزمی", value: "غیررزمی"}]
        },
        {
            label: "بومی/غیربومی",
            dataIndex: "is_native",
            type: "select",
            options: [{label: "بومی", value: true}, {label: "غیربومی", value: false}]
        },
        {
            label: "عکس پرسنلی",
            dataIndex: "profile",
            type: "select",
            options: [{label: "دارد", value: "دارد"}, {label: "ندارد", value: "ندارد"}]
        },
        {
            label: "عکس پرسنلی نرمالایز شده",
            dataIndex: "normalized_profile",
            type: "select",
            options: [{label: "دارد", value: "دارد"}, {label: "ندارد", value: "ندارد"}]
        },
        {
            label: "اطلاعات بیشتر",
            dataIndex: "extra_info",
            type: "select",
            options: [{label: "دوره کد", value: "دوره کد"}, {label: "انتقالی", value: "انتقالی"},
                {label: "معاف از رزم", value: "معاف از رزم"}, {label: "مامور", value: "مامور"}]
        }
    ];

    function onFinishFilter(value) {
        let temp = [];

        filters.forEach((v) => {
            if (value[v.dataIndex] !== undefined && value[v.dataIndex].length > 0) {
            }
            switch (v.type) {
                case "str":
                    if (value[v.dataIndex] !== undefined && value[v.dataIndex].length > 0) {
                        let t = {};
                        t["$or"] = value[v.dataIndex].map(item => {
                            let b = {};
                            b[v.dataIndex] = {"$regex": `^${item}`};
                            return b;
                        });
                        temp.push(t);
                    }
                    break;
                case "date": {
                    const from_date = `from_${v.dataIndex}`;
                    const to_date = `to_${v.dataIndex}`;
                    if (value[to_date] !== undefined && value[from_date] !== undefined && value[v.dataIndex] !== "") {
                        let t = {};
                        t[v.dataIndex] = {
                            "$gte": GetQueryDate(value[from_date]),
                            "$lte": GetQueryDate(value[to_date])
                        };
                        temp.push(t);
                    }
                }
                    break;
                case "select":
                    if (value[v.dataIndex] !== undefined && value[v.dataIndex].length > 0) {
                        let t = {};
                        if (v.dataIndex === "physical_health") {
                            if (value[v.dataIndex].length === 1) {
                                if (value[v.dataIndex][0] === "معاف از رزم") {
                                    t["extra_info"] = "معاف از رزم";
                                } else {
                                    t["extra_info"] = {
                                        "$not": {
                                            "$all": ["معاف از رزم"]
                                        }
                                    }
                                }
                            }
                        } else if (v.dataIndex === "is_married") {
                            if (value[v.dataIndex].length === 1) {
                                if (value[v.dataIndex][0] === "متاهل") {
                                    t["family"] = {
                                        "$elemMatch": {
                                            "relative": "همسر"
                                        }
                                    }
                                } else {
                                    t["family"] = {
                                        "$not": {
                                            "$elemMatch": {
                                                "relative": "همسر"
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (["profile", "normalized_profile"].includes(v.dataIndex)) {
                            if (value[v.dataIndex].length === 1) {
                                if (value[v.dataIndex][0] === "دارد") {
                                    t[v.dataIndex] = {
                                        "$ne": ""
                                    }
                                } else {
                                    t[v.dataIndex] = ""
                                }
                            }
                        } else {
                            t[v.dataIndex] = {
                                "$in": value[v.dataIndex]
                            };
                        }
                        temp.push(t);
                    }
                    break;
                case "treeSelect":
                    if (value[v.dataIndex] !== undefined && value[v.dataIndex].length > 0) {
                        let t = {};
                        t[v.dataIndex] = {
                            "$in": [...new Set(value[v.dataIndex].map(v => v[0]))]
                        };
                        t[v.dataIndex_child] = {
                            "$in": value[v.dataIndex].map(v => v[1])
                        };
                        temp.push(t);
                    }
                    break;
                default:
                    break;
            }
        })

        console.log(temp);
        setFilter(temp);
    }

    return (
        <Flex vertical={true} style={{width: "100%"}}>
            {contextHolder}
            <Flex align={"center"} justify={"flex-end"} style={{
                borderRadius: 5,
                padding: 10,
                background: "#d5d5d5",
                zIndex: 10,
                transform: "translateY(15%)",
                position: "absolute"
            }}>
                <Flex gap={"small"} align={"center"}>
                    <Button type={"primary"} onClick={() => {
                        setOpenFilterDrawer(true)
                    }}>فیلتر</Button>
                    <Button type={"primary"} onClick={() => {
                        setOpenSettingDrawer(true)
                    }}>پیکربندی خروجی</Button>
                    <Button type={"primary"} onClick={() => {
                        download()
                    }}>دانلود</Button>
                    <Button type={"default"}>نتیجه جستجو: {data.length} نفر</Button>
                </Flex>
            </Flex>

            <Drawer title={"فیلتر"} placement={"right"} size={"large"} open={openFilterDrawer}
                    extra={<Button type={"primary"} onClick={() => {
                        filterForm.submit();
                    }}>اعمال فیلتر</Button>}
                    onClose={() => setOpenFilterDrawer(false)}>
                <Form
                    form={filterForm}
                    onFinish={onFinishFilter}
                >
                    {
                        filters.map(({label, dataIndex, type, options}) => {
                            switch (type) {
                                case "str":
                                    return (
                                        <Form.Item
                                            label={label}
                                            name={dataIndex}
                                        >
                                            <Select mode={"tags"} dropdownStyle={{visibility: "hidden"}}/>
                                        </Form.Item>
                                    )
                                case "date":
                                    return (
                                        <Row gutter={8}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label={["از", label].join(" ")}
                                                    name={["from", dataIndex].join("_")}
                                                    rules={[{
                                                        validator: dateValidator
                                                    }]}
                                                >
                                                    <Input placeholder={"1377/12/20"}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label={["تا", label].join(" ")}
                                                    name={["to", dataIndex].join("_")}
                                                    rules={[{
                                                        validator: dateValidator
                                                    }]}
                                                >
                                                    <Input placeholder={"1377/12/20"}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    )
                                case "treeSelect":
                                    return (
                                        <Form.Item
                                            label={label}
                                            name={dataIndex}
                                        >
                                            <Cascader
                                                showSearch
                                                multiple
                                                options={options}
                                                showCheckedStrategy={Cascader.SHOW_CHILD}
                                            />
                                        </Form.Item>
                                    )
                                case "select":
                                    return (
                                        <Form.Item
                                            label={label}
                                            name={dataIndex}
                                        >
                                            <Select
                                                showSearch
                                                mode={"tags"}
                                                options={options}
                                            />
                                        </Form.Item>
                                    )
                                default:
                                    break;
                            }
                        })
                    }

                </Form>

            </Drawer>
            <Drawer title={"تنظیمات"} placement={"left"} open={openSettingDrawer}
                    onClose={() => setOpenSettingDrawer(false)}>
                <Checkbox.Group style={{gap: "10px"}} options={options.map((v, index) => {
                    return ({label: v.label, value: index})
                })} onChange={columnsChange} value={columns}/>
            </Drawer>

            <Flex justify={"center"}>
                <Table
                    pagination={{
                        position: ["topLeft"],
                    }}
                    dataSource={data}
                    columns={columns.map((v) => options[v].value)}
                    style={{width: "100%"}}
                />
            </Flex>
        </Flex>
    );
}

export default ListSoldier;