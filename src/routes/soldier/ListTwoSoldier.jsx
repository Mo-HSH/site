import {useEffect, useRef, useState} from "react";
import {
    Button,
    Cascader,
    Checkbox,
    Drawer,
    Flex,
    Input,
    InputNumber,
    notification,
    Radio,
    Select,
    Space,
    Spin,
    Table,
    Tooltip
} from "antd";

import {EditOutlined, EyeOutlined, SearchOutlined, SwapLeftOutlined} from "@ant-design/icons";
import {dateValidator} from "../../utils/Validates.js";
import {DateRenderer, NativeRenderer, OpenProfileRenderer} from "../../utils/TableRenderer.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";
import {GetQueryDate} from "../../utils/Calculative.js";

function ListTwoSoldier() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [filter, setFilter] = useState({});
    const [projection, setProjection] = useState({});
    const [columnsEditDrawer, setColumnsEditDrawer] = useState(false);
    const [unit, setUnit] = useState([]);
    const [state, setState] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const defaultColumn = [0, 1, 2, 3, 4, 10, 11];
    const navigate = useNavigate();


    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    function GetSelectParentSearchProps(dataIndex, configName) {


        function handleSearch(selectedKeys, confirm) {
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                newFilter[dataIndex] = {"$in": selectedKeys};
                return newFilter
            });
            confirm();
        }

        function handleReset(clearFilters, confirm) {
            clearFilters();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                delete newFilter[dataIndex];
                return newFilter;
            });
            confirm();
        }

        return ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => {

                const [options, setOptions] = useState([]);

                useEffect(() => {
                    axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
                        .then((res) => {
                            setOptions([...res.data.config.map(v => {
                                return ({
                                    value: v.name,
                                    label: v.name
                                });
                            })]);
                        })
                        .catch((err) => {
                            api["error"]({
                                message: "خطا",
                                description: err
                            });
                        });
                }, []);

                return (<Flex
                    gap={"small"}
                    vertical={true}
                    style={{
                        padding: "8px"
                    }}
                >
                    <Select
                        showSearch
                        mode="multiple"
                        filterOption={filterOption}
                        options={options}
                        loading={options.length === 0}
                        value={selectedKeys}
                        onChange={(e) => {
                            setSelectedKeys(e);
                        }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm)}
                            icon={<SearchOutlined/>}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            فیلتر
                        </Button>
                        <Button
                            onClick={() => handleReset(clearFilters, confirm)}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            لغو فیلتر
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            بستن
                        </Button>
                    </Space>
                </Flex>)
            },
        });
    }

    function GetSelectChildSearchProps(dataIndex, configName) {


        function handleSearch(selectedKeys, confirm) {
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                newFilter[dataIndex] = {"$in": selectedKeys[1]};
                return newFilter;
            });
            confirm();
        }

        function handleReset(clearFilters, confirm) {
            clearFilters();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                delete newFilter[dataIndex];
                setFilter(newFilter);
            });
            confirm();
        }

        return ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => {

                const [options, setOptions] = useState([]);

                useEffect(() => {
                    axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
                        .then((res) => {
                            setOptions([...res.data.config.map((v) => {
                                return ({
                                    value: v.name,
                                    label: v.name,
                                    children: [...v.config.map(i => {
                                        return ({
                                            value: i,
                                            label: i
                                        })
                                    })]
                                })
                            })]);
                        })
                        .catch((err) => {
                            api["error"]({
                                message: "خطا",
                                description: err
                            });
                        });
                }, []);

                return (<Flex
                    gap={"small"}
                    vertical={true}
                    style={{
                        padding: "8px"
                    }}
                >
                    <Cascader
                        showSearch
                        multiple
                        options={options}
                        loading={options.length === 0}
                        value={selectedKeys[0]}
                        showCheckedStrategy={Cascader.SHOW_CHILD}
                        onChange={(e) => {
                            let temp = [];
                            e.forEach((value) => {
                                temp.push(value.at(-1));
                            });
                            setSelectedKeys([e, temp]);
                        }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm)}
                            icon={<SearchOutlined/>}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            فیلتر
                        </Button>
                        <Button
                            onClick={() => handleReset(clearFilters, confirm)}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            لغو فیلتر
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            بستن
                        </Button>
                    </Space>
                </Flex>)
            },
        });
    }

    function GetSelectSearchProps(dataIndex, configName) {


        function handleSearch(selectedKeys, confirm) {
            let innerFilter = {"$in": selectedKeys};
            confirm();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                newFilter[dataIndex] = innerFilter;
                return newFilter;
            });
        }

        function handleReset(clearFilters, confirm) {
            clearFilters();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                delete newFilter[dataIndex];
                return newFilter;
            });
            confirm();
        }

        return ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => {

                const [options, setOptions] = useState([]);

                useEffect(() => {
                    axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
                        .then((res) => {
                            let temp = [];
                            res.data.config.forEach((value) => {
                                temp.push({
                                    value: value,
                                    label: value
                                });
                            });
                            setOptions(temp);
                        })
                        .catch((err) => {
                            api["error"]({
                                message: "خطا",
                                description: err
                            });
                        });
                }, []);

                return (<Flex
                    gap={"small"}
                    vertical={true}
                    style={{
                        padding: "8px"
                    }}
                >
                    <Select
                        showSearch
                        mode="multiple"
                        filterOption={filterOption}
                        options={options}
                        loading={options.length === 0}
                        value={selectedKeys}
                        onChange={(e) => {
                            setSelectedKeys(e);
                        }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm)}
                            icon={<SearchOutlined/>}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            فیلتر
                        </Button>
                        <Button
                            onClick={() => handleReset(clearFilters, confirm)}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            لغو فیلتر
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            بستن
                        </Button>
                    </Space>
                </Flex>)
            },
        });
    }

    function GetDateSearchProps(dataIndex) {
        const fromDate = useRef(null);
        const toDate = useRef(null);

        function handleSearch(selectedKeys, confirm) {
            console.log(selectedKeys);
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                switch (selectedKeys[2]) {
                    case "range":
                        dateValidator({required: true}, selectedKeys[0]).then((res) => {
                            fromDate.current.input.classList = "ant-input ant-input-rtl css-dev-only-do-not-override-umqb6y ant-input-outlined";
                            dateValidator({required: true}, selectedKeys[1]).then((res) => {
                                fromDate.current.input.classList = "ant-input ant-input-rtl css-dev-only-do-not-override-umqb6y ant-input-outlined";
                                newFilter[dataIndex] = {
                                    "$gte": GetQueryDate(selectedKeys[0]),
                                    "$lte": GetQueryDate(selectedKeys[1])
                                };
                                return newFilter;
                            }).catch((err) => {
                                toDate.current.input.classList = "ant-input ant-input-rtl css-dev-only-do-not-override-umqb6y ant-input-outlined ant-input-status-error";
                            })
                        }).catch((err) => {
                            fromDate.current.input.classList = "ant-input ant-input-rtl css-dev-only-do-not-override-umqb6y ant-input-outlined ant-input-status-error";
                        })
                        break;
                    default:
                        dateValidator({required: true}, selectedKeys[0]).then((res) => {
                            fromDate.current.input.classList = "ant-input ant-input-rtl css-dev-only-do-not-override-umqb6y ant-input-outlined";
                            console.log("dataIndex", dataIndex);
                            newFilter[dataIndex] = GetQueryDate(selectedKeys[0]);
                            return newFilter;
                        }).catch((err) => {
                            fromDate.current.input.classList = "ant-input ant-input-rtl css-dev-only-do-not-override-umqb6y ant-input-outlined ant-input-status-error";
                        })
                        break;
                }
            });
            confirm();
        }

        function handleReset(clearFilters, confirm) {
            clearFilters();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                delete newFilter[dataIndex];
                return newFilter;
            });
            confirm();
        }

        return ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (<Flex
                gap={"small"}
                vertical={true}
                style={{
                    padding: "8px"
                }}
            >
                <Space>
                    <Input
                        ref={fromDate}
                        placeholder={selectedKeys[2] === "range" ? "از تاریخ" : "تاریخ"}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys([e.target.value, selectedKeys[1], selectedKeys[2]])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    />
                    {selectedKeys[2] === "range" ? <>
                        <SwapLeftOutlined/>
                        <Input
                            ref={toDate}
                            placeholder={"تا تاریخ"}
                            value={selectedKeys[1]}
                            onChange={(e) => setSelectedKeys([selectedKeys[0], e.target.value, selectedKeys[2]])}
                            onPressEnter={() => handleSearch(selectedKeys, confirm)}
                        />
                    </> : null}

                </Space>
                <Space>
                    <Radio.Group defaultValue={"single"} value={selectedKeys[2]}
                                 onChange={(e) => setSelectedKeys([selectedKeys[0], selectedKeys[1], e.target.value])}
                                 buttonStyle="solid">
                        <Radio.Button value="single">تک تاریخ</Radio.Button>
                        <Radio.Button value="range">بازه</Radio.Button>
                    </Radio.Group>
                </Space>
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        فیلتر
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        لغو فیلتر
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        بستن
                    </Button>
                </Space>
            </Flex>),
        });
    }

    function GetStringSearchProps(dataIndex, inputPlaceHolder) {

        function handleSearch(selectedKeys, confirm) {
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                switch (selectedKeys[1]) {
                    case "exact":
                        newFilter[dataIndex] = selectedKeys[0];
                        break;
                    case "start":
                        newFilter[dataIndex] = {"$regex": `^${selectedKeys[0]}`};
                        break;
                    case "end":
                        newFilter[dataIndex] = {"$regex": `.*${selectedKeys[0]}$`};
                        break;
                    default:
                        newFilter[dataIndex] = {"$regex": `.*${selectedKeys[0]}.*`};
                        break;
                }
                return newFilter;
            });
            confirm();
        }

        function handleReset(clearFilters, confirm) {
            clearFilters();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                delete newFilter[dataIndex];
                return newFilter;
            });
            confirm();
        }

        return ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (<Flex
                gap={"small"}
                vertical={true}
                style={{
                    padding: "8px"
                }}
            >
                <Input
                    placeholder={inputPlaceHolder}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys([e.target.value, selectedKeys[1]])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                />
                <Space>
                    <Radio.Group defaultValue={"middle"} value={selectedKeys[1]}
                                 onChange={(e) => setSelectedKeys([selectedKeys[0], e.target.value])}
                                 buttonStyle="solid">
                        <Radio.Button value="exact">برابر</Radio.Button>
                        <Radio.Button value="start">شروع با</Radio.Button>
                        <Radio.Button value="middle">بین</Radio.Button>
                        <Radio.Button value="end">اتمام با</Radio.Button>
                    </Radio.Group>
                </Space>
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        فیلتر
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        لغو فیلتر
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        بستن
                    </Button>
                </Space>
            </Flex>),
        });
    }

    function GetNumberSearchProps(dataIndex) {

        function handleSearch(selectedKeys, confirm) {
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                switch (selectedKeys[2]) {
                    case "range":
                        newFilter[dataIndex] = {"$lt": selectedKeys[1], "$gt": selectedKeys[0]};
                        break;
                    case "bigger":
                        newFilter[dataIndex] = {"$gt": selectedKeys[0]};
                        break;
                    case "lower":
                        newFilter[dataIndex] = {"$lt": selectedKeys[0]};
                        break;
                    default:
                        newFilter[dataIndex] = selectedKeys[0];
                        break;
                }
                return newFilter;
            })
            confirm();
        }

        function handleReset(clearFilters, confirm) {
            clearFilters();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                delete newFilter[dataIndex];
                return newFilter;
            });
            confirm();
        }

        return ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (<Flex
                gap={"small"}
                vertical={true}
                style={{
                    padding: "8px"
                }}
            >
                <Space>
                    <InputNumber
                        addonAfter={"سانتی متر"}
                        placeholder={selectedKeys[2] === "range" ? "از" : ""}
                        value={selectedKeys[0]}
                        onChange={(value) => setSelectedKeys([value, selectedKeys[1], selectedKeys[2]])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    />
                    {selectedKeys[2] === "range" ? <>
                        <SwapLeftOutlined/>
                        <InputNumber
                            addonAfter={"سانتی متر"}
                            placeholder={"تا"}
                            value={selectedKeys[1]}
                            onChange={(value) => setSelectedKeys([selectedKeys[0], value, selectedKeys[2]])}
                            onPressEnter={() => handleSearch(selectedKeys, confirm)}
                        />
                    </> : null}
                </Space>
                <Space>
                    <Radio.Group defaultValue={"exact"} value={selectedKeys[2]}
                                 onChange={(e) => setSelectedKeys([selectedKeys[0], selectedKeys[1], e.target.value])}
                                 buttonStyle="solid">
                        <Radio.Button value="exact">برابر</Radio.Button>
                        <Radio.Button value="bigger">بزرگتر از</Radio.Button>
                        <Radio.Button value="lower">کوچکتر از</Radio.Button>
                        <Radio.Button value="range">محدوده</Radio.Button>
                    </Radio.Group>
                </Space>
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        فیلتر
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        لغو فیلتر
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        بستن
                    </Button>
                </Space>
            </Flex>),
        });
    }

    function GetBooleanSearchProps(dataIndex, trueLabel, falseLabel) {

        function handleSearch(selectedKeys, confirm) {
            let innerFilter = selectedKeys[0];
            confirm();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                newFilter[dataIndex] = innerFilter;
                return newFilter;
            });
        }

        function handleReset(clearFilters, confirm) {
            clearFilters();
            setFilter((currentFilter) => {
                let newFilter = {...currentFilter};
                delete newFilter[dataIndex];
                return newFilter;
            });
            confirm();
        }

        return ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => {

                const [options, setOptions] = useState([]);

                useEffect(() => {
                    setOptions([
                        {label: trueLabel, value: true},
                        {label: falseLabel, value: false},
                    ]);
                }, []);

                return (<Flex
                    gap={"small"}
                    vertical={true}
                    style={{
                        padding: "8px"
                    }}
                >
                    <Select
                        showSearch
                        filterOption={filterOption}
                        options={options}
                        loading={options.length === 0}
                        value={selectedKeys}
                        onChange={(e) => {
                            setSelectedKeys([e]);
                        }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm)}
                            icon={<SearchOutlined/>}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            فیلتر
                        </Button>
                        <Button
                            onClick={() => handleReset(clearFilters, confirm)}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            لغو فیلتر
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            بستن
                        </Button>
                    </Space>
                </Flex>)
            },
        });
    }

    function FirstValueRenderer(value) {
        try {
            return value;
        } catch (e) {
            return (<Spin/>);
        }
    }

    function DeficitRenderer(value) {
        try {
            let overallDeficit = 0;
            let toolTip = [];
            value.forEach((deficit) => {
                overallDeficit += deficit["day"];
                toolTip.push(`${deficit["name"]}: ${deficit["day"]} روز`);
            })
            if (overallDeficit === 0) {
                return 0;
            } else {
                return <Tooltip title={toolTip.join(" - ")}>{overallDeficit}</Tooltip>
            }
        } catch (e) {
            console.log(e);
            return (<Spin/>);
        }
    }

    const optionsExtraValue = {
        0: {
            title: "نام",
            dataIndex: "first_name",
            key: "first_name",
            ...GetStringSearchProps("first_name", "جستجو نام"),
        },
        1: {
            title: "نشان",
            dataIndex: "last_name",
            key: "last_name",
            ...GetStringSearchProps("last_name", "جستجو نشان"),
        },
        2: {
            title: "کد ملی",
            dataIndex: "national_code",
            key: "national_code",
            ...GetStringSearchProps("national_code", "کد ملی"),
        },
        3: {
            title: "تاریخ اعزام",
            dataIndex: "deployment_date",
            key: "deployment_date",
            render: DateRenderer,
            ...GetDateSearchProps("deployment_date"),
        },
        4: {
            title: "درجه",
            dataIndex: "military_rank",
            key: "military_rank",
            ...GetSelectSearchProps("military_rank", "rank"),
        },
        5: {
            title: "مدرک تحصیلی",
            dataIndex: "education",
            key: "education",
            render: FirstValueRenderer,
            ...GetSelectSearchProps("education", "education"),
        },
        6: {
            title: "تاریخ تولد",
            dataIndex: "birthday",
            key: "birthday",
            render: DateRenderer,
            ...GetDateSearchProps("birthday"),
        },
        7: {
            title: "نام پدر",
            dataIndex: "father_name",
            key: "father_name",
            ...GetStringSearchProps("father_name", "جستجو نام پدر"),
        },
        8: {
            title: "استان",
            dataIndex: "state",
            key: "state",
            ...GetSelectParentSearchProps("state", "state")
        },
        9: {
            title: "شهر",
            dataIndex: "city",
            key: "city",
            ...GetSelectParentSearchProps("city", "state")
        },
        10: {
            title: "یگان",
            dataIndex: "unit",
            key: "unit",
            ...GetSelectParentSearchProps("unit", "unit")
        },
        11: {
            title: "قسمت",
            dataIndex: "section",
            key: "section",
            ...GetSelectChildSearchProps("section", "unit")
        },
        12: {
            title: "محل تولد",
            dataIndex: "birthplace",
            key: "birthplace",
            ...GetSelectChildSearchProps("birthplace", "unit")
        },
        13: {
            title: "رشته تحصیلی",
            dataIndex: "field_of_study",
            key: "field_of_study",
            ...GetSelectSearchProps("field_of_study", "field-of-study"),
        },
        14: {
            title: "تاریخ ترخیص قانونی",
            dataIndex: "legal_release_date",
            key: "legal_release_date",
            render: DateRenderer,
            ...GetDateSearchProps("legal_release_date"),
        },
        15: {
            title: "تاریخ ترخیص کل",
            dataIndex: "overall_release_date",
            key: "overall_release_date",
            render: DateRenderer,
            ...GetDateSearchProps("overall_release_date"),
        },
        16: {
            title: "بومی",
            dataIndex: "is_native",
            key: "is_native",
            render: NativeRenderer,
            ...GetBooleanSearchProps("is_native", "بومی", "غیر بومی")
        },
        17: {
            title: "دین",
            dataIndex: "religion",
            key: "religion",
            ...GetSelectSearchProps("religion", "religion"),
        },
        18: {
            title: "کسری",
            dataIndex: "deficit",
            key: "deficit",
            render: DeficitRenderer,
        },
        19: {
            title: "تاریخ ورود",
            dataIndex: "entry_date",
            key: "entry_date",
            render: DateRenderer,
            ...GetDateSearchProps("entry_date"),
        },
        20: {
            title: "سلامت روان",
            dataIndex: "mental_health",
            key: "mental_health",
            ...GetSelectSearchProps("mental_health", "mental-health"),
        },
        21: {
            title: "گروه خونی",
            dataIndex: "blood_type",
            key: "blood_type",
            ...GetSelectSearchProps("blood_type", "blood-type"),
        },
        22: {
            title: "رنگ چشم",
            dataIndex: "eye_color",
            key: "eye_color",
            ...GetSelectSearchProps("eye_color", "eye-color"),
        },
        23: {
            title: "قد",
            dataIndex: "height",
            key: "height",
            ...GetNumberSearchProps("height"),
        },
    };

    const options = [
        {
            label: "نام",
            value: 0,
        },
        {
            label: "نشان",
            value: 1,
        },
        {
            label: "کد ملی",
            value: 2,
        },
        {
            label: "تاریخ اعزام",
            value: 3,
        },
        {
            label: "درجه",
            value: 4,
        },
        {
            label: "مدرک تحصیلی",
            value: 5,
        },
        {
            label: "تاریخ تولد",
            value: 6,
        },
        {
            label: "نام پدر",
            value: 7,
        },
        {
            label: "استان",
            value: 8,
        },
        {
            label: "شهر",
            value: 9,
        },
        {
            label: "یگان",
            value: 10,
        },
        {
            label: "قسمت",
            value: 11,
        },
        {
            label: "محل تولد",
            value: 12,
        },
        {
            label: "رشته تحصیلی",
            value: 13,
        },
        {
            label: "تاریخ ترخیص قانونی",
            value: 14,
        },
        {
            label: "تاریخ ترخیص کل",
            value: 15,
        },
        {
            label: "بومی/غیر بومی",
            value: 16,
        },
        {
            label: "دین",
            value: 17,
        },
        {
            label: "کسری",
            value: 18,
        },
        {
            label: "تاریخ ورود",
            value: 19,
        },
        {
            label: "سلامت روان",
            value: 20,
        },
        {
            label: "گروه خونی",
            value: 21,
        },
        {
            label: "رنگ چشم",
            value: 22,
        },
        {
            label: "قد",
            value: 23,
        },
    ];


    function columnsChange(checkedValues) {
        let columnTemp = [{
            title: <Tooltip title={"ویرایش ستون ها"}><Button type={"text"} icon={<EditOutlined/>}
                                                             onClick={() => setColumnsEditDrawer(true)}/></Tooltip>,
            dataIndex: 'key',
            key: 'key',
            render: (values) => OpenProfileRenderer(values, "مشاهده پروفایل سرباز", <EyeOutlined/>, () => {
                navigate(`/edit-soldier/${values}`);
            })
        }];
        let projectionTemp = {};
        checkedValues.forEach((index) => {
            columnTemp.push(optionsExtraValue[index]);
            projectionTemp[optionsExtraValue[index].dataIndex] = 1;
        });
        setColumns(columnTemp);
        setProjection(projectionTemp);
    }

    useEffect(() => {
        console.log("filter", filter);
        if (Object.keys(projection).length > 0) {
            axios.post(getApiUrl("soldier/list"), {"filter": filter, "projection": projection}, {withCredentials: true})
                .then((response) => {
                    let res = response.data;
                    console.log(res);
                    setData(res);
                })
                .catch((err) => {
                    api["error"]({
                        message: "خطا", description: err.response.data
                    });
                });
        }
    }, [filter, projection]);

    useEffect(() => {
        columnsChange(defaultColumn);
    }, []);

    return (
        <Flex align={"center"} justify={"center"} vertical={true} gap={"small"}>
            {contextHolder}
            <Drawer
                title="ستون ها"
                placement="bottom"
                closable={true}
                onClose={() => setColumnsEditDrawer(false)}
                open={columnsEditDrawer}
            >
                <Checkbox.Group options={options} onChange={columnsChange} defaultValue={defaultColumn}/>
            </Drawer>
            <Table dataSource={data} columns={columns} bordered={true}
                   pagination={{position: ["bottomCenter"]}}/>

        </Flex>
    );
}

export default ListTwoSoldier;