import SearchSelect from "../../layouts/SearchSelect.jsx";
import {useEffect, useState} from "react";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Drawer,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
    notification,
    Popconfirm,
    Row,
    Select,
    Table,
    Tabs,
    Tooltip,
    Typography,
} from "antd";
import {dateValidator, justStringValidator, nationalCodeValidator} from "../../utils/Validates.js";
import {DateRenderer, DutyGroupRenderer} from "../../utils/TableRenderer.jsx";
import {invoke} from "@tauri-apps/api/core";
import EditableTable from "../../utils/EditableTable.jsx";
import {numberTh} from "../../utils/Data.js";
import {
    CloseCircleTwoTone,
    DeleteOutlined,
    EditOutlined,
    FileOutlined,
    WarningTwoTone
} from "@ant-design/icons";
import RunMD from "../Print/run/RunMD.jsx";
import RunLetter from "../Print/run/RunLetter.jsx";
import {GetDutyDuration, IsDutyStopped} from "../../utils/Calculative.js";
import ReturnLetter from "../Print/run/ReturnLetter.jsx";
import DeployToCourt from "../Print/run/DeployToCourt.jsx";
import ReturnMD from "../Print/run/ReturnMD.jsx";

function LeaveAbsenceEscapeDeficitRun() {
    const [selectedSoldier, setSelectedSoldier] = useState({"leave": [], "absence": []});
    const [leaveData, setLeaveData] = useState([]);
    const [absenceData, setAbsenceData] = useState([]);
    const [arrestData, setArrestData] = useState([]);
    const [missionData, setMissionData] = useState([]);
    const [deficitData, setDeficitData] = useState([]);
    const [dutyGroupData, setDutyGroupData] = useState([]);
    const [runData, setRunData] = useState([]);
    const [deficitNames, setDeficitNames] = useState([]);
    const [selectedSoldierOid, setSelectedSoldierOid] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const [today, setToday] = useState("");
    const [openRunDrawer, setOpenRunDrawer] = useState(false);
    const [isPrintModalOpen, setOpenPrintModal] = useState(false);
    const [printTarget, setPrintTarget] = useState(<div>printable</div>);
    const [printTitle, setPrintTitle] = useState("پرینت");
    const [isDutyStopped, setIsDutyStopped] = useState(false);

    const [runEditIndex, setRunEditIndex] = useState(-1);

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    useEffect(() => {
        invoke("get_date_time_now").then((res) => {
            let temp = DateRenderer({"$date": {"$numberLong": res}});
            setToday(temp);
        }).catch((err) => {
            api["error"]({
                message: "خطا",
                description: err
            });
        });
    }, []);


    useEffect(() => {
        let temp = [];
        try {
            selectedSoldier["leave"].forEach((value, index) => {
                temp.push({
                    ...value,
                    "start_date": DateRenderer(value["start_date"]),
                    key: index
                })
            });
            setLeaveData(temp);
        } catch (err) {
            console.error(err);
        }
    }, [selectedSoldier]);

    useEffect(() => {
        let temp = [];
        try {
            selectedSoldier["absence"].forEach((value, index) => {
                temp.push({
                    ...value,
                    "start_date": DateRenderer(value["start_date"]),
                    "ignored_date": value["ignored_date"] ? DateRenderer(value["ignored_date"]) : "",
                    key: index
                })
            });
            setAbsenceData(temp);
        } catch (err) {
            console.error(err);
        }
    }, [selectedSoldier]);

    useEffect(() => {
        let temp = [];
        try {
            selectedSoldier["arrest"].forEach((value, index) => {
                temp.push({
                    ...value,
                    "start_date": DateRenderer(value["start_date"]),
                    key: index
                })
            });
            setArrestData(temp);
        } catch (err) {
            console.error(err);
        }
    }, [selectedSoldier]);

    useEffect(() => {
        let temp = [];
        try {
            selectedSoldier["mission"].forEach((value, index) => {
                temp.push({
                    ...value,
                    "start_date": DateRenderer(value["start_date"]),
                    key: index
                })
            });
            setMissionData(temp);
        } catch (err) {
            console.error(err);
        }
    }, [selectedSoldier]);

    useEffect(() => {
        let temp = [];
        try {
            selectedSoldier["deficit"].forEach((value, index) => {
                temp.push({
                    ...value,
                    "create_date": DateRenderer(value["create_date"]),
                    key: index
                })
            });
            setDeficitData(temp);
        } catch (err) {
            console.error(err);
        }
    }, [selectedSoldier]);

    useEffect(() => {
        let temp = [];
        try {
            selectedSoldier["duty_group_data"].forEach((value, index) => {
                temp.push({
                    ...value,
                    "submit_date": DateRenderer(value["submit_date"]),
                    key: index
                })
            });
            setDutyGroupData(temp);
        } catch (err) {
            console.error(err);
        }
    }, [selectedSoldier]);

    useEffect(() => {
        let temp = [];

        try {
            selectedSoldier["run"].forEach((value, index) => {
                function getDateValue(property) {
                    if (value.hasOwnProperty(property)) {
                        if (value[property] === null) {
                            return "";
                        } else {
                            return DateRenderer(value[property]);
                        }
                    } else {
                        return "";
                    }
                }

                temp.push({
                    ...value,
                    "absence_date": DateRenderer(value["absence_date"]),
                    "run_date": DateRenderer(value["run_date"]),
                    "run_letter_date": getDateValue("run_letter_date"),
                    "return_date": getDateValue("return_date"),
                    "return_letter_date": getDateValue("return_letter_date"),
                    "run_status": value.hasOwnProperty("run_status") ? value["run_status"] : "ثبت اولیه",
                    key: index
                })
            });
            setRunData(temp);
        } catch (err) {
            console.error(err);
        }
    }, [selectedSoldier]);

    useEffect(() => {
        invoke("get_config", {configName: "deficit-names"}).then((res) => {
            let temp = [];
            res.config.forEach((value) => {
                temp.push({
                    value: value,
                    label: value
                });
            });
            setDeficitNames(temp);
        }).catch((err) => {
            api["error"]({
                message: "خطا",
                description: err
            });
        })
    }, []);

    const leaveColumns = [
        {
            title: "تاریخ شروع",
            dataIndex: "start_date",
            key: "start_date",
            align: "center",
            inputType: "text",
            validator: dateValidator
        },
        {
            title: "سالیانه",
            dataIndex: "annual",
            key: "annual",
            align: "center",
            inputType: "number",
        },
        {
            title: "تعطیلات",
            dataIndex: "vacation",
            key: "vacation",
            align: "center",
            inputType: "number"
        },
        {
            title: "استعلاجی",
            dataIndex: "medical",
            key: "medical",
            align: "center",
            inputType: "number"
        },
        {
            title: "تو راهی",
            dataIndex: "on_road",
            key: "on_road",
            align: "center",
            inputType: "number"
        },
        {
            title: "تشویقی",
            dataIndex: "bonus",
            key: "bonus",
            align: "center",
            inputType: "number"
        }
    ];

    const absenceColumns = [
        {
            title: "تاریخ شروع",
            dataIndex: "start_date",
            key: "start_date",
            align: "center",
            inputType: "text",
            validator: dateValidator
        },
        {
            title: "مدت",
            dataIndex: "duration",
            key: "duration",
            align: "center",
            inputType: "number",
        },
        {
            title: "کان لم یکن",
            dataIndex: "is_ignored",
            key: "is_ignored",
            align: "center",
            inputType: "bool",
            render: (value) => {
                return (<Checkbox defaultChecked={value} disabled={true}/>);
            },
        },
        {
            title: "تاریخ کان لم یکن",
            dataIndex: "ignored_date",
            key: "ignored_date",
            align: "center",
            inputType: "text",
            validator: dateValidator
        },
        {
            title: "اولیه",
            dataIndex: "is_initial",
            key: "is_initial",
            align: "center",
            inputType: "bool",
            render: (value) => {
                return (<Checkbox defaultChecked={value} disabled={true}/>);
            },
        }
    ];

    const arrestColumns = [
        {
            title: "تاریخ شروع",
            dataIndex: "start_date",
            key: "start_date",
            align: "center",
            inputType: "text",
            validator: dateValidator
        },
        {
            title: "مدت",
            dataIndex: "duration",
            key: "duration",
            align: "center",
            inputType: "number",
        },
        {
            title: "دلیل",
            dataIndex: "reason",
            key: "reason",
            align: "center",
            inputType: "text",
        }
    ];

    const missionColumns = [
        {
            title: "تاریخ شروع",
            dataIndex: "start_date",
            key: "start_date",
            align: "center",
            inputType: "text",
            validator: dateValidator
        },
        {
            title: "مدت",
            dataIndex: "duration",
            key: "duration",
            align: "center",
            inputType: "number",
        },
        {
            title: "محل ماموریت",
            dataIndex: "location",
            key: "location",
            align: "center",
            inputType: "number",
        },
        {
            title: "امریه ماموریت",
            dataIndex: "order",
            key: "order",
            align: "center",
            inputType: "text",
        }
    ];

    const dutyGroupSelectOptions = [
        {
            label: "رزمی",
            value: true
        },
        {
            label: "غیر رزمی",
            value: false
        }
    ];

    const dutyGroupColumns = [
        {
            title: "تاریخ ثبت",
            dataIndex: "submit_date",
            key: "submit_date",
            align: "center",
            inputType: "text",
            validator: dateValidator
        },
        {
            title: "گروه خدمتی",
            dataIndex: "is_in_combat_group",
            key: "is_in_combat_group",
            align: "center",
            inputType: "select",
            selectOption: dutyGroupSelectOptions,
            render: DutyGroupRenderer
        },
    ];

    const deficitColumns = [
        {
            title: "تاریخ ثبت",
            dataIndex: "create_date",
            key: "create_date",
            align: "center",
            inputType: "text",
            validator: dateValidator
        },
        {
            title: "نوع کسری",
            dataIndex: "name",
            key: "name",
            align: "center",
            inputType: "select",
            selectOption: deficitNames
        },
        {
            title: "مدت",
            dataIndex: "day",
            key: "day",
            align: "center",
            inputType: "number",
        },
        {
            title: "صادره از",
            dataIndex: "letter_sender",
            key: "letter_sender",
            align: "center",
            inputType: "text",
        },
        {
            title: "شماره نامه",
            dataIndex: "letter_code",
            key: "letter_code",
            align: "center",
            inputType: "text",
        }
    ];

    function fetchData() {
        invoke("get_soldiers", {
            "query": {
                "filter":
                    {
                        "_id":
                            {
                                "$oid": selectedSoldierOid
                            }
                    }
                ,
                "projection":
                    {
                        "leave": 1,
                        "absence": 1,
                        "arrest": 1,
                        "deficit": 1,
                        "duty_group_data": 1,
                        "duty_group": 1,
                        "run": 1,
                        "mission": 1,
                        "legal_release_date": 1,
                        "overall_release_date": 1,
                    }
            }
        }).then((res) => {
            if (res.length === 0) {
                api["error"]({
                    message: "خطا", description: "مشکلی در سرور پیش آمده."
                });
            } else {
                setSelectedSoldier((oldValue) => {
                    let newValue = {...oldValue};
                    newValue["leave"] = res[0]["leave"];
                    newValue["absence"] = res[0]["absence"];
                    newValue["arrest"] = res[0]["arrest"];
                    newValue["mission"] = res[0]["mission"];
                    newValue["deficit"] = res[0]["deficit"];
                    newValue["duty_group_data"] = res[0]["duty_group_data"];
                    newValue["duty_group"] = res[0]["duty_group"];
                    newValue["run"] = res[0]["run"];
                    newValue["legal_release_date"] = res[0]["legal_release_date"];
                    newValue["overall_release_date"] = res[0]["overall_release_date"];
                    return newValue;
                });
                GetDutyDuration(selectedSoldierOid)
                    .then((res) => {
                        let temp = "";
                        temp = `${res.month} ماه و ${res.day} روز`
                        setSelectedSoldier((lastValue) => {
                            let newFilter = {...lastValue};
                            newFilter["duty_duration"] = temp;
                            return newFilter;
                        });
                    })
                    .catch((err) => {
                        setSelectedSoldier((lastValue) => {
                            let newFilter = {...lastValue};
                            newFilter["duty_duration"] = "err";
                            return newFilter;
                        });
                        api["error"]({
                            message: "خطا", description: err
                        });
                    })
                IsDutyStopped(selectedSoldierOid).then((res) => {
                    console.log(res);
                    setSelectedSoldier((lastValue) => {
                        let newFilter = {...lastValue};
                        newFilter["is_duty_stopped"] = res;
                        return newFilter;
                    });
                }).catch((err) => {
                    api["error"]({
                        message: "خطا", description: err
                    });
                });
            }
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })
    }

    function onCreate(value, queryTarget) {
        invoke("create_leave_or_absence", {
            "oid": selectedSoldierOid,
            "query": value,
            "queryTarget": queryTarget
        }).then((_) => {
            fetchData();
        }).catch((err) => {
            fetchData();
            if (typeof err === "object") {
                DateConflictErrorHandler(err);
            } else {
                api["error"]({
                    message: "خطا", description: err
                });
            }

        });
    }

    function onCreateLeave(value) {
        onCreate(value, "leave");
    }

    function onCreateDutyGroup(value) {
        onCreate(value, "duty_group");
    }

    function onCreateAbsence(value) {
        onCreate(value, "absence");
    }

    function onCreateArrest(value) {
        onCreate(value, "arrest");
    }

    function onCreateMission(value) {
        onCreate(value, "mission");
    }

    function onCreateDeficit(value) {
        onCreate(value, "deficit");
    }

    function onCreateRun(value) {
        onCreate(value, "run");
    }

    function DateConflictErrorHandler(err) {
        api["error"]({
            message: "مغایرت در تاریخ", description: <Flex justify={"start"} align={"start"}>
                {
                    err["leave"].length > 0
                        ?
                        <Typography.Text>مرخصی: {err["leave"].length} مورد</Typography.Text>
                        :
                        null
                }
                {
                    err["arrest"].length > 0
                        ?
                        <Typography.Text>بازداشت: {err["arrest"].length} مورد</Typography.Text>
                        :
                        null
                }
                {
                    err["absence"].length > 0
                        ?
                        <Typography.Text>نهست: {err["absence"].length} مورد</Typography.Text>
                        :
                        null
                }
                {
                    err["mission"].length > 0
                        ?
                        <Typography.Text>ماموریت: {err["mission"].length} مورد</Typography.Text>
                        :
                        null
                }
            </Flex>
        });
    }

    function onDelete(index, queryTarget) {
        console.log("delete", selectedSoldierOid);
        invoke("delete_leave_or_absence", {
            "oid": selectedSoldierOid,
            "index": index,
            "queryTarget": queryTarget
        }).then((_) => {
            fetchData();
        }).catch((err) => {
            fetchData();
            api["error"]({
                message: "خطا", description: err
            });
        })
    }

    function onDeleteLeave(index) {
        onDelete(index, "leave");
    }

    function onDeleteAbsence(index) {
        onDelete(index, "absence");
    }

    function onDeleteArrest(index) {
        onDelete(index, "arrest");
    }

    function onDeleteMission(index) {
        onDelete(index, "mission");
    }

    function onDeleteDeficit(index) {
        onDelete(index, "deficit");
    }

    function onDeleteRun(index) {
        onDelete(index, "run");
    }

    function onDeleteDutyGroup(index) {
        onDelete(index, "duty_group");
    }

    function onEdit(index, form, queryTarget) {
        return new Promise((resolve, _) => {
            form.validateFields().then((res) => {
                invoke("edit_leave_or_absence", {
                    "oid": selectedSoldierOid,
                    "index": index,
                    "query": res,
                    "queryTarget": queryTarget
                }).then((_) => {
                    fetchData();
                    resolve(true);
                }).catch((err) => {
                    if (typeof err === "object") {
                        DateConflictErrorHandler(err);
                    } else {
                        api["error"]({
                            message: "خطا", description: err
                        });
                    }
                    resolve(false);
                });
            }).catch((err) => {
                fetchData();
                api["error"]({
                    message: "خطا", description: err
                });
                resolve(false);
            });
        });
    }

    function onEditLeave(index, form) {
        return new Promise((resolve, _) => {
            resolve(onEdit(index, form, "leave"))
        });
    }

    function onEditAbsence(index, form) {
        return new Promise((resolve, _) => {
            resolve(onEdit(index, form, "absence"))
        });
    }

    function onEditArrest(index, form) {
        return new Promise((resolve, _) => {
            resolve(onEdit(index, form, "arrest"))
        });
    }

    function onEditMission(index, form) {
        return new Promise((resolve, _) => {
            resolve(onEdit(index, form, "mission"))
        });
    }

    function onEditDeficit(index, form) {
        return new Promise((resolve, _) => {
            resolve(onEdit(index, form, "deficit"))
        });
    }

    function onEditDutyGroup(index, form) {
        return new Promise((resolve, _) => {
            resolve(onEdit(index, form, "duty_group"))
        });
    }

    function onEditRun(value) {
        if (value["court_order"] !== undefined && value["court_order"] !== null) {
            if (value["court_order"].length > 0) {
                value["court_order"] = value["court_order"][0];
            } else {
                value["court_order"] = undefined;
            }
        }
        value["md_return"] = undefined;
        invoke("edit_leave_or_absence", {
            "oid": selectedSoldierOid,
            "index": runEditIndex,
            "query": value,
            "queryTarget": "run"
        }).then((_) => {
            fetchData();
            api["success"]({
                message: "انجام شد!"
            });
        }).catch((err) => {
            if (typeof err === "object") {
                DateConflictErrorHandler(err);
            } else {
                api["error"]({
                    message: "خطا", description: err
                });
            }
        });
    }


    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };

    function openPrintModal(page) {
        setPrintTarget(page);
        setOpenPrintModal(true);
    }

    return (
        <>
            {contextHolder}
            <SearchSelect
                setSelectedSoldierState={setSelectedSoldier}
                setSoldierOid={setSelectedSoldierOid}
                selectedSoldierProject={{
                    "leave": 1,
                    "duty_group_data": 1,
                    "duty_group": 1,
                    "absence": 1,
                    "arrest": 1,
                    "deficit": 1,
                    "run": 1,
                    "mission": 1,
                    "first_name": 1,
                    "last_name": 1,
                    "national_code": 1,
                    "military_rank": 1,
                    "unit": 1,
                    "section": 1,
                    "father_name": 1,
                    "deployment_date": 1,
                    "legal_release_date": 1,
                    "overall_release_date": 1,
                }}
                searchFormFields={
                    <>
                        <Form.Item
                            label={"نام"}
                            name={"first_name"}
                            rules={[{
                                required: false,
                                validator: justStringValidator
                            }]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label={"نشان"}
                            name={"last_name"}
                            rules={[{
                                required: false,
                                validator: justStringValidator
                            }]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label={"نام پدر"}
                            name={"father_name"}
                            rules={[{
                                required: false,
                                validator: justStringValidator
                            }]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label={"کد ملی"}
                            name={"national_code"}
                            rules={[{
                                required: false,
                                validator: nationalCodeValidator
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </>
                }
                selectedSoldierView={
                    <Flex vertical={true} justify={"center"} align={"start"} gap={"middle"}>

                        <Drawer placement={"bottom"} open={openRunDrawer} onClose={() => setOpenRunDrawer(false)}>
                            <Flex vertical={true} gap={"middle"}>
                                <Flex vertical={false} gap={"large"} justify={"center"} style={{width: "100%"}}>
                                    <Button
                                        type={"primary"}
                                        block={true}
                                        onClick={() => openPrintModal(<RunMD setPrintTitle={setPrintTitle}
                                                                             soldierKey={selectedSoldierOid}
                                                                             runIndex={runEditIndex}
                                                                             forceRefresh={Date.now()}/>)}
                                    >
                                        ماده دستور فرار
                                    </Button>
                                    <Button
                                        type={"primary"}
                                        block={true}
                                        onClick={() => openPrintModal(<RunLetter setPrintTitle={setPrintTitle}
                                                                                 soldierKey={selectedSoldierOid}
                                                                                 runIndex={runEditIndex}
                                                                                 forceRefresh={Date.now()}/>)}
                                    >
                                        نامه فرار
                                    </Button>
                                    <Button
                                        type={"primary"}
                                        block={true}
                                        onClick={() => openPrintModal(<DeployToCourt setPrintTitle={setPrintTitle}
                                                                                     soldierKey={selectedSoldierOid}
                                                                                     runIndex={runEditIndex}
                                                                                     forceRefresh={Date.now()}/>)}
                                    >
                                        فرم اعزام به قضایی
                                    </Button>
                                </Flex>
                                <Flex vertical={false} gap={"large"} justify={"center"} style={{width: "100%"}}>
                                    <Button
                                        type={"primary"}
                                        block={true}
                                        onClick={() => openPrintModal(<ReturnMD setPrintTitle={setPrintTitle}
                                                                                    soldierKey={selectedSoldierOid}
                                                                                    runIndex={runEditIndex}
                                                                                forceRefresh={Date.now()}/>)}
                                    >
                                        ماده دستور مراجعت
                                    </Button>
                                    <Button
                                        type={"primary"}
                                        block={true}
                                        onClick={() => openPrintModal(<ReturnLetter setPrintTitle={setPrintTitle}
                                                                                    soldierKey={selectedSoldierOid}
                                                                                    runIndex={runEditIndex}
                                                                                    forceRefresh={Date.now()}/>)}
                                    >
                                        نامه مراجعت
                                    </Button>
                                    <Button
                                        type={"primary"}
                                        block={true}
                                        onClick={() => openPrintModal(<ReturnLetter setPrintTitle={setPrintTitle}
                                                                                    soldierKey={selectedSoldierOid}
                                                                                    runIndex={runEditIndex}
                                                                                    forceRefresh={Date.now()}/>)}
                                    >
                                        نامه معرفی به گردان
                                    </Button>
                                </Flex>
                            </Flex>
                        </Drawer>

                        <Modal
                            open={isPrintModalOpen}
                            onCancel={() => setOpenPrintModal(false)}
                            footer={null}
                            title={printTitle}
                            width={"80%"}
                            centered={true}
                        >
                            {printTarget}
                        </Modal>

                        <Card title="اطلاعات سرباز" style={{width: "100%"}}>
                            <Card.Grid style={gridStyle}> نام : {selectedSoldier["first_name"]} </Card.Grid>
                            <Card.Grid style={gridStyle}> نشان : {selectedSoldier["last_name"]} </Card.Grid>
                            <Card.Grid style={gridStyle}> کد ملی : {selectedSoldier["national_code"]} </Card.Grid>
                            <Card.Grid style={gridStyle}> درجه : {selectedSoldier["military_rank"]} </Card.Grid>
                            <Card.Grid style={gridStyle}> یگان : {selectedSoldier["unit"]} </Card.Grid>
                            <Card.Grid style={gridStyle}> قسمت : {selectedSoldier["section"]} </Card.Grid>
                            <Card.Grid style={gridStyle}> نام پدر : {selectedSoldier["father_name"]} </Card.Grid>
                            <Card.Grid style={gridStyle}> تاریخ اعزام
                                : {DateRenderer(selectedSoldier["deployment_date"])} </Card.Grid>
                            <Card.Grid style={gridStyle}> تاریخ ترخیص قانونی
                                : {DateRenderer(selectedSoldier["legal_release_date"])} {selectedSoldier === undefined ? null : selectedSoldier["is_duty_stopped"] === undefined ? null : selectedSoldier["is_duty_stopped"]["stop"] ?
                                    <Tooltip
                                        title={"تاریخ دقیق نمیباشد به علت: " + selectedSoldier["is_duty_stopped"]["text"]}>
                                        <WarningTwoTone twoToneColor="#eb2f96"/> </Tooltip> : null} </Card.Grid>
                            <Card.Grid style={gridStyle}> تاریخ ترخیص کل
                                : {DateRenderer(selectedSoldier["overall_release_date"])} {selectedSoldier === undefined ? null : selectedSoldier["is_duty_stopped"] === undefined ? null : selectedSoldier["is_duty_stopped"]["stop"] ?
                                    <Tooltip
                                        title={"تاریخ دقیق نمیباشد به علت: " + selectedSoldier["is_duty_stopped"]["text"]}>
                                        <WarningTwoTone twoToneColor="#eb2f96"/> </Tooltip> : null} </Card.Grid>
                            <Card.Grid style={gridStyle}>گروه خدمتی
                                : {DutyGroupRenderer(selectedSoldier["duty_group"])} </Card.Grid>
                            <Card.Grid style={gridStyle}>مدت خدمت
                                : {selectedSoldier["duty_duration"]} </Card.Grid>
                        </Card>
                        <Tabs
                            style={{width: "100%"}}
                            defaultActiveKey={0}
                            type="card"
                            items={[
                                {
                                    label: "مرخصی",
                                    key: 0,
                                    children: <EditableTable
                                        refresher={selectedSoldierOid}
                                        formField={{
                                            start_day: '',
                                            annual: '',
                                            vacation: '',
                                            medical: '',
                                            on_road: '',
                                            bonus: ''
                                        }}
                                        onDelete={onDeleteLeave} onEdit={onEditLeave}
                                        pagination={false} bordered={true} style={{width: "100%"}}
                                        columns={leaveColumns} dataSource={leaveData}
                                        createForm={() =>
                                            <Flex>
                                                <Form
                                                    layout={"inline"}
                                                    onFinish={onCreateLeave}
                                                >
                                                    <Form.Item
                                                        label={"تاریخ شروع"}
                                                        name={"start_date"}
                                                        rules={[{
                                                            validator: dateValidator, required: true,
                                                        }]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"سالیانه"}
                                                        name={"annual"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber min={0}/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"تعطیلات"}
                                                        name={"vacation"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber min={0}/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"استعلاجی"}
                                                        name={"medical"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber min={0}/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"تو راهی"}
                                                        name={"on_road"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber min={0}/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"تشویقی"}
                                                        name={"bonus"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber min={0}/>
                                                    </Form.Item>

                                                    <Form.Item
                                                    >
                                                        <Button type="primary" htmlType="submit">
                                                            ثبت
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </Flex>
                                        }
                                    />
                                },
                                {
                                    label: "نهست",
                                    key: 1,
                                    children: <EditableTable
                                        formField={{
                                            start_day: '',
                                            duration: '',
                                            is_ignored: '',
                                            is_initial: '',
                                        }}
                                        onDelete={onDeleteAbsence} onEdit={onEditAbsence}
                                        pagination={false} bordered={true} style={{width: "100%"}}
                                        columns={absenceColumns} dataSource={absenceData}
                                        createForm={() =>
                                            <Flex>
                                                <Form
                                                    layout={"inline"}
                                                    onFinish={onCreateAbsence}
                                                >
                                                    <Form.Item
                                                        label={"تاریخ شروع"}
                                                        name={"start_date"}
                                                        rules={[{
                                                            validator: dateValidator, required: true,
                                                        }]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"مدت"}
                                                        name={"duration"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber min={0} addonAfter={"روز"}/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"غیبت اولیه"}
                                                        name={"is_initial"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        valuePropName={"checked"}
                                                        initialValue={false}
                                                    >
                                                        <Checkbox/>
                                                    </Form.Item>

                                                    <Form.Item
                                                    >
                                                        <Button type="primary" htmlType="submit">
                                                            ثبت
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </Flex>
                                        }
                                    />
                                },
                                {
                                    label: "بازداشت",
                                    key: 2,
                                    children: <EditableTable
                                        formField={{
                                            start_day: '',
                                            duration: '',
                                            reason: ''
                                        }}
                                        onDelete={onDeleteArrest} onEdit={onEditArrest}
                                        pagination={false} bordered={true} style={{width: "100%"}}
                                        columns={arrestColumns} dataSource={arrestData}
                                        createForm={() =>
                                            <Flex>
                                                <Form
                                                    layout={"inline"}
                                                    onFinish={onCreateArrest}
                                                >
                                                    <Form.Item
                                                        label={"تاریخ شروع"}
                                                        name={"start_date"}
                                                        rules={[{
                                                            validator: dateValidator, required: true,
                                                        }]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"مدت"}
                                                        name={"duration"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber min={0} addonAfter={"روز"}/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"علت"}
                                                        name={"reason"}
                                                        rules={[{
                                                            validator: justStringValidator, required: true,
                                                        }]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>

                                                    <Form.Item
                                                    >
                                                        <Button type="primary" htmlType="submit">
                                                            ثبت
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </Flex>
                                        }
                                    />
                                },
                                {
                                    label: "ماموریت",
                                    key: 3,
                                    children: <EditableTable
                                        formField={{
                                            order: '',
                                            start_date: '',
                                            duration: '',
                                            location: '',
                                        }}
                                        onDelete={onDeleteMission} onEdit={onEditMission}
                                        pagination={false} bordered={true} style={{width: "100%"}}
                                        columns={missionColumns} dataSource={missionData}
                                        createForm={() =>
                                            <Flex>
                                                <Form
                                                    layout={"inline"}
                                                    onFinish={onCreateMission}
                                                >
                                                    <Form.Item
                                                        label={"تاریخ شروع"}
                                                        name={"start_date"}
                                                        rules={[{
                                                            validator: dateValidator, required: true,
                                                        }]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"مدت"}
                                                        name={"duration"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber min={0} addonAfter={"روز"}/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"امریه ماموریت"}
                                                        name={"order"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={"محل ماموریت"}
                                                        name={"location"}
                                                        rules={[{
                                                            required: true,
                                                        }]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>

                                                    <Form.Item
                                                    >
                                                        <Button type="primary" htmlType="submit">
                                                            ثبت
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </Flex>
                                        }
                                    />
                                },
                                {
                                    label: "کسری",
                                    key: 4,
                                    children: <EditableTable
                                        formField={{
                                            create_date: '',
                                            name: '',
                                            day: '',
                                            letter_sender: '',
                                            letter_code: '',
                                        }}
                                        onDelete={onDeleteDeficit} onEdit={onEditDeficit}
                                        pagination={false} bordered={true} style={{width: "100%"}}
                                        columns={deficitColumns} dataSource={deficitData}
                                        createForm={() =>
                                            <Flex>
                                                <Form
                                                    onFinish={onCreateDeficit}
                                                >
                                                    <Row gutter={24}>
                                                        <Col flex={1}>
                                                            <Form.Item
                                                                label={"تاریخ ثبت"}
                                                                name={"create_date"}
                                                                rules={[{
                                                                    validator: dateValidator, required: true,
                                                                }]}
                                                            >
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col flex={1}>
                                                            <Form.Item
                                                                label={"نوع کسری"}
                                                                name={"name"}
                                                                rules={[{
                                                                    required: true,
                                                                }]}
                                                                style={{width: "250px"}}
                                                            >
                                                                <Select
                                                                    showSearch
                                                                    filterOption={filterOption}
                                                                    options={deficitNames}
                                                                    loading={deficitNames.length === 0}
                                                                />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col flex={1}>
                                                            <Form.Item
                                                                label={"مدت"}
                                                                name={"day"}
                                                                rules={[{
                                                                    required: true,
                                                                }]}
                                                            >
                                                                <InputNumber addonAfter={"روز"} min={0}/>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={24}>
                                                        <Col flex={1}>
                                                            <Form.Item
                                                                label={"فرستنده"}
                                                                name={"letter_sender"}
                                                                rules={[{
                                                                    required: true,
                                                                }]}
                                                            >
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col flex={1}>
                                                            <Form.Item
                                                                label={"شماره نامه"}
                                                                name={"letter_code"}
                                                                rules={[{
                                                                    required: true,
                                                                }]}
                                                            >
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col flex={1}>
                                                            <Form.Item
                                                            >
                                                                <Button type="primary" htmlType="submit">
                                                                    ثبت
                                                                </Button>
                                                            </Form.Item>
                                                        </Col>

                                                    </Row>

                                                </Form>
                                            </Flex>
                                        }
                                    />
                                },
                                {
                                    label: "فرار",
                                    key: 5,
                                    children:
                                        <Flex vertical={true} gap={"small"}>
                                            <Table

                                                footer={() => (
                                                    <>
                                                        {
                                                            runEditIndex !== -1
                                                                ?
                                                                <Flex vertical={true}>
                                                                    <Flex>

                                                                    </Flex>
                                                                    <Flex style={{width: "100%"}}>
                                                                        <Form
                                                                            initialValues={runData[runEditIndex]}
                                                                            style={{width: "100%"}}
                                                                            onFinish={(value) => {
                                                                                onEditRun(value)
                                                                            }}
                                                                        >
                                                                            <Row gutter={[24, 12]}
                                                                                 style={{width: "100%"}}>
                                                                                <Col span={12}>
                                                                                    <Flex justify={"center"}>
                                                                                        <Typography.Title
                                                                                            level={"h5"}>فرار</Typography.Title>
                                                                                    </Flex>
                                                                                    <Form.Item
                                                                                        label={"تاریخ نهست"}
                                                                                        name={"absence_date"}
                                                                                        rules={[{
                                                                                            validator: dateValidator,
                                                                                            required: false
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"تاریخ فرار"}
                                                                                        name={"run_date"}
                                                                                        rules={[{
                                                                                            validator: dateValidator,
                                                                                            required: false
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"شماره نامه"}
                                                                                        name={"run_letter_number"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"صادره از"}
                                                                                        name={"run_letter_sender"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"تاریخ نامه"}
                                                                                        name={"run_letter_date"}
                                                                                        rules={[{
                                                                                            validator: dateValidator,
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"ماده دستور فرار"}
                                                                                        name={"md_run"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"مرحله فرار"}
                                                                                        name={"run_count"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Select
                                                                                            showSearch
                                                                                            filterOption={filterOption}
                                                                                            options={numberTh}
                                                                                        />
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"وضعیت فرار"}
                                                                                        name={"run_status"}
                                                                                        rules={[{
                                                                                            required: true,
                                                                                        }]}
                                                                                    >
                                                                                        <Select
                                                                                            showSearch
                                                                                            filterOption={filterOption}
                                                                                            options={[
                                                                                                {
                                                                                                    title: "ثبت اولیه",
                                                                                                    value: "ثبت اولیه"
                                                                                                },
                                                                                                {
                                                                                                    title: "صدور ماده دستور فرار",
                                                                                                    value: "صدور ماده دستور فرار"
                                                                                                },
                                                                                                {
                                                                                                    title: "اتمام ماده دستور فرار",
                                                                                                    value: "اتمام ماده دستور فرار"
                                                                                                },
                                                                                                {
                                                                                                    title: "بازگشت اولیه",
                                                                                                    value: "بازگشت اولیه"
                                                                                                },
                                                                                                {
                                                                                                    title: "اعزام به قضایی",
                                                                                                    value: "اعزام به قضایی"
                                                                                                },
                                                                                                {
                                                                                                    title: "اعزام به یگان",
                                                                                                    value: "اعزام به یگان"
                                                                                                },
                                                                                                {
                                                                                                    title: "صدور ماده دستور مراجعت",
                                                                                                    value: "صدور ماده دستور مراجعت"
                                                                                                },
                                                                                                {
                                                                                                    title: "اتمام ماده دستور مراجعت",
                                                                                                    value: "اتمام ماده دستور مراجعت"
                                                                                                },
                                                                                                {
                                                                                                    title: "فرار بالای 6 ماه",
                                                                                                    value: "فرار بالای 6 ماه"
                                                                                                },
                                                                                            ]}
                                                                                        />
                                                                                    </Form.Item>
                                                                                    <Row gutter={[12, 12]}>
                                                                                        <Col>
                                                                                            <Typography.Title level={5}>مدت
                                                                                                فرار:</Typography.Title>
                                                                                        </Col>
                                                                                        <Col>
                                                                                            <Typography.Title
                                                                                                level={5}>{runData[runEditIndex] === undefined ? -1 : runData[runEditIndex].hasOwnProperty("run_duration") ? runData[runEditIndex]["run_duration"] : -1} روز</Typography.Title>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={12}>
                                                                                    <Flex justify={"center"}>
                                                                                        <Typography.Title
                                                                                            level={"h5"}>مراجعت</Typography.Title>
                                                                                    </Flex>
                                                                                    <Form.Item
                                                                                        label={"تاریخ مراجعت"}
                                                                                        name={"return_date"}
                                                                                        rules={[{
                                                                                            validator: dateValidator,
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"شماره نامه"}
                                                                                        name={"return_letter_number"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"صادره از"}
                                                                                        name={"return_letter_sender"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"تاریخ نامه"}
                                                                                        name={"return_letter_date"}
                                                                                        rules={[{
                                                                                            validator: dateValidator,
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"ماده دستور مراجعت"}
                                                                                        name={"md_return"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Input/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"اضافه خدمت تنبیهی"}
                                                                                        name={"run_punish"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <InputNumber min={0}
                                                                                                     style={{width: "100%"}}/>
                                                                                    </Form.Item>

                                                                                    <Form.Item
                                                                                        label={"حکم قضایی"}
                                                                                        name={"court_order"}
                                                                                        rules={[{
                                                                                            required: false,
                                                                                        }]}
                                                                                    >
                                                                                        <Select
                                                                                            showSearch
                                                                                            mode={"tags"}
                                                                                            maxCount={1}
                                                                                            filterOption={filterOption}
                                                                                            options={[
                                                                                                {
                                                                                                    title: "جریمه نقدی",
                                                                                                    value: "جریمه نقدی"
                                                                                                },
                                                                                                {
                                                                                                    title: "اضافه خدمت",
                                                                                                    value: "اضافه خدمت"
                                                                                                },
                                                                                                {
                                                                                                    title: "کان لم یکن",
                                                                                                    value: "کان لم یکن"
                                                                                                },
                                                                                                {
                                                                                                    title: "معاف از کیفر",
                                                                                                    value: "معاف از کیفر"
                                                                                                },
                                                                                            ]}
                                                                                        />
                                                                                    </Form.Item>
                                                                                </Col>
                                                                            </Row>

                                                                            <Row gutter={[24, 12]}>
                                                                                <Col span={24}>
                                                                                    <Flex vertical={false} gap={"small"}>
                                                                                        <Flex justify={"center"}>
                                                                                            <Typography.Title
                                                                                                level={"h5"}>بازگشت به سنگر</Typography.Title>
                                                                                        </Flex>
                                                                                        <Form.Item
                                                                                            label={"تاریخ تماس"}
                                                                                            name={"call_date"}
                                                                                            rules={[{
                                                                                                validator: dateValidator,
                                                                                                required: false,
                                                                                            }]}
                                                                                        >
                                                                                            <Input/>
                                                                                        </Form.Item>
                                                                                        <Form.Item
                                                                                            label={"شماره تماس"}
                                                                                            name={"call_phone"}
                                                                                            rules={[{
                                                                                                required: false,
                                                                                            }]}
                                                                                        >
                                                                                            <Input/>
                                                                                        </Form.Item>
                                                                                        <Form.Item
                                                                                            label={"نتیجه تماس"}
                                                                                            name={"call_result"}
                                                                                            rules={[{
                                                                                                required: false,
                                                                                            }]}
                                                                                        >
                                                                                            <Input/>
                                                                                        </Form.Item>
                                                                                    </Flex>
                                                                                </Col>
                                                                            </Row>

                                                                            <Flex vertical={false} gap={"small"}>
                                                                                <Form.Item>
                                                                                    <Button type="primary"
                                                                                            htmlType="submit">
                                                                                        ثبت
                                                                                    </Button>
                                                                                </Form.Item>

                                                                                <Form.Item>
                                                                                    <Button
                                                                                        onClick={() => setRunEditIndex(-1)}
                                                                                        danger>
                                                                                        لغو
                                                                                    </Button>
                                                                                </Form.Item>

                                                                                <Form.Item>
                                                                                    <Button onClick={() => {
                                                                                        setOpenRunDrawer(true);
                                                                                    }} type={"link"}
                                                                                            icon={<FileOutlined/>}>
                                                                                        اقدامات
                                                                                    </Button>
                                                                                </Form.Item>
                                                                            </Flex>
                                                                        </Form>
                                                                    </Flex>
                                                                </Flex>
                                                                :
                                                                <Form
                                                                    onFinish={onCreateRun}
                                                                    layout={"inline"}
                                                                >
                                                                    <Form.Item
                                                                        label={"تاریخ نهست"}
                                                                        name={"absence_date"}
                                                                        rules={[{
                                                                            validator: dateValidator, required: true,
                                                                        }]}
                                                                    >
                                                                        <Input/>
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        label={"شماره نامه"}
                                                                        name={"run_letter_number"}
                                                                        rules={[{
                                                                            required: false,
                                                                        }]}
                                                                    >
                                                                        <Input style={{direction: "rtl"}}/>
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        label={"صادره از"}
                                                                        name={"run_letter_sender"}
                                                                        rules={[{
                                                                            required: false,
                                                                        }]}
                                                                    >
                                                                        <Input/>
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        label={"تاریخ نامه"}
                                                                        name={"run_letter_date"}
                                                                        rules={[{
                                                                            validator: dateValidator, required: false,
                                                                        }]}
                                                                    >
                                                                        <Input/>
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        label={"مرحله فرار"}
                                                                        name={"run_count"}
                                                                        rules={[{
                                                                            required: true,
                                                                        }]}
                                                                    >
                                                                        <Select
                                                                            showSearch
                                                                            filterOption={filterOption}
                                                                            options={numberTh}
                                                                            style={{width: "90px"}}
                                                                        />
                                                                    </Form.Item>

                                                                    <Form.Item>
                                                                        <Button type="primary" htmlType="submit">
                                                                            ثبت
                                                                        </Button>
                                                                    </Form.Item>
                                                                </Form>}
                                                    </>
                                                )}

                                                columns={[
                                                    {
                                                        title: "تاریخ نهست",
                                                        dataIndex: "absence_date",
                                                        key: "absence_date"
                                                    },
                                                    {
                                                        title: "تاریخ نامه (فرار)",
                                                        dataIndex: "run_letter_date",
                                                        key: "run_letter_date"
                                                    },
                                                    {
                                                        title: "شماره نامه (فرار)",
                                                        dataIndex: "run_letter_number",
                                                        key: "run_letter_number"
                                                    },
                                                    {
                                                        title: "صادره از (فرار)",
                                                        dataIndex: "run_letter_sender",
                                                        key: "run_letter_sender"
                                                    },
                                                    {
                                                        render: (record) => {
                                                            return (
                                                                <Flex gap={"middle"} justify={"center"}
                                                                      align={"center"}>
                                                                    <Tooltip title={"ویرایش"}>
                                                                        <Button type={"primary"}
                                                                                ghost={record.key !== runEditIndex}
                                                                                icon={<EditOutlined/>}
                                                                                onClick={() => setRunEditIndex(record.key)}/>
                                                                    </Tooltip>
                                                                    <Popconfirm title="برای حذف مطمئن هستید؟"
                                                                                icon={<CloseCircleTwoTone
                                                                                    twoToneColor="#ff4d4f"/>}
                                                                                onConfirm={() => onDeleteRun(record.key)}>
                                                                        <Tooltip title={"حذف"}>
                                                                            <Button type="primary" danger ghost
                                                                                    icon={<DeleteOutlined/>}/>
                                                                        </Tooltip>
                                                                    </Popconfirm>
                                                                </Flex>
                                                            )
                                                        }
                                                    }
                                                ]}
                                                dataSource={runData}
                                                pagination={false}
                                                bordered={true}
                                            />

                                        </Flex>
                                },
                                {
                                    label: "گروه خدمتی",
                                    key: 6,
                                    children: <EditableTable
                                        formField={{
                                            create_date: '',
                                            duty_group: '',
                                        }}
                                        onDelete={onDeleteDutyGroup}
                                        pagination={false} bordered={true} style={{width: "100%"}}
                                        columns={dutyGroupColumns} dataSource={dutyGroupData}
                                        createForm={() =>
                                            <Flex>
                                                <Form
                                                    onFinish={onCreateDutyGroup}
                                                >
                                                    <Row gutter={24}>
                                                        <Col flex={1}>
                                                            <Form.Item
                                                                label={"تاریخ ثبت"}
                                                                name={"submit_date"}
                                                                rules={[{
                                                                    validator: dateValidator, required: true,
                                                                }]}
                                                                initialValue={today}
                                                            >
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col flex={1}>
                                                            <Form.Item
                                                                label={"گروه خدمتی"}
                                                                name={"is_in_combat_group"}
                                                                rules={[{
                                                                    required: true,
                                                                }]}
                                                                style={{width: "250px"}}
                                                                initialValue={selectedSoldier["duty_group"] !== undefined ? !selectedSoldier["duty_group"] : null}
                                                            >
                                                                <Select
                                                                    showSearch
                                                                    filterOption={filterOption}
                                                                    options={dutyGroupSelectOptions}
                                                                />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col flex={1}>
                                                            <Form.Item
                                                            >
                                                                <Button type="primary" htmlType="submit">
                                                                    ثبت
                                                                </Button>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                </Form>
                                            </Flex>
                                        }
                                    />
                                },
                            ]}
                        />
                    </Flex>
                }
            />
        </>
    )
}

export default LeaveAbsenceEscapeDeficitRun;