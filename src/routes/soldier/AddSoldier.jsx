import {
    Alert,
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    notification,
    Radio,
    Row,
    Select,
    Space
} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {
    dateValidator,
    justNumericValidator,
    justStringValidator, passAnywayValidator,
    registerNationalCodeValidator
} from "../../utils/Validates.js";
import {useEffect, useState} from "react";
import {PairedSelect} from "../../components/Inputs.jsx";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";
import {InputDatePicker} from "jalaali-react-date-picker"
import "jalaali-react-date-picker/lib/styles/index.css";

function AddSoldier() {
    const [isDirty, setIsDirty] = useState(false);

    // Change isDirty to true whenever the form is modified
    const onFormChange = () => {
        setIsDirty(true);
    };

    const [familyEmptyError, setFamilyEmptyError] = useState(false);
    const [religion, setReligion] = useState([]);
    const [relation, setRelation] = useState([]);
    const [rank, setRank] = useState([]);
    const [organizationJob, setOrganizationJob] = useState([]);
    const [organizationJobOption, setOrganizationJobOption] = useState([]);
    const [previousUnit, setPreviousUnit] = useState([]);
    const [unitAndSections, setUnitAndSections] = useState([]);
    const [stateAndCity, setStateAndCity] = useState([]);
    const [education, setEducation] = useState([]);
    const [fieldOfStudy, setFieldOfStudy] = useState([]);
    const [bloodType, setBloodType] = useState([]);
    const [mentalHealth, setMentalHealth] = useState([]);
    const [eyeColor, setEyeColor] = useState([]);
    const [selectedOrganizationJob, setSelectedOrganizationJob] = useState([]);
    const [api, contextHolder] = notification.useNotification();

    const [form] = Form.useForm();

    // Attach the event listener
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // Chrome requires returnValue to be set
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    useEffect(() => {
        const configs = [
            {configName: "religion", setData: setReligion},
            {configName: "relation", setData: setRelation},
            {configName: "rank", setData: setRank},
            {configName: "previous-unit", setData: setPreviousUnit},
            {configName: "education", setData: setEducation},
            {configName: "field-of-study", setData: setFieldOfStudy},
            {configName: "blood-type", setData: setBloodType},
            {configName: "mental-health", setData: setMentalHealth},
            {configName: "eye-color", setData: setEyeColor},
        ];

        configs.forEach(({configName, setData}) => {
            axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
                .then((response) => {
                    let temp = [];
                    response.data.config.forEach((value) => {
                        temp.push({
                            value: value,
                            label: value
                        });
                    });
                    setData(temp);
                })
                .catch((err) => {
                    api["error"]({
                        message: "خطا",
                        description: err.message
                    });
                });
        });

        axios.get(getApiUrl("config/unit"), {withCredentials: true})
            .then((res) => {
                setUnitAndSections(res.data.config);
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا",
                    description: err.message
                });
            });
        axios.get(getApiUrl("config/state"), {withCredentials: true})
            .then((res) => {
                setStateAndCity(res.data.config);
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا",
                    description: err.message
                });
            });
        axios.get(getApiUrl("config/organization-job"), {withCredentials: true})
            .then((res) => {
                let temp = [];
                res.data.config.forEach((v) => {
                    axios.post(getApiUrl("soldier/list"), {
                        
                        "filter": {
                            "organization_job": {
                                "$elemMatch": {
                                    "unit_title": v["unit_title"],
                                    "job_title": v["job_title"],
                                }
                            }
                        },
                        "projection": {
                            "national_code": 1,
                            "organization_job": 1
                        }

                    }, {withCredentials: true}).then((res) => {

                        temp.push({
                            ...v,
                            "count": res.data.length
                        })
                    }).catch((err) => {
                        api["error"]({
                            message: "خطا",
                            description: err.message
                        });
                    });
                })
                setOrganizationJob(temp);
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا در دریافت شغل سازمانی",
                    description: err.message
                });
            });
    }, []);

    function rankChange() {
        const selectedRank = form.getFieldValue("military_rank");
        let temp = [];
        organizationJob.forEach((v, i) => {
            if (v["allow_ranks"].includes(selectedRank)) {
                temp.push({
                    label: v["unit_title"] + " - " + v["job_title"],
                    value: i,
                    data: v
                })
            }
        });
        setOrganizationJobOption(temp);
    }

    function onOrganizationChange(v) {
        setSelectedOrganizationJob([{
            "unit_title": organizationJob[v]["unit_title"],
            "job_title": organizationJob[v]["job_title"]
        }]);
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    function onFinish(v) {
        v["organization_job"] = selectedOrganizationJob;
        if (!v.hasOwnProperty("foreign_travels")) {
            v["foreign_travels"] = [];
        }
        else if (v["foreign_travels"] === undefined) {
            v["foreign_travels"] = [];
        }

        if (v["deployment_date"] && v["deployment_date"].format) {
            v["deployment_date"] = v["deployment_date"].format('jYYYY/jMM/jDD');
        }

        if (v["entry_date"] && v["entry_date"].format) {
            v["entry_date"] = v["entry_date"].format('jYYYY/jMM/jDD');
        }

        axios.post(
            getApiUrl("soldier/register"),
            v,
            {withCredentials: true}
        ).then(() => {
            api["success"]({
                message: "انجام شد.",
                description: "عملیات با موفقیت انجام شد."
            });
        }).catch((err) => {
            api["error"]({
                message: "خطا",
                description: err.message
            });
        });

        setIsDirty(false);
    }

    return (<Flex align={"center"} justify={"center"}>
        {contextHolder}
        <Form
            onFinish={onFinish}
            autoComplete="off"
            onValuesChange={() => onFormChange()}
            form={form} layout={"horizontal"}>
            <Flex gap={"middle"} vertical={true}>
            <Card name="first" title="اطلاعات فردی">
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"نام"}
                            name={"first_name"}
                            rules={[{
                                validator: justStringValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>

                    <Col flex={1}>
                        <Form.Item
                            label={"نشان"}
                            name={"last_name"}
                            rules={[{
                                validator: justStringValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>

                    <Col flex={1}>
                        <Form.Item
                            label={"کد ملی"}
                            name={"national_code"}
                            rules={[{
                                validator: registerNationalCodeValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>

                    <Col flex={1}>
                        <Form.Item
                            label={"محل تولد"}
                            name={"birthplace"}
                            rules={[{
                                validator: justStringValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"تاریخ تولد"}
                            name={"birthday"}
                            rules={[{
                                validator: dateValidator, required: true,
                            }]}
                        >
                            <Input placeholder={"1377/12/20"} />
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"محل صدور شناسنامه"}
                            name={"birth_certificate_issuing_place"}
                            rules={[{
                                validator: justStringValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={8}>

                    <Col flex={1}>
                        <Form.Item
                            label={"دین"}
                            name={"religion"}
                            rules={[{
                                required: true,
                                message: "فیلد دین اجباریست."
                            }]}
                        >
                            <Select
                                showSearch
                                filterOption={filterOption}
                                options={religion}
                                loading={religion.length === 0}
                            />
                        </Form.Item>
                    </Col>

                    <Col flex={1}>
                        <Form.Item
                            label={"شماره حساب بانکی"}
                            name={"bank_account"}
                            rules={[{
                                validator: justNumericValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>

                    <Col flex={1}>
                        <Form.Item
                            label={"نام پدر"}
                            name={"father_name"}
                            rules={[{
                                validator: justStringValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col flex={1}>
                        <Divider>اعضای خانواده</Divider>
                    </Col>
                </Row>

                {familyEmptyError ? <Alert
                    message="خطا"
                    description="اضافه کردن اعضای خانواده اجباری است."
                    type="error"
                    showIcon
                    style={{marginBottom: "8px"}}
                /> : null}

                <Row gutter={8}>
                    <Col span={24}>
                        <Form.List name="family" rules={[{
                            validator: (rule, value) => {
                                if (value === undefined) {
                                    setFamilyEmptyError(true);
                                    return Promise.reject();
                                } else if (value.length === 0) {
                                    setFamilyEmptyError(true);
                                    return Promise.reject();
                                }
                                return Promise.resolve();
                            }, required: true,
                        }]}>
                            {(fields, {add, remove}) => (<>
                                {fields.map(({key, name, ...restField}) => (
                                    <Card style={{marginBottom: "8px", borderColor: "#DBDBDB"}}
                                    >
                                        <Row gutter={8}>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'full_name']}
                                                    rules={[{
                                                        validator: justStringValidator, required: true,
                                                    },]}
                                                >
                                                    <Input placeholder="نام و نام خانوادگی"/>
                                                </Form.Item>
                                            </Col>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'father_name']}
                                                    rules={[{
                                                        validator: justStringValidator, required: true,
                                                    },]}
                                                >
                                                    <Input placeholder="نام پدر"/>
                                                </Form.Item>
                                            </Col>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'national_code']}
                                                    rules={[{
                                                        validator: registerNationalCodeValidator
                                                    },]}
                                                >
                                                    <Input placeholder="کد ملی"/>
                                                </Form.Item>
                                            </Col>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'birthday']}
                                                    rules={[{
                                                        validator: passAnywayValidator
                                                    },]}
                                                >
                                                    <Input placeholder="تاریخ تولد"/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={8}>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'birth_certificate_issuing_place']}
                                                    rules={[{
                                                        validator: justStringValidator
                                                    },]}
                                                >
                                                    <Input placeholder="محل صدور شناسنامه"/>
                                                </Form.Item>
                                            </Col>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'job']}
                                                    rules={[{
                                                        validator: justStringValidator, required: true,
                                                    },]}
                                                >
                                                    <Input placeholder="شغل"/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Flex align={"baseline"}>
                                                    <Col span={23}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'relative']}
                                                            rules={[{
                                                                required: true,
                                                                message: "فیلد نسبت اجباریست."
                                                            },]}
                                                        >
                                                            <Select
                                                                showSearch
                                                                filterOption={filterOption}
                                                                placeholder={"نسبت"}
                                                                options={relation}
                                                                loading={relation.length === 0}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={1}>
                                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                                    </Col>
                                                </Flex>
                                            </Col>
                                        </Row>
                                    </Card>))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => {
                                        setFamilyEmptyError(false);
                                        add();
                                    }} block icon={<PlusOutlined/>}>
                                        اضافه کردن
                                    </Button>
                                </Form.Item>
                            </>)}
                        </Form.List>
                    </Col>
                </Row>
            </Card>
            <Card name="second" title="اطلاعات خدمتی">
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            label={"تاریخ اعزام"}
                            name={"deployment_date"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <InputDatePicker
                                format="jYYYY/jMM/jDD"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={"سابقه خدمت قبلی"}
                            name={"done_service_day"}
                            rules={[{
                                required: true,
                            }]}
                            initialValue={0}
                        >
                            <InputNumber min={0} addonAfter={"روز"} style={{width: "100%"}}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={"اضافه خدمت سنواتی"}
                            name={"additional_service_day"}
                            rules={[{
                                required: true,
                            }]}
                            initialValue={0}
                        >
                            <InputNumber min={0} addonAfter={"روز"} style={{width: "100%"}}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"کد پرسنلی"}
                            name={"personnel_code"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"تاریخ ورود"}
                            name={"entry_date"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <InputDatePicker
                                format="jYYYY/jMM/jDD"
                            />
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"شماره امریه"}
                            name={"order_number"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            label={"درجه"}
                            name={"military_rank"}
                            rules={[{
                                required: true,
                                message: 'فیلد درجه اجباریست.'
                            }]}
                        >
                            <Select
                                showSearch
                                onChange={rankChange}
                                filterOption={filterOption}
                                options={rank}
                                loading={rank.length === 0}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={"شغل سازمانی"}
                            rules={[{
                                required: false,
                                message: 'فیلد درجه اجباریست.'
                            }]}
                        >
                            <Select
                                showSearch
                                filterOption={filterOption}
                                options={organizationJobOption}
                                onChange={onOrganizationChange}
                                loading={organizationJobOption.length === 0}
                                optionRender={(option) => (
                                    <Space
                                        style={{color: parseInt(option.data.data["limit"]) <= parseInt(option.data.data["count"]) ? "red" : "green"}}>
                                        <span>
                                          {option.data.data["unit_title"] + " - " + option.data.data["job_title"] + " | " + option.data.data["count"] + "/" + option.data.data["limit"]}
                                        </span>
                                    </Space>
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"یگان پیشین"}
                            name={"previous_unit"}
                            rules={[{
                                required: true,
                                message: "فیلد یگان پیشین اجباریست."
                            }]}
                        >
                            <Select
                                showSearch
                                filterOption={filterOption}
                                options={previousUnit}
                                loading={previousUnit.length === 0}
                            />
                        </Form.Item>
                    </Col>
                    <PairedSelect
                        data={unitAndSections}
                        parentLabel={"یگان"}
                        parentName={"unit"}
                        ChildLabel={"قسمت"}
                        ChildName={"section"}
                    />
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"یگان آموزشی"}
                            name={"learning_unit"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"حوزه اعزام"}
                            name={"deployment_location"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"تاخیر در معرفی"}
                            name={"initial_absence"}
                            rules={[{
                                required: true,
                            }]}
                            initialValue={0}
                        >
                            <InputNumber min={0} addonAfter={"روز"}/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"گروه خدمتی"}
                            name={"duty_group_data"}
                            rules={[{
                                required: true,
                            }]}
                            initialValue={false}
                        >
                            <Radio.Group size="large">
                                <Radio.Button value={true}>رزمی</Radio.Button>
                                <Radio.Button value={false}>غیر رزمی</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name={"extra_info"}
                            initialValue={[]}
                        >
                            <Checkbox.Group
                                options={[
                                    {label: 'انتقالی', value: 'انتقالی', name: 'transferred'},
                                    {label: 'دوره کد', value: 'دوره کد', name: 'code'},
                                    {label: 'معاف از رزم', value: 'معاف از رزم', name: 'non_combatant'},
                                    {label: 'مامور', value: 'مامور', name: 'dispatched'},
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <br/>
            </Card>
            <Card name="third" title="مهارت">
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"تحصیلات"}
                            name={"education"}
                            rules={[{
                                required: true,
                                message: "فیلد تحصیلات اجباریست."
                            }]}
                        >
                            <Select
                                mode={"tags"}
                                showSearch
                                options={education}
                                loading={education.length === 0}
                                maxCount={1}
                            />
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"رشته تحصیلی"}
                            name={"field_of_study"}
                            rules={[{
                                required: true,
                                message: "فیلد رشته تحصیلی اجباریست."
                            }]}
                        >
                            <Select
                                mode={"tags"}
                                showSearch
                                options={fieldOfStudy}
                                loading={fieldOfStudy.length === 0}
                                maxCount={1}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"مهارت"}
                            name={"skill"}
                            rules={[{
                                validator: justStringValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"یادگیری مهارت"}
                            name={"skill_to_learn"}
                            rules={[{
                                validator: justStringValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Card name="forth" title="اطلاعات پزشکی">
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"سلامت روان"}
                            name={"mental_health"}
                            rules={[{
                                message: "فیلد سلامت روان اجباریست", required: true,
                            }]}
                        >
                            <Select
                                showSearch
                                filterOption={filterOption}
                                options={mentalHealth}
                                loading={mentalHealth.length === 0}
                            />
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"گروه خون"}
                            name={"blood_type"}
                            rules={[{
                                message: "فیلد گروه خون اجباریست.", required: true,
                            }]}
                        >
                            <Select
                                showSearch
                                filterOption={filterOption}
                                options={bloodType}
                                loading={bloodType.length === 0}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"رنگ چشم"}
                            name={"eye_color"}
                            rules={[{
                                message: "فیلد رنگ چشم اجباریست.", required: true,
                            }]}
                        >
                            <Select
                                showSearch
                                filterOption={filterOption}
                                options={eyeColor}
                                loading={eyeColor.length === 0}
                            />
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"قد"}
                            name={"height"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <InputNumber min={0} addonAfter={"سانتی متر"}/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"واکسن کزاز و منژیت"}
                            name={"vaccine"}
                            rules={[{
                                required: true,
                            }]}
                            valuePropName={"checked"}
                            initialValue={true}
                        >
                            <Checkbox></Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Card name="fifth" title="آدرس">
                <Row gutter={8}>
                    <PairedSelect
                        data={stateAndCity}
                        parentLabel={"استان"}
                        parentName={"state"}
                        ChildLabel={"شهر"}
                        ChildName={"city"}
                    />
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"خیابان"}
                            name={"address_street"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"پلاک"}
                            name={"address_house_number"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"واحد"}
                            name={"address_home_unit"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"شماره تماس"}
                            name={"phone"}
                            rules={[{
                                required: true, validator: justNumericValidator
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            label={"بومی"}
                            name={"is_native"}
                            initialValue={true}
                            rules={[{
                                required: true
                            }]}
                        >
                            <Radio.Group size="large">
                                <Radio.Button value={true}>بومی</Radio.Button>
                                <Radio.Button value={false}>غیر بومی</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Card name="sixth" title="گذرنامه">
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.Item
                            label={"گذرنامه"}
                            name={"have_passport"}
                            initialValue={true}
                            rules={[{
                                required: true
                            }]}
                        >
                            <Radio.Group size="large">
                                <Radio.Button value={true}>گذرنامه دارم</Radio.Button>
                                <Radio.Button value={false}>گذرنامه ندارم</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Divider>سفر های خارجی</Divider>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col flex={1}>
                        <Form.List name="foreign_travels" rules={[{
                            required: false,
                        }]}>
                            {(fields, {add, remove}) => (<>
                                {fields.map(({key, name, ...restField}) => (
                                    <Card style={{marginBottom: "8px", borderColor: "#DBDBDB"}}
                                    >
                                        <Row gutter={8}>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'go_date']}
                                                    rules={[{
                                                        validator: dateValidator, required: true,
                                                    },]}
                                                >
                                                    <Input placeholder="تاریخ رفت"/>
                                                </Form.Item>
                                            </Col>÷
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'return_date']}
                                                    rules={[{
                                                        validator: dateValidator, required: true,
                                                    },]}
                                                >
                                                    <Input placeholder="تاریخ برگشت"/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={8}>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'country']}
                                                    rules={[{
                                                        validator: justStringValidator, required: true,
                                                    },]}
                                                >
                                                    <Input placeholder="کشور"/>
                                                </Form.Item>
                                            </Col>
                                            <Col flex={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'reason']}
                                                    rules={[{
                                                        validator: justStringValidator
                                                    },]}
                                                >
                                                    <Input placeholder="دلیل"/>
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <MinusCircleOutlined onClick={() => remove(name)}/>
                                            </Col>
                                        </Row>
                                    </Card>))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => {
                                        setFamilyEmptyError(false);
                                        add();
                                    }} block icon={<PlusOutlined/>}>
                                        اضافه کردن
                                    </Button>
                                </Form.Item>
                            </>)}
                        </Form.List>
                    </Col>
                </Row>
            </Card>
                <Button type={"primary"} block={true} htmlType={"submit"}>ذخیره</Button>
            </Flex>
        </Form>
    </Flex>);
}

export default AddSoldier;