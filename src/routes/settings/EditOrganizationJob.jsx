import {Button, Divider, Flex, Form, Input, InputNumber, notification, Select, Tag} from "antd";
import EditableTable from "../../utils/EditableTable.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function EditOrganizationJob() {

    const [data, setData] = useState([]);
    const [ranksOption, setRanksOption] = useState([]);

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        axios.get(getApiUrl("config/rank"), {withCredentials: true})
            .then((res) => {
                let temp = [];
                res.data.config.forEach((value) => {
                    temp.push({
                        value: value,
                        label: value
                    });
                });
                setRanksOption(temp);
            }).catch((err) => {
            api["error"]({
                message: "خطا",
                description: err.message
            });
        })

        fetchData();
    }, []);

    function fetchData() {
        axios.get(getApiUrl("config/organization-job"), {withCredentials: true})
            .then((res)=>{
                let temp = [];
                res.data.config.forEach((value, index)=>{
                    temp.push({
                        ...value,
                        key: index
                    });
                });

                setData(temp);
            }).catch((err) => {
            api["error"]({
                message: "خطا",
                description: err.message
            });
        })
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    function onDelete(index) {
        axios.post(getApiUrl(`config/organizational_job/delete/${index}`), {}, {withCredentials: true})
            .then(()=>{
                fetchData();
            }).catch((err)=>{
            fetchData();
            api["error"]({
                message: "خطا",
                description: err.message
            });
        })
    }

    function onCreate(value) {
        axios.post(getApiUrl("config/organizational_job/create"), value, {withCredentials: true})
            .then(()=>{
                fetchData();
            }).catch((err)=>{
            fetchData();
            api["error"]({
                message: "خطا",
                description: err.message
            });
        })
    }

    const columns = [
        {
            title: "عنوان یگان",
            dataIndex: "unit_title",
            key: "unit_title",
            align: "center",
            inputType: "text",
        },
        {
            title: "شماره جدول",
            dataIndex: "table_number",
            key: "table_number",
            align: "center",
            inputType: "text",
        },
        {
            title: "سطر",
            dataIndex: "line",
            key: "line",
            align: "center",
            inputType: "text",
        },
        {
            title: "بند",
            dataIndex: "article",
            key: "article",
            align: "center",
            inputType: "text",
        },
        {
            title: "ماده 42",
            dataIndex: "md",
            key: "md",
            align: "center",
            inputType: "text",
        },
        {
            title: "عنوان شغل",
            dataIndex: "job_title",
            key: "job_title",
            align: "center",
            inputType: "text",
        },
        {
            title: "درجه های مجاز",
            dataIndex: "allow_ranks",
            key: "allow_ranks",
            align: "center",
            inputType: "select",
            selectOption: ranksOption,
            render: (value) => {
                return (
                    <Flex>
                        {
                            value.map((v)=>{
                                return(
                                  <Tag>{v}</Tag>
                                );
                            })
                        }
                    </Flex>
                );
            }
        },
        {
            title: "تعداد جایگاه",
            dataIndex: "limit",
            key: "limit",
            align: "center",
            inputType: "number",
        },
    ];

    return (
        <Flex vertical={true}>
            {contextHolder}
            <Divider>
                شغل سازمانی
            </Divider>

            <EditableTable
                formField={{
                    unit_title: '',
                    table_number: '',
                    section: '',
                    line: '',
                    md: '',
                    job_title: '',
                    allow_ranks: '',
                    limit: '',
                }}
                onDelete={onDelete}
                pagination={false} bordered={true} style={{width: "100%"}}
                columns={columns} dataSource={data}
                createForm={() =>
                    <Flex gap={"small"}>
                        <Form
                            layout={"inline"}
                            onFinish={onCreate}
                        >
                            <Form.Item
                                label={"عنوان یگان"}
                                name={"unit_title"}
                                style={{marginBottom: "10px"}}
                                rules={[{
                                    required: true,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"شماره جدول"}
                                name={"table_number"}
                                rules={[{
                                    required: true,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"سطر"}
                                name={"line"}
                                rules={[{
                                    required: true,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"بند"}
                                name={"article"}
                                rules={[{
                                    required: true,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"ماده 42"}
                                name={"md"}
                                rules={[{
                                    required: true,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"عنوان شغل"}
                                name={"job_title"}
                                rules={[{
                                    required: true,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"درجه های مجاز"}
                                name={"allow_ranks"}
                                rules={[{
                                    required: true,
                                }]}
                            >
                                <Select
                                    showSearch
                                    filterOption={filterOption}
                                    options={ranksOption}
                                    loading={ranksOption.length === 0}
                                    mode="multiple"
                                    allowClear
                                    placeholder="انتخاب کنید"
                                />
                            </Form.Item>

                            <Form.Item
                                label={"تعداد جایگاه"}
                                name={"limit"}
                                rules={[{
                                    required: true,
                                }]}
                                initialValue={1}
                            >
                                <InputNumber min={1}/>
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
        </Flex>
    );
}

export default EditOrganizationJob;