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
    notification,
    Table,
    Tooltip,
    Typography
} from "antd";
import {justStringValidator, nationalCodeValidator} from "../../utils/Validates.js";
import {getStatusColor} from "../../utils/Color.js";
import {useState} from "react";
import {DateRenderer, DutyGroupRenderer, ExtraInfoRenderer, NativeRenderer} from "../../utils/TableRenderer.jsx";
import {EditOutlined, UserOutlined, WarningTwoTone} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import SearchSelect from "../../layouts/SearchSelect.jsx";
import StatusSummery from "../Print/soldierProfile/StatusSummery.jsx";
import Admission from "../Print/soldierProfile/Admission.jsx";
import IntroductionLetter from "../Print/soldierProfile/IntroductionLetter.jsx";
import EmploymentCertificate from "../Print/soldierProfile/EmploymentCertificate.jsx";
import SoldierFolderLabel from "../Print/soldierProfile/SoldierFolderLabel.jsx";
import {getApiUrl} from "../../utils/Config.js";

function SearchSoldier() {

    const [targetSoldier, setTargetSoldier] = useState({"family": []});
    const [key, setKey] = useState("");
    const [showMore, setShowMore] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [printTarget, setPrintTarget] = useState(<div>printable</div>);
    const [printTitle, setPrintTitle] = useState("تیتر پرینت");


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
                                <Table style={{width: "100%"}} bordered={true} pagination={false} dataSource={[value]} columns={[
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
                                        <Button type={"primary"} block={true} onClick={() => navigate(`/soldier-release/${key}`)}>تسویه حساب</Button>
                                        <Button type={"primary"} block={true}>ترفیع</Button>
                                    </Flex>
                                    <Flex vertical={false} style={{width: "100%"}} gap={"middle"}>
                                        <Button type={"primary"} block={true}>درخواست بومی/غیر بومی</Button>
                                        <Button type={"primary"} block={true}>صورت جلسه صانحه</Button>
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
                                                       1: targetSoldier["first_name"] + " " + targetSoldier["last_name"]
                                                   },
                                                   {0: "درجه:", 1: targetSoldier["military_rank"]},
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
                                                   {0: "یگان:", 1: targetSoldier["unit"]},
                                                   {0: "قسمت:", 1: targetSoldier["section"]},
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
                            validator: nationalCodeValidator
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                </>
            }
            selectedSoldierProject={
                {
                    "profile": 1,
                    "normalized_profile": 1,
                    "status": 1,
                    "first_name": 1,
                    "last_name": 1,
                    "national_code": 1,
                    "deployment_date": 1,
                    "duty_group": 1,
                    "military_rank": 1,
                    "father_name": 1,
                    "legal_release_date": 1,
                    "overall_release_date": 1,
                    "unit": 1,
                    "section": 1,
                    "birthplace": 1,
                    "birthday": 1,
                    "birth_certificate_issuing_place": 1,
                    "bank_account": 1,
                    "family": 1,
                    "religion": 1,
                    "additional_service_day": 1,
                    "done_service_day": 1,
                    "personnel_code": 1,
                    "entry_date": 1,
                    "order_number": 1,
                    "previous_unit": 1,
                    "extra_info": 1,
                    "education": 1,
                    "field_of_study": 1,
                    "skill": 1,
                    "skill_to_learn": 1,
                    "mental_health": 1,
                    "blood_type": 1,
                    "eye_color": 1,
                    "height": 1,
                    "state": 1,
                    "city": 1,
                    "address_street": 1,
                    "address_house_number": 1,
                    "address_home_unit": 1,
                    "phone": 1,
                    "is_native": 1,
                    "address": 1,
                    "folder_number": 1,
                }
            }
            setSoldierOid={setKey}
            setSelectedSoldierState={setTargetSoldier}
        />
    );
}

export default SearchSoldier;