import {Button, Divider, Flex, Form, notification, Popover, Select, Table, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import StringFilterCard from "../../components/filterCards/StringFilterCard.jsx";
import DateFilterCard from "../../components/filterCards/DateFilterCard.jsx";
import SelectFilterCard from "../../components/filterCards/SelectFilterCard.jsx";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

const FILTER_CARD_SIZE = 200;

function ListSoldier() {
    const [filters, setFilters] = useState([]);
    const [queries, setQueries] = useState([]);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const addFilterOptions = [
        {label: "نام", value: "first_name", type: "string"},
        {label: "نشان", value: "last_name", type: "string"},
        {label: "تاریخ ورود", value: "entry_date", type: "date"},
        {label: "تاریخ اعزام", value: "deployment_date", type: "date"},
        {label: "درجه", value: "military_rank", type: "select", configName: "rank"},
        {label: "وضعیت", value: "status", type: "select", configName: "status"},
        {label: "یگان و قسمت", value: "unit", childQuery: "section", type: "select", configName: "unit"},
    ];

    function addFilter(formValue) {
        let filterOption = addFilterOptions.find(v=> v.value === formValue.filter);
        setFilters(prev=> [...prev, filterOption]);
        form.resetFields();
    }

    function removeFilter(index) {
        setFilters((prev) => {
            let temp = [...prev];
            temp.splice(index, 1);
            return temp;
        });
    }

    useEffect(() => {
        axios.post(getApiUrl("soldier/list"), {"filter": queries.reduce((acc, obj) => ({ ...acc, ...obj }), {}), "projection": {}}, {withCredentials: true})
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
    }, [queries]);

    const columns = [
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
            title: "وضعیت",
            dataIndex: "status",
        },
    ];

    return (
        <Flex vertical={true} style={{width: "100%"}}>
            {contextHolder}
            <Flex align={"center"} gap={"large"} justify={"space-between"}>
                <Flex style={{overflowY: "auto"}} gap={"small"}>

                    {
                        filters.map((v, index) => {
                            switch (v.type) {
                                case "string":
                                    return (<StringFilterCard label={v.label} query={v.value} setQuery={setQueries} removeFilter={removeFilter} index={index} width={FILTER_CARD_SIZE} height={FILTER_CARD_SIZE}/>)
                                case "date":
                                    return (<DateFilterCard label={v.label} query={v.value} setQuery={setQueries} removeFilter={removeFilter} index={index} width={FILTER_CARD_SIZE} height={FILTER_CARD_SIZE}/>)
                                case "select":
                                    return (<SelectFilterCard label={v.label} configName={v.configName} parentQuery={v.value} childQuery={v.childQuery} setQuery={setQueries} removeFilter={removeFilter} index={index} width={FILTER_CARD_SIZE} height={FILTER_CARD_SIZE}/>)
                                default:
                                    return (<>err</>);
                            }
                        })
                    }

                    <Popover trigger={"click"} content={
                        <Flex vertical={true} gap={"small"}>
                            <Form
                                onFinish={addFilter}
                                form={form}
                            >
                                <Form.Item
                                    name={"filter"}
                                    rules={[{
                                        required: true, message: "لطفا یک فیلتر را انتخاب کنید."
                                    }]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        options={addFilterOptions}
                                        style={{width: "200px"}}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType={"submit"} block={true} type={"primary"}>اضافه</Button>
                                </Form.Item>
                            </Form>

                        </Flex>
                    }>
                        <Button icon={<PlusOutlined/>} style={{width: FILTER_CARD_SIZE, height: FILTER_CARD_SIZE}}/>
                    </Popover>

                </Flex>
                <Flex align={"center"}>
                    <Divider type={"vertical"} style={{height: "80px"}}/>
                    <Flex vertical={true} gap={"small"}>
                        <Typography.Title level={5}>
                            تعداد: {data.length}
                        </Typography.Title>
                        <Button type={"primary"}>پرینت</Button>
                        <Button type={"primary"}>دانلود</Button>
                    </Flex>
                </Flex>
            </Flex>
            <Divider/>
            <Flex justify={"center"}>
                <Table
                    dataSource={data}
                    columns={columns}
                    style={{width: "100%"}}
                />
            </Flex>
        </Flex>
    );
}

export default ListSoldier;