import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {
    Avatar,
    Button,
    Col,
    Divider,
    Flex, Form,
    Image, Input,
    Modal,
    notification,
    Row, Select,
    Spin,
    Tabs,
    Tag,
    Typography, Upload
} from "antd";
import {PlusOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";
import {
    BooleanFieldForm,
    InputFieldForm,
    NumberFieldForm, PairedSelectFieldForm,
    SelectFieldForm, TagSelectFieldForm
} from "../../utils/SingleFieldForm.jsx";
import {
    dateValidator,
    justNumericValidator,
    justStringValidator, passAnywayValidator,
    registerNationalCodeValidator
} from "../../utils/Validates.js";
import {GetDutyDuration} from "../../utils/Calculative.js";
import {DateRenderer, NativeRenderer} from "../../utils/TableRenderer.jsx";
import {getTagColor} from "../../utils/Color.js";
import {getApiUrl} from "../../utils/Config.js";
import axios from "axios";

function EditSoldier() {
    const params = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [normalizeHidden, setNormalizeHidden] = useState(true);
    const [disableOkModal, setDisableOkModal] = useState(true);
    const [profileImage, setProfileImage] = useState("");
    const [normalizeImage, setNormalizeImage] = useState("");
    const [soldier, setSoldier] = useState({"family": []});
    const [modalHelpText, setModalHelpText] = useState("لطفا چشم اول را انتخاب کنید.");
    const [firstEye, setFirstEye] = useState([]);
    const [secondEye, setSecondEye] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [familyActiveTab, setFamilyActiveTab] = useState(0);
    const [relation, setRelation] = useState([]);
    const [removeFamilyConfirmModal, removeFamilyConfirmContextHolder] = Modal.useModal();
    const inputProfile = useRef(null);

    useEffect(() => {
        axios.get(getApiUrl("config/relation"), {withCredentials: true})
            .then((response) => {
                let res = response.data;
                let temp = [];
                res.config.forEach((value) => {
                    temp.push({
                        value: value,
                        label: value
                    });
                });
                setRelation(temp);
            })
            .catch(() => {
                api["error"]({
                    message: "خطا",
                    description: "خطا در دریافت تنظیمات خانواده!"
                });
            });
    }, []);

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    function fetchData() {
        axios.post(getApiUrl("soldier/list"), {
            "filter":
                {
                    "_id":
                        {
                            "$oid": params.key
                        }
                }
            ,
            "projection":
                {
                    "profile": 1,
                    "normalized_profile": 1,
                    "status": 1,
                    "first_name": 1,
                    "last_name": 1,
                    "national_code": 1,
                    "deployment_date": 1,
                    "military_rank": 1,
                    "father_name": 1,
                    "legal_release_date": 1,
                    "overall_release_date": 1,
                    "unit": 1,
                    "section": 1,
                    "birthday": 1,
                    "birthplace": 1,
                    "birth_certificate_issuing_place": 1,
                    "family": 1,
                    "bank_account": 1,
                    "additional_service_day": 1,
                    "entry_date": 1,
                    "personnel_code": 1,
                    "order_number": 1,
                    "done_service_day": 1,
                    "extra_info": 1,
                    "previous_unit": 1,
                    "field_of_study": 1,
                    "education": 1,
                    "skill": 1,
                    "skill_to_learn": 1,
                    "mental_health": 1,
                    "blood_type": 1,
                    "eye_color": 1,
                    "height": 1,
                    "address_street": 1,
                    "address_house_number": 1,
                    "address_home_unit": 1,
                    "phone": 1,
                    "is_native": 1,
                    "state": 1,
                    "city": 1,
                }

        }, {withCredentials: true})
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
                    });
                    GetDutyDuration(params.key)
                        .then((res) => {
                            let temp = "";
                            temp = `${res.month} ماه و ${res.day} روز`
                            setSoldier((lastValue) => {
                                let newFilter = {...lastValue};
                                newFilter["duty_duration"] = temp;
                                return newFilter;
                            });
                        })
                        .catch((err) => {
                            setSoldier((lastValue) => {
                                let newFilter = {...lastValue};
                                newFilter["duty_duration"] = "err";
                                return newFilter;
                            });
                            api["error"]({
                                message: "خطا", description: err
                            });
                        })

                }
            })
            .catch(() => {
                api["error"]({
                    message: "خطا", description: "خطا در دریافت اطلاعات سرباز"
                });
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    function handleOk() {
        // invoke("set_avatar", {
        //     "oid": params.key,
        //     "profilePath": profileImage,
        //     "normalizedProfilePath": normalizeImage
        // }).then((res) => {
        //     api["success"]({
        //         message: "انجام شد",
        //         description: "پروفایل با موفقیت بروز شد!"
        //     });
        //     fetchData();
        // }).catch((err) => {
        //     api["error"]({
        //         message: "خطا",
        //         description: err
        //     });
        // })
        setIsModalOpen(false);
    }

    function handleCancel() {
        setIsModalOpen(false);
        resetData();
    }

    function resetData() {
        // reset data
        setProfileImage("");
        setNormalizeImage("");
        setNormalizeHidden(true);
        setFirstEye([]);
        setSecondEye([]);
        setModalHelpText("لطفا چشم اول را انتخاب کنید.");
    }

    function uploadProfile(e) {
        console.log(e);
        // inputProfile.current.click();
        // open({multiple: false, directory: false, extensions: ['jpg', 'jpeg']})
        //     .then((res) => {
        //         resetData();
        //         if (res === null) {
        //             return;
        //         }
        //
        //         invoke("profile_image_to_base64", {"path": res.path})
        //             .then((res) => {
        //                 setProfileImage(res);
        //                 setIsModalOpen(true);
        //             })
        //             .catch((err) => {
        //                 api["error"]({
        //                     message: "خطا",
        //                     description: err
        //                 });
        //             })
        //     })
        //     .catch((err) => {
        //         api["error"]({
        //             message: "خطا",
        //             description: err
        //         });
        //     });
    }

    function onImageClick(event) {
        console.log([event.nativeEvent.offsetX, event.nativeEvent.offsetY]);
        if (firstEye.length === 0) {
            setFirstEye([event.nativeEvent.offsetX, event.nativeEvent.offsetY]);
            setModalHelpText("لطفا چشم دوم را انتخاب کنید.");
        } else if (secondEye.length === 0) {
            setSecondEye([event.nativeEvent.offsetX, event.nativeEvent.offsetY]);
            setModalHelpText("لطفا پس زمینه را انتخاب کنید.");
        } else {
            axios.post(getApiUrl(`soldier/normalize_avatar/${params.key}`), {
                "first_eye": firstEye,
                "second_eye": secondEye,
                "background": [event.nativeEvent.offsetX, event.nativeEvent.offsetY]
            }, {withCredentials: true})
                .then((res) => {
                    fetchData();
                    setNormalizeHidden(false);
                    setIsModalOpen(true);
                    setDisableOkModal(false);
                    setFirstEye([]);
                    setSecondEye([]);
                    setModalHelpText("اگر نرمالایز قابل قبول نیست میتوانید با کلیک مجدد بر روی اولین چشم از نو نرمالایز کنید.");
                })
                .catch((err) => {
                    api["error"]({
                        message: "خطا",
                        description: err.response.data
                    });
                    resetData();
                })
        }
    }

    function onConfirmEditSingleForm(db_key, value, type, needCalculate) {
        console.log(db_key, value);
        let temp = {}
        temp[db_key] = value;
        axios.post(getApiUrl(`soldier/edit_soldier/${params.key}`), {
            "update": temp,
            "type": type,
            "need_calculate": needCalculate
        }, {withCredentials: true}).then(() => {
            fetchData();
        }).catch((err) => {
            api["error"]({
                message: "خطا",
                description: err.data.message,
            });
        })
    }

    function onFamilyTabEdit(targetKey, action) {
        if (action === "remove") {
            let temp = [];
            soldier["family"].forEach((value, index) => {
                if (index !== targetKey) {
                    temp.push(value);
                }
            })
            removeFamilyConfirmModal.confirm({
                title: "اخطار",
                content: <Typography.Text>آیا مایل به حذف هستید؟</Typography.Text>
            }).then((isConfirmed) => {
                if (isConfirmed) {
                    onConfirmEditSingleForm("family", temp, "arr", true);
                }
            }).catch((err) => {
                api["error"]({
                    message: "خطا",
                    description: err
                });
            })
        }
    }

    function uploadChange(e) {
        console.log(e);
        if (e.file.status === "done") {
            fetchData();
            setIsModalOpen(true);
        }
    }

    return (
        <Flex vertical={true}>
            {contextHolder}
            <Modal title="آپلود پروفایل" open={isModalOpen} onOk={handleOk} width={800}
                   cancelButtonProps={{hidden: true}}
                   okButtonProps={{
                       disabled: disableOkModal,
                   }}>
                <Flex align={"center"} justify={"center"} gap={"small"}>
                    <Typography.Text>{modalHelpText}</Typography.Text>
                </Flex>
                <Flex align={"center"} justify={"center"} gap={"small"}>
                    <img src={getApiUrl("files/serve_file/" + soldier["profile"])} alt={"err"} width={300} height={400}
                         onClick={onImageClick}/>
                    <img src={getApiUrl("files/serve_file/" + soldier["normalized_profile"])} alt={"err"} width={300}
                         height={400}
                         hidden={normalizeHidden}/>
                </Flex>
            </Modal>

            <Divider orientation={"left"}>ویرایش عکس<Upload
                action={getApiUrl(`soldier/set_avatar/${params.key}`)}
                name={"profile"} withCredentials={true} showUploadList={false} onChange={uploadChange}
                beforeUpload={(file) => {
                    const isJPG = file.type === 'image/jpeg';
                    if (!isJPG) {
                        api.error({
                            message: "خطا",
                            description: "فقط فرمت jpg مورد قبول است!"
                        });
                    }
                    return isJPG || Upload.LIST_IGNORE;
                }}
            ><Button type={"text"} icon={<UploadOutlined/>}/></Upload></Divider>
            <Flex vertical={false} justify={"center"} align={"center"} gap={"small"}>
                {
                    soldier["profile"] === null || soldier["profile"] === undefined || soldier["profile"] === ""
                        ?
                        <Avatar shape="square" size={180} icon={<UserOutlined/>}/>
                        :
                        <Image shape="square" width={180}
                               src={getApiUrl("files/serve_file/" + soldier["profile"])}/>
                }
                {
                    soldier["profile"] === null || soldier["profile"] === undefined || soldier["profile"] === ""
                        ?
                        <Avatar shape="square" size={180} icon={<UserOutlined/>}/>
                        :
                        <Image shape="square" width={180}
                               src={getApiUrl("files/serve_file/" + soldier["normalized_profile"])}/>
                }
            </Flex>


            <Divider orientation={"left"}>اطلاعات فردی</Divider>

            <Row gutter={24} justify={"center"} align={"stretch"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <InputFieldForm label={"نام"} validator={justStringValidator} initValue={soldier["first_name"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("first_name", v, "str", false)}/>,
                        <InputFieldForm label={"نشان"} validator={justStringValidator} initValue={soldier["last_name"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("last_name", v, "str", false)}/>,
                        <InputFieldForm label={"کد ملی"} validator={registerNationalCodeValidator}
                                        initValue={soldier["national_code"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("national_code", v, "str", false)}/>
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={10} style={{width: "400px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>
            <Row gutter={24} justify={"center"} align={"bottom"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <InputFieldForm label={"محل تولد"} validator={justStringValidator}
                                        initValue={soldier["birthplace"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("birthplace", v, "str", false)}/>,
                        <InputFieldForm label={"تاریخ تولد"} validator={dateValidator}
                                        initValue={DateRenderer(soldier["birthday"])}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("birthday", v, "date", false)}/>,
                        <InputFieldForm label={"محل صدور شناسنامه"} validator={justStringValidator}
                                        initValue={soldier["birth_certificate_issuing_place"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("birth_certificate_issuing_place", v, "str", false)}/>
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={10} style={{width: "400px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>

            <Tabs
                activeKey={familyActiveTab}
                onChange={(newKey) => setFamilyActiveTab(newKey)}
                type="editable-card"
                hideAdd
                onEdit={onFamilyTabEdit}
                items={[
                    ...soldier["family"].map((elem, index) => {
                        return {
                            label: elem["relative"],
                            key: index,
                            children: <>
                                <Row gutter={24} justify={"center"} align={"stretch"}
                                     style={{height: "70px", marginTop: "10px"}}>
                                    {
                                        [
                                            <InputFieldForm label={"نام و نشان"} validator={justStringValidator}
                                                            initValue={elem["full_name"]}
                                                            onConfirmEdit={(v) => onConfirmEditSingleForm(`family.${index}.full_name`, v, "str", false)}/>,
                                            <InputFieldForm label={"نام پدر"} validator={justStringValidator}
                                                            initValue={elem["father_name"]}
                                                            onConfirmEdit={(v) => onConfirmEditSingleForm(`family.${index}.father_name`, v, "str", false)}/>,
                                            <InputFieldForm label={"کد ملی"} validator={registerNationalCodeValidator}
                                                            initValue={elem["national_code"]}
                                                            onConfirmEdit={(v) => onConfirmEditSingleForm(`family.${index}.national_code`, v, "str", false)}/>
                                        ].map((elem, index, array) => {
                                            return (
                                                <Col gutter={10} style={{width: "400px"}}>
                                                    {elem}
                                                </Col>
                                            );
                                        })
                                    }
                                </Row>
                                <Row gutter={24} justify={"center"} align={"stretch"}
                                     style={{height: "70px", marginTop: "10px"}}>
                                    {
                                        [
                                            <InputFieldForm label={"محل صدور شناسنامه"} validator={justStringValidator}
                                                            initValue={elem["birth_certificate_issuing_place"]}
                                                            onConfirmEdit={(v) => onConfirmEditSingleForm(`family.${index}.birth_certificate_issuing_place`, v, "str", false)}/>,
                                            <InputFieldForm label={"شغل"} validator={justStringValidator}
                                                            initValue={elem["job"]}
                                                            onConfirmEdit={(v) => onConfirmEditSingleForm(`family.${index}.job`, v, "str", false)}/>,
                                            <br/>
                                        ].map((elem, index, array) => {
                                            return (
                                                <Col gutter={10} style={{width: "400px"}}>
                                                    {elem}
                                                </Col>
                                            );
                                        })
                                    }
                                </Row>
                            </>
                        };
                    }),
                    {
                        label: <PlusOutlined/>,
                        key: "add",
                        closable: false,
                        children: <>
                            <Form
                                onFinish={(form) => {
                                    onConfirmEditSingleForm("family", [...soldier["family"], form], "arr", true);
                                }}
                            >
                                <Row gutter={8}>
                                    <Col flex={1}>
                                        <Form.Item
                                            name={'full_name'}
                                            rules={[{
                                                validator: justStringValidator, required: true,
                                            },]}
                                        >
                                            <Input placeholder="نام و نشان"/>
                                        </Form.Item>
                                    </Col>
                                    <Col flex={1}>
                                        <Form.Item
                                            name={'father_name'}
                                            rules={[{
                                                validator: justStringValidator, required: true,
                                            },]}
                                        >
                                            <Input placeholder="نام پدر"/>
                                        </Form.Item>
                                    </Col>
                                    <Col flex={1}>
                                        <Form.Item
                                            name={'national_code'}
                                            rules={[{
                                                validator: registerNationalCodeValidator
                                            },]}
                                        >
                                            <Input placeholder="کد ملی"/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={8}>
                                        <Form.Item
                                            name={'birth_certificate_issuing_place'}
                                            rules={[{
                                                validator: justStringValidator
                                            },]}
                                        >
                                            <Input placeholder="محل صدور شناسنامه"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name={'job'}
                                            rules={[{
                                                validator: justStringValidator, required: true,
                                            },]}
                                        >
                                            <Input placeholder="شغل"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                            <Form.Item
                                                name={'relative'}
                                                rules={[{
                                                    required: true,
                                                    message: "فیلد نسبت اجباریست."
                                                },]}
                                            >
                                                <Select
                                                    style={{width: "100%"}}
                                                    showSearch
                                                    filterOption={filterOption}
                                                    placeholder={"نسبت"}
                                                    options={relation}
                                                    loading={relation.length === 0}
                                                />
                                            </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" block={true}>
                                                افزودن
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </>
                    }
                ]}
            />

            <Divider orientation={"left"}>اطلاعات خدمتی</Divider>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <InputFieldForm label={"تاریخ اعزام"} validator={dateValidator}
                                        initValue={DateRenderer(soldier["deployment_date"])}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("deployment_date", v, "date", true)}/>,
                        <SelectFieldForm label={"درجه"} configName={"rank"} initValue={soldier["military_rank"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("military_rank", v, "str", false)}/>,
                        <NumberFieldForm label={"سنوات"} addonAfter={"روز"}
                                         initValue={soldier["additional_service_day"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("additional_service_day", v, "int", true)}/>,
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={10} style={{width: "400px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <InputFieldForm label={"کد پرسنلی"} validator={passAnywayValidator}
                                        initValue={soldier["personnel_code"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("personnel_code", v, "str", false)}/>,
                        <InputFieldForm label={"تاریخ ورود"} validator={dateValidator}
                                        initValue={DateRenderer(soldier["entry_date"])}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("entry_date", v, "date", false)}/>,
                        <InputFieldForm label={"شماره امریه"} validator={passAnywayValidator}
                                        initValue={soldier["order_number"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("order_number", v, "str", false)}/>,
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={10} style={{width: "400px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                <Col gutter={10} style={{width: "400px"}}>
                    <NumberFieldForm label={"سابقه خدمت پیشین"} addonAfter={"روز"}
                                     initValue={soldier["done_service_day"]}
                                     onConfirmEdit={(v) => onConfirmEditSingleForm("done_service_day", v, "int", true)}/>
                </Col>
                <Col gutter={20} style={{width: "800px"}}>
                    <PairedSelectFieldForm label={"یگان و قسمت"} configName={"unit"} initParentValue={soldier["unit"]}
                                           initChildValue={soldier["section"]} onConfirmEdit={(p, c) => {
                        onConfirmEditSingleForm("unit", p, "str", false);
                        onConfirmEditSingleForm("section", c, "str", false);
                    }}/>
                </Col>
            </Row>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <SelectFieldForm label={"یگان پیشین"} configName={"previous-unit"}
                                         initValue={soldier["previous_unit"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("previous_unit", v, "str", false)}/>,
                        <InputFieldForm notEditable label={"تاریخ ترخیص قانونی"} validator={dateValidator}
                                        initValue={DateRenderer(soldier["legal_release_date"])}/>,
                        <InputFieldForm notEditable label={"تاریخ ترخیص کل"} validator={dateValidator}
                                        initValue={DateRenderer(soldier["overall_release_date"])}/>,
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={10} style={{width: "400px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                <Col gutter={10} style={{width: "400px"}}>
                    <InputFieldForm label={"شماره حساب"} validator={passAnywayValidator}
                                    initValue={soldier["bank_account"]}
                                    onConfirmEdit={(v) => onConfirmEditSingleForm("bank_account", v, "str", false)}/>
                </Col>
                <Col gutter={30} style={{width: "800px"}}>
                    <TagSelectFieldForm options={[
                        {label: <Tag color={getTagColor("انتقالی")}>انتقالی</Tag>, value: "انتقالی"},
                        {label: <Tag color={getTagColor("دوره کد")}>دوره کد</Tag>, value: "دوره کد"},
                        {label: <Tag color={getTagColor("معاف از رزم")}>معاف از رزم</Tag>, value: "معاف از رزم"},
                        {label: <Tag color={getTagColor("مامور")}>مامور</Tag>, value: "مامور"},
                    ]} label={"اطلاعات بیشتر"} initValue={soldier["extra_info"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("extra_info", v, "arr", false)}/>
                </Col>
            </Row>

            <Divider orientation={"left"}>مهارت</Divider>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <SelectFieldForm addable label={"تحصیلات"} configName={"education"}
                                         validator={justStringValidator} initValue={soldier["education"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("education", v, "str", false)}/>,
                        <SelectFieldForm addable label={"رشته تحصیلی"} configName={"field-of-study"}
                                         validator={justStringValidator} initValue={soldier["field_of_study"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("field_of_study", v, "str", false)}/>,
                        <InputFieldForm label={"مهارت"} validator={justStringValidator} initValue={soldier["skill"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("skill", v, "str", false)}/>,
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={10} style={{width: "400px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <InputFieldForm label={"یادگیری مهارت"} validator={justStringValidator}
                                        initValue={soldier["skill_to_learn"]}
                                        onConfirmEdit={(v) => onConfirmEditSingleForm("skill_to_learn", v, "str", false)}/>,
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={20} style={{width: "1200px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>

            <Divider orientation={"left"}>اطلاعات پزشکی</Divider>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <SelectFieldForm label={"سلامت روان"} configName={"mental-health"}
                                         validator={justStringValidator} initValue={soldier["mental_health"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("mental_health", v, "str", false)}/>,
                        <SelectFieldForm label={"گروه خون"} configName={"blood-type"} validator={passAnywayValidator}
                                         initValue={soldier["blood_type"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("blood_type", v, "str", false)}/>,
                        <SelectFieldForm label={"رنگ چشم"} configName={"eye-color"} validator={justStringValidator}
                                         initValue={soldier["eye_color"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("eye_color", v, "str", false)}/>,
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={10} style={{width: "400px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                {
                    [
                        <NumberFieldForm addonAfter={"سانتی متر"} label={"قد"} initValue={soldier["height"]}
                                         onConfirmEdit={(v) => onConfirmEditSingleForm("height", v, "int", false)}/>,
                    ].map((elem, index, array) => {
                        return (
                            <Col gutter={20} style={{width: "1200px"}}>
                                {elem}
                            </Col>
                        );
                    })
                }
            </Row>

            <Divider orientation={"left"}>آدرس</Divider>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                <Col gutter={10} style={{width: "400px"}}>
                    <BooleanFieldForm label={"بومی/غیر بومی"} initLabel={NativeRenderer(soldier["is_native"])}
                                      initValue={soldier["is_native"]} trueLabel={"بومی"} falseLabel={"غیر بومی"}
                                      onConfirmEdit={(v) => onConfirmEditSingleForm("is_native", v, "bool", true)}/>
                </Col>
                <Col gutter={20} style={{width: "800px"}}>
                    <PairedSelectFieldForm label={"استان و شهر"} configName={"state"} initParentValue={soldier["state"]}
                                           initChildValue={soldier["city"]} onConfirmEdit={(p, c) => {
                        onConfirmEditSingleForm("state", p, "str", false);
                        onConfirmEditSingleForm("city", c, "str", false);
                    }}/>
                </Col>
            </Row>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                <Col gutter={12} style={{width: "400px"}}>
                    <InputFieldForm label={"خیابان"} validator={passAnywayValidator}
                                    initValue={soldier["address_street"]}
                                    onConfirmEdit={(v) => onConfirmEditSingleForm("address_street", v, "str", false)}/>
                </Col>
                <Col gutter={4} style={{width: "400px"}}>
                    <InputFieldForm label={"پلاک"} validator={passAnywayValidator}
                                    initValue={soldier["address_house_number"]}
                                    onConfirmEdit={(v) => onConfirmEditSingleForm("address_house_number", v, "str", false)}/>
                </Col>
                <Col gutter={4} style={{width: "400px"}}>
                    <InputFieldForm label={"واحد"} validator={passAnywayValidator}
                                    initValue={soldier["address_home_unit"]}
                                    onConfirmEdit={(v) => onConfirmEditSingleForm("address_home_unit", v, "str", false)}/>
                </Col>
            </Row>
            <Row gutter={24} justify={"center"} align={"top"} style={{height: "70px", marginTop: "10px"}}>
                <Col gutter={3} style={{width: "1200px"}}>
                    <InputFieldForm label={"تلفن"} validator={justNumericValidator} initValue={soldier["phone"]}
                                    onConfirmEdit={(v) => onConfirmEditSingleForm("phone", v, "str", false)}/>
                </Col>
            </Row>
            {removeFamilyConfirmContextHolder}

        </Flex>
    )

}

export default EditSoldier;