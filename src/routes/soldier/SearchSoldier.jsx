import {
    Avatar,
    Badge,
    Button,
    Card,
    Collapse,
    Divider,
    Drawer,
    Flex,
    Form,
    Image,
    Input,
    Modal,
    notification, Popconfirm, Popover,
    Table, Tabs,
    Tooltip,
    Typography
} from "antd";
import {
    dateValidator,
    justNumericValidator,
    justStringValidator,
} from "../../utils/Validates.js";
import {getStatusColor} from "../../utils/Color.js";
import {useState} from "react";
import {DateRenderer, DutyGroupRenderer, ExtraInfoRenderer, NativeRenderer} from "../../utils/TableRenderer.jsx";
import {
    CloseCircleTwoTone,
    DeleteOutlined,
    EditOutlined,
    UserOutlined,
    WarningTwoTone
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import SearchSelect from "../../layouts/SearchSelect.jsx";
import StatusSummery from "../Print/soldierProfile/StatusSummery.jsx";
import Admission from "../Print/soldierProfile/Admission.jsx";
import IntroductionLetter from "../Print/soldierProfile/IntroductionLetter.jsx";
import EmploymentCertificate from "../Print/soldierProfile/EmploymentCertificate.jsx";
import SoldierFolderLabel from "../Print/soldierProfile/SoldierFolderLabel.jsx";
import {getApiUrl} from "../../utils/Config.js";
import AccidentComission from "../Print/soldierProfile/AccidentComission.jsx";

function SearchSoldier() {

    const [targetSoldier, setTargetSoldier] = useState({
        family: [],
        leave: [],
        absence: [],
        run: [],
        deficit: [],
        mission: [],
        arrest: [],
        duty_group_data: []
    });
    const [key, setKey] = useState("");
    const [showMore, setShowMore] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [printTarget, setPrintTarget] = useState(<div>printable</div>);
    const [printTitle, setPrintTitle] = useState("تیتر پرینت");

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

    const dutyGroupColumns = [
        {
            title: "ردیف",
            align: "center",
            render: rowCounterMerge,
        },
        {
            title: "تاریخ ثبت",
            dataIndex: "submit_date",
            render: (v) => {
                if (v === undefined || v === null || v === "") {
                    return "-";
                } else {
                    return DateRenderer(v);
                }
            },
        },
        {
            title: "گروه خدمتی",
            dataIndex: "is_in_combat_group",
            render: DutyGroupRenderer
        },
    ].map(v => ({...v, align: "center"}));

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
        },
        {
            title: "تعطیلات",
            dataIndex: "vacation",
        },
        {
            title: "استعلاجی",
            dataIndex: "medical",
        },
        {
            title: "تو راهی",
            dataIndex: "on_road",
        },
        {
            title: "تشویقی",
            dataIndex: "bonus",
        }
    ].map(v => ({...v, align: "center"}));

    const absenceColumns = [
        {
            title: "ردیف",
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
        },
        {
            title: "مدت بازداشت",
            dataIndex: "duration",
            render: v => v * 2,
        }
    ].map(v => ({...v, align: "center"}));

    const arrestColumns = [
        {
            title: "ردیف",
            render: rowCounterMerge,
            onCell: (_, index) => {
                if (index === targetSoldier.arrest.length) {
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
            onCell: lastCellMerge,
        },
        {
            title: "مدت",
            dataIndex: "duration",
        },
    ].map(v => ({...v, align: "center"}));

    const missionColumns = [
        {
            title: "ردیف",
            render: rowCounterMerge,
            onCell: (_, index) => {
                if (index === targetSoldier.mission.length) {
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
            onCell: lastCellMerge,
        },
        {
            title: "مدت",
            dataIndex: "duration",
        },
    ].map(v => ({...v, align: "center"}));

    const deficitColumns = [
        {
            title: "ردیف",
            render: rowCounterMerge,
            onCell: (_, index) => {
                if (index === targetSoldier.deficit.length) {
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
            onCell: lastCellMerge
        },
        {
            title: "مدت",
            dataIndex: "day",
        }
    ].map(v => ({...v, align: "center"}));

    const runColumns = [
        {
            title: "ردیف",
            render: rowCounterMerge,
            onCell: (_, index) => {
                if (index === targetSoldier.run.length) {
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
            onCell: lastCellMerge
        },
        {
            title: "تاریخ مراجعت",
            dataIndex: "return_date",
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
            onCell: lastCellMerge
        },
        {
            title: "حکم قضایی",
            dataIndex: "court_order",
            onCell: lastCellMerge
        },
        {
            title: "اضافه تنبیهی",
            dataIndex: "run_punish",
        },
        {
            title: "مدت فرار",
            dataIndex: "run_duration",
        },
    ].map(v => ({...v, align: "center"}));


    const collapseItems = [
        {
            key: '1',
            label: 'اطلاعات فردی',
            children: <Flex vertical={true} gap={"middle"}>
                <Table pagination={false} bordered={false} dataSource={[targetSoldier]} columns={[
                    {
                        title: "نام پدر",
                        dataIndex: "father_name",
                    },
                    {
                        title: "کد ملی",
                        dataIndex: "national_code",
                    },
                    {
                        title: "محل تولد",
                        dataIndex: "birthplace",
                    },
                    {
                        title: "تاریخ تولد",
                        dataIndex: "birthday",
                        render: DateRenderer,
                    },
                    {
                        title: "محل صدور شناسنامه",
                        dataIndex: "birth_certificate_issuing_place",
                    },
                    {
                        title: "مذهب",
                        dataIndex: "religion",
                    },
                    {
                        title: "شماره حساب",
                        dataIndex: "bank_account",
                    }
                ]}/>
                <Flex vertical={false} gap={"small"}>
                    <Flex style={{
                        backgroundColor: "#F4F4F4",
                        padding: "10px"
                    }} flex={1} justify={"center"} align={"center"}>
                        <Typography.Text>اعضای خانواده</Typography.Text>
                    </Flex>
                    <Flex vertical={true} flex={5} gap={"middle"} justify={"center"} align={"center"}>
                        {targetSoldier["family"].map((value) => {
                            return (
                                <Table style={{width: "100%"}} bordered={true} pagination={false} dataSource={[value]}
                                       columns={[
                                           {
                                               title: "نام و نشان",
                                               dataIndex: "full_name",
                                           },
                                           {
                                               title: "نام پدر",
                                               dataIndex: "father_name",
                                           },
                                           {
                                               title: "کد ملی",
                                               dataIndex: "national_code",
                                           },
                                           {
                                               title: "محل صدور شناسنامه",
                                               dataIndex: "birth_certificate_issuing_place",
                                           },
                                           {
                                               title: "شغل",
                                               dataIndex: "job",
                                           },
                                           {
                                               title: "نسبت",
                                               dataIndex: "relative",
                                           },
                                       ]}/>
                            );
                        })}
                    </Flex>
                </Flex>
            </Flex>,
        },
        {
            key: '2',
            label: 'اطلاعات نظامی',
            children: <Flex style={{width: "100%"}}>
                <Table style={{width: "100%"}} pagination={false} bordered={false} dataSource={[targetSoldier]}
                       columns={[
                           {
                               title: "سنوات",
                               dataIndex: "additional_service_day",
                           },
                           {
                               title: "سابقه خدمت پیشین",
                               dataIndex: "done_service_day",
                           },
                           {
                               title: "کد پرسنلی",
                               dataIndex: "personnel_code",
                           },
                           {
                               title: "تاریخ ورود",
                               dataIndex: "entry_date",
                               render: DateRenderer,
                           },
                           {
                               title: "شماره امریه",
                               dataIndex: "order_number",
                           },
                           {
                               title: "یگان پیشین",
                               dataIndex: "previous_unit",
                           },
                           {
                               title: "اطلاعات بیشتر",
                               dataIndex: "extra_info",
                               render: ExtraInfoRenderer,
                           },
                       ]}/>
            </Flex>
        },
        {
            key: '3',
            label: 'مهارت',
            children: <Flex style={{width: "100%"}}>
                <Table style={{width: "100%"}} pagination={false} bordered={false} dataSource={[targetSoldier]}
                       columns={[
                           {
                               title: "تحصیلات",
                               dataIndex: "education",
                           },
                           {
                               title: "رشته تحصیلی",
                               dataIndex: "field_of_study",
                           },
                           {
                               title: "مهارت",
                               dataIndex: "skill",
                           },
                           {
                               title: "یادگیری مهارت",
                               dataIndex: "skill_to_learn",
                           },
                       ]}/>
            </Flex>
        },
        {
            key: '4',
            label: 'اطلاعات پزشکی',
            children: <Flex style={{width: "100%"}}>
                <Table style={{width: "100%"}} pagination={false} bordered={false} dataSource={[targetSoldier]}
                       columns={[
                           {
                               title: "سلامت روان",
                               dataIndex: "mental_health",
                           },
                           {
                               title: "گروه خون",
                               dataIndex: "blood_type",
                           },
                           {
                               title: "رنگ چشم",
                               dataIndex: "eye_color",
                           },
                           {
                               title: "قد",
                               dataIndex: "height",
                           },
                       ]}/>
            </Flex>
        },
        {
            key: '5',
            label: 'آدرس',
            children: <Flex style={{width: "100%"}} vertical={true}>
                <Table style={{width: "100%"}} pagination={false} bordered={false} dataSource={[targetSoldier]}
                       columns={[
                           {
                               title: "شماره تماس",
                               dataIndex: "phone",
                               align: "center"
                           },
                           {
                               title: "وضعیت سکونت",
                               dataIndex: "is_native",
                               render: NativeRenderer,
                               align: "center"
                           },
                       ]}/>
                <Table style={{width: "100%"}} pagination={false} bordered={false} dataSource={[targetSoldier]}
                       columns={[
                           {
                               title: "استان",
                               dataIndex: "state",
                           },
                           {
                               title: "شهر",
                               dataIndex: "city",
                           },
                           {
                               title: "خیابان",
                               dataIndex: "address_street",
                           },
                           {
                               title: "پلاک",
                               dataIndex: "address_house_number",
                           },
                           {
                               title: "واحد",
                               dataIndex: "address_home_unit",
                           },

                       ]}/>
            </Flex>
        },
        {
            key: '6',
            label: 'ثبتی ها',
            children: <Flex style={{width: "100%"}}>
                <Tabs
                    style={{width: "100%"}}
                    defaultActiveKey={0}
                    type="card"
                    items={[
                        {
                            label: "مرخصی",
                            key: 0,
                            children: <Table
                                pagination={false} bordered={true} style={{width: "100%"}}
                                columns={leaveColumns} dataSource={targetSoldier.leave ? [...targetSoldier.leave, {
                                annual: targetSoldier.leave.reduce((sum, leave) => sum + leave.annual, 0),
                                vacation: targetSoldier.leave.reduce((sum, leave) => sum + leave.vacation, 0),
                                medical: targetSoldier.leave.reduce((sum, leave) => sum + leave.medical, 0),
                                on_road: targetSoldier.leave.reduce((sum, leave) => sum + leave.on_road, 0),
                                bonus: targetSoldier.leave.reduce((sum, leave) => sum + leave.bonus, 0),
                                text: "جمع کل"
                            }] : []}
                            />
                        },
                        {
                            label: "نهست",
                            key: 1,
                            children: <Table
                                pagination={false} bordered={true} style={{width: "100%"}}
                                columns={absenceColumns}
                                dataSource={
                                    targetSoldier.absence
                                        ?
                                        [
                                            ...targetSoldier.absence.filter(v=>!v.is_ignored),
                                            {
                                                duration: targetSoldier.absence.filter(v=>!v.is_ignored).reduce((sum, absence) => sum + absence.duration, 0),
                                                text: "جمع کل"
                                            }
                                        ]
                                        : []}
                            />
                        },
                        {
                            label: "بازداشت",
                            key: 2,
                            children: <Table
                                pagination={false} bordered={true} style={{width: "100%"}}
                                columns={arrestColumns} dataSource={targetSoldier.arrest ? [...targetSoldier.arrest, {
                                duration: targetSoldier.arrest.reduce((sum, arrest) => sum + arrest.duration, 0),
                                text: "جمع کل"
                            }] : []}
                            />
                        },
                        {
                            label: "ماموریت",
                            key: 3,
                            children: <Table
                                pagination={false} bordered={true} style={{width: "100%"}}
                                columns={missionColumns}
                                dataSource={targetSoldier.mission ? [...targetSoldier.mission, {
                                    duration: targetSoldier.mission.reduce((sum, mission) => sum + mission.duration, 0),
                                    text: "جمع کل"
                                }] : []}
                            />
                        },
                        {
                            label: "کسری",
                            key: 4,
                            children: <Table
                                pagination={false} bordered={true} style={{width: "100%"}}
                                columns={deficitColumns}
                                dataSource={targetSoldier.deficit ? [...targetSoldier.deficit, {
                                    duration: targetSoldier.arrest.reduce((sum, arrest) => sum + arrest.duration, 0),
                                    text: "جمع کل"
                                }] : []}
                            />
                        },
                        {
                            label: "فرار",
                            key: 5,
                            children:
                                <Table
                                    pagination={false} bordered={true} style={{width: "100%"}}
                                    columns={runColumns} dataSource={targetSoldier.run ? [...targetSoldier.run, {
                                    "run_duration": targetSoldier.run.reduce((sum, run) => sum + run["run_duration"], 0),
                                    "run_punish": targetSoldier.run.reduce((sum, run) => sum + run["run_punish"], 0),
                                    text: "جمع کل"
                                }] : []}
                                />
                        },
                        {
                            label: "گروه خدمتی",
                            key: 6,
                            children: <Table
                                pagination={false} bordered={true} style={{width: "100%"}}
                                columns={dutyGroupColumns}
                                dataSource={targetSoldier.duty_group_data ? targetSoldier.duty_group_data : []}
                            />
                        },
                    ]}
                />
            </Flex>
        }
    ]

    function openPrintModal(page) {
        setPrintTarget(page);
        setIsModalOpen(true);
    }

    function ShouldWarnOnReleaseDate() {
        if (targetSoldier !== undefined) {
            if (targetSoldier.hasOwnProperty("is_duty_stopped")) {
                if (targetSoldier["is_duty_stopped"].stop) {
                    return (
                        <Tooltip title={"تاریخ دقیق نمیباشد به علت: " + targetSoldier["is_duty_stopped"].text}>
                            <WarningTwoTone twoToneColor="#eb2f96"/> </Tooltip>
                    );
                } else {
                    return (<></>);
                }
            }
        }
    }

    return (
        <SearchSelect
            selectedSoldierView={
                <Flex justify={"center"}>
                    <Modal
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        footer={null}
                        title={printTitle}
                        width={"80%"}
                        centered={true}
                    >
                        {printTarget}
                    </Modal>
                    {contextHolder}

                    <Drawer placement={"bottom"} open={openDrawer} onClose={() => setOpenDrawer(false)}>
                        <Flex vertical={false} gap={"large"} justify={"center"} style={{width: "100%"}}>
                            <Card title={"خروجی"} style={{width: "100%"}}>
                                <Flex style={{width: "100%"}} vertical={true} gap={"middle"}>
                                    <Flex vertical={false} style={{width: "100%"}} gap={"middle"}>
                                        <Button type={"primary"} block={true}
                                                onClick={() => openPrintModal(<IntroductionLetter
                                                    setPrintTitle={setPrintTitle} soldierKey={key}/>)}
                                        >نامه معرفی به یگان</Button>
                                        <Button type={"primary"} block={true}
                                                onClick={() => openPrintModal(<Admission setPrintTitle={setPrintTitle}
                                                                                         soldierKey={key}/>)}
                                        >

                                            پذیرش</Button>
                                        <Button type={"primary"} block={true}
                                                onClick={() => openPrintModal(<SoldierFolderLabel
                                                    setPrintTitle={setPrintTitle} soldierKey={key}/>)}
                                        >
                                            لیبل پرونده</Button>
                                    </Flex>
                                    <Flex vertical={false} style={{width: "100%"}} gap={"middle"}>
                                        <Button type={"primary"} block={true}
                                                onClick={() => openPrintModal(<StatusSummery
                                                    setPrintTitle={setPrintTitle} soldierKey={key}/>)}
                                        >
                                            خلاصه وضعیت
                                        </Button>
                                        <Button type={"primary"} block={true}
                                                onClick={() => openPrintModal(<EmploymentCertificate
                                                    setPrintTitle={setPrintTitle} soldierKey={key}/>)}
                                        >
                                            گواهی اشتغال
                                        </Button>
                                        <Button type={"primary"} block={true}>گردشکار سنواتی</Button>
                                    </Flex>
                                </Flex>
                            </Card>
                            <Card title={"اقدام"} style={{width: "100%"}}>
                                <Flex style={{width: "100%"}} vertical={true} gap={"middle"}>
                                    <Flex vertical={false} style={{width: "100%"}} gap={"middle"}>
                                        <Button type={"primary"} block={true}
                                                onClick={() => navigate(`/soldier-release/${key}`)}>تسویه حساب</Button>
                                        <Button type={"primary"} block={true}>ترفیع</Button>
                                    </Flex>
                                    <Flex vertical={false} style={{width: "100%"}} gap={"middle"}>
                                        <Button type={"primary"} block={true}>درخواست بومی/غیر بومی</Button>
                                        <Button type={"primary"} block={true}
                                                onClick={() => openPrintModal(<AccidentComission
                                                    setPrintTitle={setPrintTitle} soldierKey={key}/>)}
                                        >صورت جلسه سانحه</Button>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Flex>
                    </Drawer>

                    <Card style={{width: showMore ? "1100px" : "800px"}}>

                        <Flex vertical={false} align={"center"} gap={15}>
                            <Flex vertical={true} gap={20}>
                                <Badge.Ribbon text={targetSoldier["status"]}
                                              color={getStatusColor(targetSoldier["status"])} placement={"start"}>
                                    {
                                        targetSoldier["profile"] === "" || targetSoldier["profile"] === null || targetSoldier["profile"] === undefined
                                            ?
                                            <Avatar shape="square" size={200} icon={<UserOutlined/>}/>
                                            :
                                            <Image shape="square" width={180}
                                                   src={getApiUrl("files/serve_file/" + targetSoldier["profile"])}/>
                                    }
                                </Badge.Ribbon>

                                {
                                    showMore
                                        ?
                                        targetSoldier["normalized_profile"] === "" || targetSoldier["normalized_profile"] === null || targetSoldier["normalized_profile"] === undefined
                                            ?
                                            <Avatar shape="square" size={200} icon={<UserOutlined/>}/>
                                            :
                                            <Image shape="square" width={180}
                                                   src={getApiUrl("files/serve_file/" + targetSoldier["normalized_profile"])}/>
                                        :
                                        null

                                }

                                <Button type="link" icon={<EditOutlined/>}
                                        onClick={() => navigate(`/edit-soldier/${key}`)}>ویرایش اطلاعات</Button>
                                <Button type="primary" onClick={() => setOpenDrawer(true)}>اقدامات</Button>
                            </Flex>

                            <Divider type={"vertical"} style={{height: "350px"}}/>

                            <Flex vertical={true} gap={20} style={{width: "100%"}}>

                                <Table showHeader={false} pagination={false}
                                       dataSource=
                                           {
                                               [
                                                   {
                                                       0: "نام و نشان:",
                                                       1: <Popover trigger={"click"}
                                                                   content={[targetSoldier["military_rank"], "و", targetSoldier["first_name"], targetSoldier["last_name"], "ش ملی:", targetSoldier["national_code"], "اعزامی:", DateRenderer(targetSoldier["deployment_date"])].join(" ")}>{targetSoldier["first_name"] + " " + targetSoldier["last_name"]}</Popover>
                                                   },
                                                   {0: "درجه:", 1: targetSoldier["military_rank"]},
                                                   {0: "کد ملی:", 1: targetSoldier["national_code"]},
                                                   {
                                                       0: "تاریخ اعزام:",
                                                       1: DateRenderer(targetSoldier["deployment_date"])
                                                   },
                                                   {
                                                       0: "گروه خدمتی:",
                                                       1: DutyGroupRenderer(targetSoldier["duty_group"])
                                                   },
                                                   {0: "مدت خدمت:", 1: targetSoldier["duty_duration"]},
                                                   {
                                                       0: "تاریخ ترخیص قانونی:",
                                                       1: <>{DateRenderer(targetSoldier["legal_release_date"])}
                                                           <ShouldWarnOnReleaseDate/> </>
                                                   },
                                                   {
                                                       0: "تاریخ ترخیص کل:",
                                                       1: <>{DateRenderer(targetSoldier["overall_release_date"])}
                                                           <ShouldWarnOnReleaseDate/> </>
                                                   },
                                                   {
                                                       0: "یگان - قسمت:",
                                                       1: targetSoldier["unit"] + " - " + targetSoldier["section"]
                                                   },
                                                   {0: "شماره پرونده:", 1: targetSoldier["folder_number"]},
                                               ]
                                           }
                                       columns=
                                           {
                                               [
                                                   {key: 0, dataIndex: 0, align: "start"},
                                                   {key: 1, dataIndex: 1, align: "end"}
                                               ]
                                           }
                                />
                                {
                                    showMore
                                        ?
                                        <>
                                            <Collapse items={collapseItems}/>
                                        </>
                                        :
                                        null

                                }

                                <Flex justify={"center"}>
                                    <Button type={"primary"} onClick={() => {
                                        setShowMore(!showMore)
                                    }}>{showMore ? "مشاهده کمتر" : "مشاهده بیشتر"}</Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Card>
                </Flex>
            }
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
                            validator: justNumericValidator
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                </>
            }
            selectedSoldierProject={
                {}
            }
            setSoldierOid={setKey}
            setSelectedSoldierState={setTargetSoldier}
        />
    );
}

export default SearchSoldier;