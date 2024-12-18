import {useCallback, useEffect, useRef, useState} from "react";
import {
    Badge,
    Button,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    Form,
    Image,
    InputNumber,
    notification,
    Popover,
    Row,
    Spin,
    Table,
    Typography
} from "antd";
import {useReactToPrint} from "react-to-print";
import {GetDutyDuration} from "../../../utils/Calculative.js";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import Sign from "../../../components/printElement/Sign.jsx";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";

function StatusSummery({setPrintTitle, soldierKey}) {

    const printComponent = useRef(null);
    const [soldier, setSoldier] = useState({
        "is_native": true,
        "family": [],
        "leave": [],
        "arrest": [],
        "deficit": [],
        "run": [],
        "mission": [],
    });
    const [api, contextHolder] = notification.useNotification();
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [absence, setAbsence] = useState([]);
    const [dutyData, setDutyData] = useState({});

    const [leftSideFontSize, setLeftSideFontSize] = useState(10);
    const [leftSidePadding, setLeftSidePadding] = useState(4);
    const [leftSideDividerMargin, setLeftSideDividerMargin] = useState(8);
    const [leftSideDividerFontSize, setLeftSideDividerFontSize] = useState(13);
    const [dutyDuration, setDutyDuration] = useState({"native_duty_month": 21, "none_native_duty_month": 18});
    const [legalLeaveLimit, setLegalLeaveLimit] = useState(0);
    const [tables, setTables] = useState([]);
    const [lastPageIndex, setLastPageIndex] = useState(0);

    const dutyTable = useRef(null);
    const absenceTable = useRef(null);

    const maxDataEachPage = 35;

    useEffect(() => {
        setPrintTitle("خلاصه وضعیت");

        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setDutyData((prev) => {
                return ({
                    ...prev,
                    "today": DateRenderer({"$date": {"$numberLong": res.data}})
                });
            });
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
            });
        });

        axios.get(getApiUrl("config/duty-duration"), {withCredentials: true}).then((res) => {
            setDutyDuration(res.data.config);
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تنظیمات مدت خدمت!"
            });
        });

        axios.get(getApiUrl(`utils/get_total_legal_leave/${soldierKey}`), {withCredentials: true}).then((res) => {
            setLegalLeaveLimit(res.data);
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تنظیمات مرخصی"
            });
        });


        axios.post(getApiUrl("soldier/list"),
            {
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
                        "profile": 1,
                        "first_name": 1,
                        "last_name": 1,
                        "military_rank": 1,
                        "national_code": 1,
                        "father_name": 1,
                        "personnel_code": 1,
                        "deployment_date": 1,
                        "birthday": 1,
                        "birthplace": 1,
                        "religion": 1,
                        "education": 1,
                        "field_of_study": 1,
                        "mental_health": 1,
                        "extra_info": 1,
                        "blood_type": 1,
                        "height": 1,
                        "state": 1,
                        "city": 1,
                        "address_street": 1,
                        "address_house_number": 1,
                        "address_home_unit": 1,
                        "phone": 1,
                        "family": 1,
                        "leave": 1,
                        "absence": 1,
                        "arrest": 1,
                        "deficit": 1,
                        "run": 1,
                        "mission": 1,
                        "status": 1,
                        "is_native": 1,
                        "legal_release_date": 1,
                        "overall_release_date": 1,
                        "done_service_day": 1,
                        "additional_service_day": 1,
                    }
            },
            {withCredentials: true}
        )
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSoldier({
                        ...res[0],
                        "duty_duration": <Spin/>,
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        // "leave":
                        "birthday": DateRenderer(res[0]["birthday"]),
                        "legal_release_date": DateRenderer(res[0]["legal_release_date"]),
                        "overall_release_date": DateRenderer(res[0]["overall_release_date"]),
                        "deficit": res[0]["done_service_day"] > 0 ? [...res[0]["deficit"], {
                            name: "سابقه خدمت قبلی",
                            day: res[0]["done_service_day"]
                        }] : res[0]["deficit"],
                    });
                    setDutyData((prev) => {
                        return ({
                            ...prev,
                            "additional_service_day": res[0]["additional_service_day"],
                            "deployment_date": DateRenderer(res[0]["deployment_date"]),
                            "legal_release_date": DateRenderer(res[0]["legal_release_date"]),
                            "overall_release_date": DateRenderer(res[0]["overall_release_date"]),
                            "duty_month": (res[0]["is_native"] ? dutyDuration.native_duty_month : dutyDuration.none_native_duty_month) + "ماه"
                        });
                    });
                    GetDutyDuration(soldierKey)
                        .then((res) => {
                            let temp = "";
                            temp = `${res.month} ماه و ${res.day} روز`
                            setDutyData((lastValue) => {
                                let newFilter = {...lastValue};
                                newFilter["duty_duration"] = temp;
                                return newFilter;
                            });
                        })
                        .catch((err) => {
                            setDutyData((lastValue) => {
                                let newFilter = {...lastValue};
                                newFilter["duty_duration"] = "err";
                                return newFilter;
                            });
                            api["error"]({
                                message: "خطا", description: err
                            });
                        });
                    if (res[0].hasOwnProperty("absence")) {
                        let temp = [];
                        for (const i in res[0]["absence"]) {
                            if (!res[0]["absence"][i]["is_ignored"]) {
                                temp.push({
                                    ...res[0]["absence"][i],
                                    "end_date": {"$date": {"$numberLong": parseInt(res[0]["absence"][i]["end_date"]["$date"]["$numberLong"]) + 86400000}}
                                });
                            }
                        }
                        setAbsence(temp);
                    }
                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err
                });
            });

    }, [soldierKey]);

    function chunk(arr, size) {
        return Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
            arr.slice(i * size, i * size + size));
    }

    function separateArrayByTitle(arr) {
        const result = [];

        arr.forEach(element => {
            const {title, data} = element;

            let index = -1;
            for (let i = 0; i < result.length; i++) {
                if (result[i].title === title) {
                    index = i;
                }
            }
            if (index !== -1) {
                result[index].data.push(data);
            } else {
                result.push({
                    title: title,
                    data: [data]
                });
            }
        });

        return result;
    }

    useEffect(() => {
        let flattenedData = [];
        let lastTitle = "";
        [
            {title: "مرخصی", data: soldier["leave"]},
            {title: "نهست", data: absence},
            {title: "بازداشت", data: soldier["arrest"]},
            {title: "کسری", data: soldier["deficit"]},
            {title: "فرار", data: soldier["run"]},
            {title: "ماموریت", data: soldier["mission"]},
            {title: "خانواده", data: soldier["family"]},
        ].forEach(({title, data}) => {
            if (data.length > 0) {
                data.forEach((item) => {
                    flattenedData.push({title: title, data: item});
                })
            } else {
                flattenedData.push({title: title, data: {}});
            }
            if (title !== lastTitle) {
                flattenedData.push({title: title, data: {}});
                flattenedData.push({title: title, data: {}});
                lastTitle = title;
            }
        });

        let chunkedData = chunk(flattenedData, maxDataEachPage);
        let titleCounter = {};

        for (let i = 0, len = chunkedData.length; i < len; i++) {
            if (i + 1 >= len) break;

            const firstTitle = chunkedData[i][chunkedData[i].length - 1].title;
            const secondTitle = chunkedData[i + 1][0].title;
            if (firstTitle === secondTitle) {
                if (titleCounter[firstTitle] === undefined) {
                    titleCounter[firstTitle] = {
                        current: 0,
                        overall: 2
                    };
                } else {
                    titleCounter[firstTitle].overall++;
                }
            }
        }
        let temp = [];
        if (chunkedData[chunkedData.length - 1].length + 4 <= maxDataEachPage) {
            chunkedData[chunkedData.length - 1].push({title: "پایان خدمت", data: []});
        } else {
            chunkedData.push([{title: "پایان خدمت", data: []}]);
        }
        console.log(dutyData);
        chunkedData.forEach((pageTables, index) => {
            setLastPageIndex(index);
            let separatedTable = separateArrayByTitle(pageTables);
            separatedTable.forEach((eachTable) => {
                let title = eachTable.title;
                if (titleCounter[eachTable.title]) {
                    title += " " + ++titleCounter[eachTable.title].current + " از " + titleCounter[eachTable.title].overall;
                }
                let dataSource = eachTable.data;
                if (titleCounter[eachTable.title]) {
                    if (titleCounter[eachTable.title].current === titleCounter[eachTable.title].overall) {
                        if (lastColTables[eachTable.title]) {
                            if (lastColTables[eachTable.title].dataSource) {
                                dataSource.push(lastColTables[eachTable.title].dataSource);
                            }
                        }
                    }
                } else {
                    if (lastColTables[eachTable.title].dataSource) {
                        dataSource.push(lastColTables[eachTable.title].dataSource);
                    }
                }
                dataSource = dataSource.filter((eachData)=> Object.keys(eachData).length > 0);
                temp.push({
                    title: title,
                    dataSource: dataSource,
                    page: index,
                    columns: lastColTables[eachTable.title].columns,
                    extraColumns: lastColTables[eachTable.title].extraColumns
                })
            })
        })
        setTables(temp);
    }, [soldier, dutyData]);

    const dataSource = [
        {
            "category": "نام",
            "value": soldier["first_name"]
        },
        {
            "category": "نشان",
            "value": soldier["last_name"]
        },
        {
            "category": "درجه",
            "value": soldier["military_rank"]
        },
        {
            "category": "کد ملی",
            "value": soldier["national_code"]
        },
        {
            "category": "نام پدر",
            "value": soldier["father_name"]
        },
        {
            "category": "کد پرسنلی",
            "value": soldier["personnel_code"]
        },
        {
            "category": "تاریخ تولد",
            "value": soldier["birthday"]
        },
        {
            "category": "محل تولد",
            "value": soldier["birthplace"]
        },
        {
            "category": "دین و مذهب",
            "value": soldier["religion"]
        },
        {
            "category": "تحصیلات",
            "render": () => {
                return (
                    <div>
                        {soldier["education"]}
                        <br/>
                        {soldier["field_of_study"]}
                    </div>
                );
            }
        },
        {
            "category": <div>
                سلامت
                جسمانی
            </div>,
            "render": () => {
                if (soldier["extra_info"] === undefined) {
                    return <></>
                }
                if (soldier["extra_info"].includes("معاف از رزم")) {
                    return (<>معاف از رزم</>);
                } else {
                    return (<>سالم</>)
                }
            }

        },
        {
            "category": <div>
                سلامت
                روان
            </div>,
            "value": soldier["mental_health"]
        },
        {
            "category": "گروه خون",
            "value": soldier["blood_type"]
        },
        {
            "category": "قد",
            "value": soldier["height"]
        },
        {
            "category": "استان",
            "value": soldier["state"]
        },
        {
            "category": "شهر",
            "value": soldier["city"]
        },
        {
            "category": "خیابان",
            "value": soldier["address_street"]
        },
        {
            "category": "پلاک",
            "value": soldier["address_house_number"]
        },
        {
            "category": "واحد",
            "value": soldier["address_home_unit"]
        },
    ];

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    const familyColumns = [
        {
            title: "نام و نشان",
            dataIndex: "full_name",
            align: "center",
        },
        {
            title: "محل صدور شناسنامه",
            align: "center",
            dataIndex: "birth_certificate_issuing_place",
        },
        {
            title: "شغل",
            align: "center",
            dataIndex: "job",
        },
        {
            title: "نسبت",
            align: "center",
            dataIndex: "relative",
        }
    ];

    const dutyColumns = [
        {
            title: "مدت خدمت قانونی",
            align: "center",
            dataIndex: "duty_month",
        },
        {
            title: "خدمت انجام شده",
            align: "center",
            dataIndex: "duty_duration",
        },
        {
            title: "تاریخ اعزام",
            align: "center",
            dataIndex: "deployment_date",
        },
        {
            title: "تاریخ ترخیص قانونی",
            align: "center",
            dataIndex: "legal_release_date",
        },
        {
            title: "تاریخ ترخیص کل",
            align: "center",
            dataIndex: "overall_release_date",
        },
    ];

    const extraDutyColumns = [
        {
            title: "اضافه خدمت سنواتی",
            dataIndex: "additional_service_day",
            align: "center",
        },
        {
            title: "اضافه انضباطی",
            dataIndex: "additional_service",
            align: "center",
        },
        {
            title: "انفصال خدمت",
            align: "center",
            dataIndex: "discharge_service",
        },
        {
            title: "تاریخ تنظیم",
            align: "center",
            dataIndex: "today",
        }
    ];

    const lastCellMerge = (record) => {
        if (record.text) {
            return {
                colSpan: 0,
            };
        } else {
            return {};
        }
    };

    const rowCounterMerge = (text, record, index) => {
        if (record.text) {
            return record.text;
        } else {
            return <>{index + 1}</>;
        }
    }

    const leaveColumns = [
        {
            title: "ردیف",
            align: "center",
            render: rowCounterMerge,
            onCell: (record) => {
                if (record.text) {
                    return {
                        colSpan: 2,
                    };
                } else {
                    return {};
                }
            }
        },
        {
            title: "تاریخ شروع",
            dataIndex: "start_date",
            align: "center",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
            onCell: lastCellMerge
        },
        {
            title: "سالیانه",
            dataIndex: "annual",
            align: "center",
        },
        {
            title: "تعطیلات",
            dataIndex: "vacation",
            align: "center",
        },
        {
            title: "استعلاجی",
            dataIndex: "medical",
            align: "center",
        },
        {
            title: "تو راهی",
            dataIndex: "on_road",
            align: "center",
        },
        {
            title: "تشویقی",
            dataIndex: "bonus",
            align: "center",
        }
    ];

    const absenceColumns = [
        {
            title: "ردیف",
            align: "center",
            render: rowCounterMerge,
            onCell: (record) => {
                if (record.text) {
                    return {
                        colSpan: 3,
                    };
                } else {
                    return {};
                }
            }
        },
        {
            title: "تاریخ شروع",
            dataIndex: "start_date",
            align: "center",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
            onCell: lastCellMerge
        },
        {
            title: "تاریخ خاتمه",
            dataIndex: "end_date",
            align: "center",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
            onCell: lastCellMerge
        },
        {
            title: "مدت غیبت",
            dataIndex: "duration",
            align: "center",
        },
        {
            title: "مدت بازداشت",
            dataIndex: "duration",
            align: "center",
            render: v => v * 2,
        }
    ];

    const arrestColumns = [
        {
            title: "ردیف",
            align: "center",
            render: rowCounterMerge,
            onCell: (_, index) => {
                if (index === soldier["arrest"].length) {
                    return {
                        colSpan: 3,
                    };
                } else {
                    return {};
                }
            }
        },
        {
            title: "تاریخ شروع",
            dataIndex: "start_date",
            align: "center",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
            onCell: lastCellMerge,
        },
        {
            title: "علت",
            dataIndex: "reason",
            align: "center",
            onCell: lastCellMerge,
        },
        {
            title: "مدت",
            dataIndex: "duration",
            align: "center",
        },
    ];

    const missionColumns = [
        {
            title: "ردیف",
            align: "center",
            render: rowCounterMerge,
            onCell: (_, index) => {
                if (index === soldier["mission"].length) {
                    return {
                        colSpan: 3,
                    };
                } else {
                    return {};
                }
            }
        },
        {
            title: "تاریخ شروع",
            dataIndex: "start_date",
            align: "center",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
            onCell: lastCellMerge,
        },
        {
            title: "امریه ماموریت",
            dataIndex: "order",
            align: "center",
            onCell: lastCellMerge,
        },
        {
            title: "مدت",
            dataIndex: "duration",
            align: "center",
        },
    ];

    const deficitColumns = [
        {
            title: "ردیف",
            align: "center",
            render: rowCounterMerge,
            onCell: (_, index) => {
                if (index === soldier["deficit"].length) {
                    return {
                        colSpan: 2,
                    };
                } else {
                    return {};
                }
            }
        },
        {
            title: "نوع کسری",
            dataIndex: "name",
            align: "center",
            onCell: lastCellMerge
        },
        {
            title: "مدت",
            dataIndex: "day",
            align: "center",
        }
    ];

    const runColumns = [
        {
            title: "ردیف",
            align: "center",
            render: rowCounterMerge,
            onCell: (_, index) => {
                if (index === soldier["run"].length) {
                    return {
                        colSpan: 7,
                    };
                } else {
                    return {};
                }
            }
        },
        {
            title: "تاریخ نهست",
            dataIndex: "absence_date",
            align: "center",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
            onCell: lastCellMerge
        },
        {
            title: "تاریخ فرار",
            dataIndex: "run_date",
            align: "center",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
            onCell: lastCellMerge
        },
        {
            title: "م/د فرار",
            dataIndex: "md_run",
            align: "center",
            onCell: lastCellMerge
        },
        {
            title: "تاریخ مراجعت",
            dataIndex: "return_date",
            align: "center",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
            onCell: lastCellMerge
        },
        {
            title: "م/د مراجعت",
            dataIndex: "md_return",
            align: "center",
            onCell: lastCellMerge
        },
        {
            title: "حکم قضایی",
            dataIndex: "court_order",
            align: "center",
            onCell: lastCellMerge
        },
        {
            title: "اضافه تنبیهی",
            dataIndex: "run_punish",
            align: "center",
        },
        {
            title: "مدت فرار",
            dataIndex: "run_duration",
            align: "center",
        },
    ];

    const lastColTables = {
        "مرخصی": {
            title: "مرخصی",
            dataSource: {
                annual: soldier.leave.reduce((sum, leave) => sum + leave.annual, 0),
                vacation: soldier.leave.reduce((sum, leave) => sum + leave.vacation, 0),
                medical: soldier.leave.reduce((sum, leave) => sum + leave.medical, 0),
                on_road: soldier.leave.reduce((sum, leave) => sum + leave.on_road, 0),
                bonus: soldier.leave.reduce((sum, leave) => sum + leave.bonus, 0),
                text: "جمع کل"
            },
            columns: leaveColumns,
            rowClassName: (_, index) => {
                if (index >= soldier["leave"].length) {
                    return "gray-background";
                } else {
                    return "";
                }
            }
        },
        "نهست": {
            title: "نهست",
            ref: absenceTable,
            dataSource: {
                duration: absence.reduce((sum, absence) => sum + absence.duration, 0),
                text: "جمع کل"
            },
            columns: absenceColumns,
            rowClassName: (_, index) => {
                if (index === absence.length) {
                    return "gray-background";
                } else {
                    return "";
                }
            }
        },
        "بازداشت": {
            title: "بازداشت",
            dataSource: {
                duration: soldier.arrest.reduce((sum, arrest) => sum + arrest.duration, 0),
                text: "جمع کل"
            },
            columns: arrestColumns,
            rowClassName: (_, index) => {
                if (index === soldier["arrest"].length) {
                    return "gray-background";
                } else {
                    return "";
                }
            }
        },
        "کسری": {
            title: "کسری",
            dataSource: {
                day: soldier.deficit.reduce((sum, deficit) => sum + deficit.day, 0),
                text: "جمع کل"
            },
            columns: deficitColumns,
            rowClassName: (_, index) => {
                if (index === soldier["deficit"].length) {
                    return "gray-background";
                } else {
                    return "";
                }
            }
        },
        "فرار": {
            title: "فرار",
            dataSource: {
                "run_duration": soldier.run.reduce((sum, run) => sum + run["run_duration"], 0),
                "run_punish": soldier.run.reduce((sum, run) => sum + run["run_punish"], 0),
                text: "جمع کل"
            },
            columns: runColumns,
            rowClassName: (_, index) => {
                if (index === soldier["run"].length) {
                    return "gray-background";
                } else {
                    return "";
                }
            }
        },
        "ماموریت": {
            title: "ماموریت",
            dataSource: {
                duration: soldier.mission.reduce((sum, mission) => sum + mission.duration, 0),
                text: "جمع کل"
            },
            columns: missionColumns,
            rowClassName: (_, index) => {
                if (index === soldier["mission"].length) {
                    return "gray-background";
                } else {
                    return "";
                }
            }
        },
        "خانواده": {
            title: "خانواده",
            columns: familyColumns,
            rowClassName: ""
        },
        "پایان خدمت": {
            title: "پایان خدمت",
            ref: dutyTable,
            dataSource: {
                ...dutyData,
                "additional_service": dutyData["additional_service_day"] + absence.reduce((sum, absence) => sum + absence.duration, 0) * 2 + soldier.run.reduce((sum, run) => sum + run["run_punish"], 0) + soldier.arrest.reduce((sum, arrest) => sum + arrest.duration, 0),
                "discharge_service":
                    (legalLeaveLimit - soldier.leave.reduce((sum, leave) => sum + leave.annual, 0) < 0 ? -1 * (legalLeaveLimit - soldier.leave.reduce((sum, leave) => sum + leave.annual, 0)) : 0)
                    + (legalLeaveLimit - soldier.leave.reduce((sum, leave) => sum + leave.medical, 0) < 0 ? -1 * (legalLeaveLimit - soldier.leave.reduce((sum, leave) => sum + leave.medical, 0)) : 0)
                    + soldier.run.reduce((sum, run) => sum + run["run_duration"], 0)
                    + absence.reduce((sum, absence) => sum + absence.duration, 0)
            },
            columns: dutyColumns,
            extraColumns: extraDutyColumns,
            rowClassName: ""
        },
    };

    function TablePart({
                           width: width,
                           title: title,
                           ref: ref,
                           dataSource: dataSource,
                           columns: columns,
                           rowClassName: rowClassName,
                           extraColumns: extraColumns
                       }) {


        return (
            <>
                <Divider
                    className="print-divider-size">{title}
                </Divider>
                <Flex vertical={true} align={"center"} gap={"small"} style={{width: "100%"}}>
                    <Table
                        ref={ref}
                        pagination={false}
                        dataSource={dataSource}
                        bordered={true}
                        size={"small"}
                        locale={{
                            emptyText: <span
                                style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>, // Custom text for "No Data" view
                        }}
                        columns={columns}
                        rowClassName={rowClassName}
                        style={{
                            width: width,
                        }}
                    />
                    {
                        extraColumns
                            ?
                            <Table
                                ref={ref}
                                pagination={false}
                                dataSource={dataSource}
                                bordered={true}
                                size={"small"}
                                locale={{
                                    emptyText: <span
                                        style={{fontSize: '16px'}}>اطلاعاتی موجود نیست</span>,
                                }}
                                columns={extraColumns}
                                rowClassName={rowClassName}
                                style={{
                                    width: width,
                                }}
                            />
                            :
                            null
                    }
                </Flex>
            </>
        );
    }


    function Pages() {
        let pages = new Set();
        tables.forEach((v) => {
            if (v.page > 0)
            pages.add(v);
        })

        let arrPages = Array.from(pages).sort();
        let res = [];

        let i = 1;
        while (true) {
            let temp = [];
            arrPages.forEach((elem)=>{
                if (elem.page === i) {
                    temp.push(elem)
                }
            });
            i++;
            if (temp.length === 0) {
                break;
            } else {
                res.push(temp);
            }
        }

        let lastPageNumber = res.length;

        return (
            <>
                {
                    res.map(v => {
                        return (
                            <Flex vertical={true} align={"center"}
                                  style={{
                                      border: "solid gray 2px",
                                      borderRadius: "10px",
                                      background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                                  }}
                                  className={"break-after A4-portrait"}
                            >
                                {
                                    v.map(pageElements =>
                                        <TablePart width={"90%"} title={pageElements.title}
                                                   extraColumns={pageElements.extraColumns}
                                                   dataSource={pageElements.dataSource}
                                                   columns={pageElements.columns}
                                                   rowClassName={pageElements.rowClassName}/>
                                    )
                                }
                                {
                                    v[0].page === lastPageNumber
                                        ?
                                        <Flex justify={"flex-end"} align={"end"}
                                              style={{width: "90%", marginTop: "20px"}}>
                                            <Sign.Single
                                                defaultSign={"رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا"}/>
                                        </Flex>
                                        :
                                        null
                                }
                            </Flex>
                        )
                    })
                }
            </>
        );
    }

    return (
        <div className={"highlighter"}>
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            colorBgContainer: "rgba(255,255,255,0)",
                            borderColor: "rgba(5,5,5,0.15)",
                            fontSize: `${leftSideFontSize}px`,
                            paddingXS: `${leftSidePadding}px`,
                        },
                        Divider: {
                            margin: `${leftSideDividerMargin}px`,
                            fontSizeLG: `${leftSideDividerFontSize}px`,
                        },
                    },
                }}
            >
                {contextHolder}
                <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                      style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>
                    <InputNumber stringMode addonBefore={"فونت سایز جدول"} value={leftSideFontSize} step={"0.1"}
                                 onChange={v => setLeftSideFontSize(v)}/>
                    <InputNumber stringMode addonBefore={"فاصله جدول"} value={leftSidePadding} step={"0.1"}
                                 onChange={v => setLeftSidePadding(v)}/>
                    <InputNumber stringMode addonBefore={"فونت سایز تیتر"} value={leftSideDividerFontSize} step={"0.1"}
                                 onChange={v => setLeftSideDividerFontSize(v)}/>
                    <InputNumber stringMode addonBefore={"فاصله تیتر"} value={leftSideDividerMargin} step={"0.1"}
                                 onChange={v => setLeftSideDividerMargin(v)}/>
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
                    <Flex vertical={true} align={"center"}
                          className={"break-after A4-portrait"}
                    >
                        <Typography.Title level={5}>خلاصه وضعیت خدمتی کارکنان وظیفه فرماندهی پش مرکز
                            نپاجا</Typography.Title>
                        <Row style={{width: "100%", borderRadius: "10px"}}>
                            <Col span={7} style={{
                                height: "100%",
                                borderRadius: "0 10px 10px 0"
                            }}>
                                <Flex justify={"center"} align={"center"} vertical={true} style={{height: "100%"}}>
                                    <Flex vertical={true} align={"center"}
                                          style={{width: "90%", height: "100%"}}>
                                        <Badge count={"وضعیت خدمت: " + soldier["status"]} color={"blue"}
                                               offset={[80, 0]}>
                                            <Image preview={false} shape="square" width={160}
                                                   src={getApiUrl("files/serve_file/" + soldier["profile"])}
                                                   style={{border: "solid black 2px", borderRadius: "5px"}}/>
                                        </Badge>
                                        <Table
                                            size={"small"}
                                            pagination={false}
                                            className="custom-side-table"
                                            columns={[
                                                {
                                                    dataIndex: "category"
                                                },
                                                {
                                                    dataIndex: "value",
                                                    render: (v, e) => {
                                                        if (e.hasOwnProperty("render")) {
                                                            return e.render();
                                                        } else {
                                                            return (
                                                                <>{v}</>
                                                            );
                                                        }
                                                    }
                                                }
                                            ]}
                                            dataSource={dataSource}
                                            showHeader={false}
                                        />
                                        <Flex align={"right"} style={{width: "100%", marginTop: "10px"}}>
                                            <Typography.Text style={{fontSize: "13px"}}>توضیحات:</Typography.Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Col>
                            <Flex vertical={true} justify={"center"} align={"center"} style={{height: "100%"}}>
                                <Divider type={"vertical"}/>
                            </Flex>
                            <Col span={16}
                                 style={{borderRadius: "10px 0 0 10px", marginLeft: "5px", marginRight: "5px"}}>
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 2,
                                    }}
                                >
                                    <Flex vertical={true}>

                                        {
                                            tables.map(({
                                                            title,
                                                            ref,
                                                            page,
                                                            dataSource,
                                                            columns,
                                                            rowClassName,
                                                            extraColumns
                                                        }) => {
                                                return (
                                                    <>
                                                        {
                                                            page > 0
                                                                ?
                                                                null
                                                                :
                                                                <TablePart width={"100%"} title={title} ref={ref}
                                                                           dataSource={dataSource} columns={columns}
                                                                           rowClassName={rowClassName}
                                                                           extraColumns={extraColumns}/>

                                                        }
                                                    </>
                                                );
                                            })
                                        }
                                    </Flex>
                                    {
                                        lastPageIndex > 0
                                            ?
                                            null
                                            :
                                            <Flex justify={"flex-end"} align={"end"}
                                                  style={{ marginTop: "20px", zIndex: 22}}>
                                                <Sign.Single
                                                    defaultSign={"رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا"}/>
                                            </Flex>
                                    }
                                </div>

                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `url(${padafandLogo}) center center / contain no-repeat`,
                                    opacity: 0.06,
                                    zIndex: 0
                                }}></div>
                            </Col>
                        </Row>
                    </Flex>

                    <Pages/>

                </Flex>
            </ConfigProvider>
        </div>
    )
}

export default StatusSummery;