import {useEffect, useState} from "react";
import {
    Button,
    Divider,
    Flex,
    FloatButton,
    Form,
    notification,
    Spin,
    Table,
} from "antd";
import {GetDutyDuration, IsDutyStopped} from "../utils/Calculative.js";
import {DateRenderer, OpenProfileRenderer} from "../utils/TableRenderer.jsx";
import {EyeOutlined} from "@ant-design/icons";
import {getApiUrl} from "../utils/Config.js";
import axios from "axios";


function SearchSelect({
                          showInitiallyAll,
                          selectedSoldierProject,
                          searchFormFields,
                          setSelectedSoldierState,
                          setSoldierOid,
                          selectedSoldierView,
                          searchColumns,
                          searchProject,
                          additionalFilter,
                          overrideFilter
                      }) {

    const [soldiers, setSoldiers] = useState([]);
    const [showSearchList, setShowSearchList] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    function selectTarget(key) {
        setSoldierOid(key);
        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "_id":
                    {
                        "$oid": key
                    }
            },
            "projection": {
                ...selectedSoldierProject
            }
        }, {withCredentials: true})
            .then((res) => {
                console.log(res.data);
                if (res.data.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSelectedSoldierState({
                        ...res.data[0],
                        "duty_duration": <Spin/>,
                        "is_duty_stopped": {stop: false, text: ""}
                    });
                    setShowSearchList(false);

                    console.log("r", res.data[0]["release"]);
                    if (res.data[0]["release"]) {
                        if (res.data[0]["release"]["duty_duration"] !== "") {
                            setSelectedSoldierState((lastValue) => {
                                let newFilter = {...lastValue};
                                newFilter["duty_duration"] = res.data[0]["release"]["duty_duration"];
                                return newFilter;
                            });
                        } else {
                            GetDutyDuration(key, DateRenderer(res.data[0]["release"]["release_date"]))
                                .then((res) => {
                                    let temp = "";
                                    temp = `${res.month} ماه و ${res.day} روز`
                                    setSelectedSoldierState((lastValue) => {
                                        let newFilter = {...lastValue};
                                        newFilter["duty_duration"] = temp;
                                        return newFilter;
                                    });
                                })
                                .catch((err) => {
                                    setSelectedSoldierState((lastValue) => {
                                        let newFilter = {...lastValue};
                                        newFilter["duty_duration"] = "err";
                                        return newFilter;
                                    });
                                    api["error"]({
                                        message: "خطا", description: err
                                    });
                                })
                        }
                    }
                    else {
                        GetDutyDuration(key)
                            .then((res) => {
                                let temp = "";
                                temp = `${res.month} ماه و ${res.day} روز`
                                setSelectedSoldierState((lastValue) => {
                                    let newFilter = {...lastValue};
                                    newFilter["duty_duration"] = temp;
                                    return newFilter;
                                });
                            })
                            .catch((err) => {
                                setSelectedSoldierState((lastValue) => {
                                    let newFilter = {...lastValue};
                                    newFilter["duty_duration"] = "err";
                                    return newFilter;
                                });
                                api["error"]({
                                    message: "خطا", description: err
                                });
                            })
                    }
                    IsDutyStopped(key)
                        .then((res) => {
                            console.log(res);
                            setSelectedSoldierState((lastValue) => {
                                let newFilter = {...lastValue};
                                newFilter["is_duty_stopped"] = res;
                                return newFilter;
                            });
                        }).catch((err) => {
                        api["error"]({
                            message: "خطا", description: err
                        });
                    })
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err
                });
            });
    }

    useEffect(() => {
        onFinish({});
    }, [showInitiallyAll]);

    function onFinish(values) {
        let filter = additionalFilter === undefined ? {} : additionalFilter;
        Object.keys(values).forEach((key) => {
            if (values[key] !== undefined && values[key] !== "") {
                if (overrideFilter === undefined) {
                    filter[key] = {"$regex": `.*${values[key]}.*`};
                } else if (overrideFilter.hasOwnProperty(key)) {
                    const res = overrideFilter[key](values[key]);
                    filter[res[0]] = res[1];
                } else {
                    filter[key] = {"$regex": `.*${values[key]}.*`};
                }
            }
        })
        console.log(filter);

        if (Object.values(values).every(value => value === undefined || value === '')) {
            if (showInitiallyAll === undefined || showInitiallyAll === false) {
                return;
            }
        }

        const project = searchProject === undefined ? {
            "first_name": 1,
            "last_name": 1,
            "national_code": 1,
            "deployment_date": 1,
            "military_rank": 1,
            "father_name": 1,
            "unit": 1,
            "section": 1,
            "status": 1,
        } : searchProject;

        axios.post(getApiUrl("soldier/list"), {"filter": filter, "projection": {...project}}, {withCredentials: true}).then((response) => {
            let res = response.data;
            console.log(res);
            if (res.length === 1) {
                selectTarget(res[0]["key"]);
            } else {
                setShowSearchList(true);
                setSelectedSoldierState({"family": []});
                console.log(res);
                setSoldiers(res);
            }
        }).catch((error)=>{
            console.log("dd", error);
            api["error"]({
                message: "خطا", description: error.response
            });
        })
    }

    const columns = searchColumns === undefined ? [
        {
            title: '',
            dataIndex: 'key',
            key: 'key',
            align: "center",
            render: (values) => OpenProfileRenderer(values, "مشاهده", <EyeOutlined/>, () => {
                selectTarget(values);
            })
        },
        {
            title: "نام",
            dataIndex: "first_name",
            key: "first_name",
            align: "center",
        },
        {
            title: "نشان",
            dataIndex: "last_name",
            key: "last_name",
            align: "center",
        },
        {
            title: "کد ملی",
            dataIndex: "national_code",
            key: "national_code",
            align: "center",
        },
        {
            title: "تاریخ اعزام",
            dataIndex: "deployment_date",
            key: "deployment_date",
            render: DateRenderer,
            align: "center",
        },
        {
            title: "درجه",
            dataIndex: "military_rank",
            key: "military_rank",
            align: "center",
        },
        {
            title: "نام پدر",
            dataIndex: "father_name",
            key: "father_name",
            align: "center",
        },
        {
            title: "یگان",
            dataIndex: "unit",
            key: "unit",
            align: "center",
        },
        {
            title: "قسمت",
            dataIndex: "section",
            key: "section",
            align: "center",
        },
        {
            title: "وضعیت",
            dataIndex: "status",
            key: "status",
            align: "center",
        },
    ] : [
        {
            title: '',
            dataIndex: 'key',
            key: 'key',
            align: "center",
            render: (values) => OpenProfileRenderer(values, "مشاهده", <EyeOutlined/>, () => {
                selectTarget(values);
            })
        },
        ...searchColumns
    ];

    return (
        <Flex
            gap={"small"}
            vertical={true}
            style={{
                padding: "8px"
            }}
        >
            <FloatButton.BackTop visibilityHeight={200} target={() => document.getElementById("content")}/>
            {contextHolder}
            <Form
                layout={"inline"}
                onFinish={onFinish}
            >
                {searchFormFields}

                <Form.Item
                >
                    <Button type="primary" htmlType="submit">
                        یافتن
                    </Button>
                </Form.Item>

            </Form>
            <Divider/>
            <Flex vertical={true}>
                {showSearchList
                    ?
                    <>
                        <Table
                            bordered={true}
                            columns={columns}
                            dataSource={soldiers}
                        />
                    </>
                    :
                    selectedSoldierView
                }
            </Flex>
        </Flex>
    );
}

export default SearchSelect;