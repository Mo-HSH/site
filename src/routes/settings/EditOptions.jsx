import {Divider, Flex, Form, Input, List, Button, Typography, Tooltip, Tabs, Spin, Modal, Table} from "antd";
import {useEffect, useState} from "react";
import {ReloadOutlined} from "@ant-design/icons";
import VirtualList from 'rc-virtual-list';
import {dateValidator} from "../../utils/Validates.js";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function ObjectOneByOne({configName, keyTitle, valueTitle}) {
    const [needFetch, setNeedFetch] = useState(false);
    const [data, setData] = useState([]);
    const [isDataLoading, setDataLoading] = useState(true);

    function fetch() {
        setNeedFetch(!needFetch);
    }


    useEffect(() => {
        setDataLoading(true);
        axios.get(getApiUrl(`config/${configName}`), {withCredentials: true}).then((res) => {
            setData(res.data.config);
            console.log(res.data.config);
            setDataLoading(false);
        }).catch((err) => {
            console.log(err);
            setDataLoading(false);
        })
    }, [needFetch]);


    return (
        <Table
            style={{width: "90%"}}
            pagination={false}
            bordered={true}
            dataSource={data}
            columns={[
                {
                    title: keyTitle,
                    dataIndex: "key"
                },
                {
                    title: valueTitle,
                    dataIndex: "value"
                },
            ]}
            footer={()=>{
                return(
                    <Form
                        style={{width: "90%"}}
                        layout={"inline"}
                        onFinish={(value)=>{
                            axios.post(getApiUrl(`config/object_one_by_one/create/${configName}/${value.key}/${value.value}`), {}, {withCredentials: true}).then((res) => {
                                setFormOpen(false);
                                fetch();
                            }).catch((err) => {
                                console.log(err);
                                setFormLoading(false);
                            })
                        }}
                    >
                        <Form.Item
                            style={{width: "40%"}}
                            label={keyTitle}
                            name={"key"}
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            style={{width: "40%"}}
                            label={valueTitle}
                            name={"value"}
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
                );
            }}
        />
    );
}

function CustomDependList({configName, modalTitle, parentName, childName}) {
    const [data, setData] = useState([]);
    const [parentData, setParentData] = useState([]);
    const [childData, setChildData] = useState([]);
    const [isDataLoading, setDataLoading] = useState(true);
    const [isFormLoading, setFormLoading] = useState(false);
    const [FormOpen, setFormOpen] = useState(false);
    const [needFetch, setNeedFetch] = useState(false);
    const [selectedParent, setSelectParent] = useState("");

    function fetch() {
        setNeedFetch(!needFetch);
    }

    function onFinish(values) {
        setFormLoading(true);
        axios.post(getApiUrl(`config/object_list/create/${configName}/${values.parent}/${values.child}`), {},{withCredentials: true}).then((res) => {
            setFormLoading(false);
            setFormOpen(false);
            fetch();
        }).catch((err) => {
            console.log(err);
            setFormLoading(false);
        })
    }

    useEffect(() => {
        setDataLoading(true);
        axios.get(getApiUrl(`config/${configName}`), {withCredentials: true}).then((res) => {
            setData(res.data.config);
            setParentData(res.data.config.map(v=>v.name));
            setDataLoading(false);
        }).catch((err) => {
            console.log(err);
            setDataLoading(false);
        })
    }, [needFetch]);

    return (
        <>
            {isDataLoading
                ?
                <Spin/>
                :
                <Flex justify={"center"} align={"center"} vertical={true} gap={"small"}>
                    <Flex justify={"center"} align={"center"} vertical={false} gap={"small"}>
                        <List
                            bordered
                            header={<Typography.Text strong={true}>{parentName}</Typography.Text>}
                            align={"center"} justify={"center"}
                            style={{width: "250px"}}
                        >
                            <VirtualList
                                data={parentData}
                                height={200}
                            >
                                {(item) => (
                                    <List.Item>
                                        <Flex align={"center"} justify={"center"} style={{width: "100%"}}>
                                            <Typography.Text
                                                onClick={() => {
                                                    setChildData(data.find(v=>v.name === item).config);
                                                    setSelectParent(item);
                                                    console.log(childData);
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                    color: selectedParent === item ? "var(--selected-list-text)" : "var(--list-text)",
                                                    textDecoration: selectedParent === item ? 'underline' : null,
                                                }}
                                            >
                                                {item}
                                            </Typography.Text>
                                        </Flex>
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>

                        <List
                            bordered
                            header={<Typography.Text strong={true}>{childName}</Typography.Text>}
                            align={"center"} justify={"center"}
                            style={{width: "250px"}}
                        >
                            <VirtualList
                                data={childData}
                                height={200}
                            >
                                {(item) => (
                                    <List.Item>
                                        <Flex
                                            align={"center"} justify={"center"}
                                            style={{width: "100%", cursor: "pointer"}}
                                        >
                                            <Typography.Text>
                                                {item}
                                            </Typography.Text>
                                        </Flex>
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>

                    </Flex>
                    <Button type="primary" onClick={() => setFormOpen(true)}>اضافه کردن</Button>
                    <Modal
                        open={FormOpen}
                        title={modalTitle}
                        onCancel={() => setFormOpen(false)}
                        destroyOnClose
                        footer={null}
                    >
                        <Form
                            onFinish={onFinish}
                            layout={"vertical"}>
                            <Form.Item
                                name={"parent"}
                                label={parentName}
                                rules={[
                                    {
                                        required: true,
                                        message: "این فیلد اجباریست."
                                    },
                                ]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name={"child"}
                                label={childName}
                                rules={[
                                    {
                                        required: true,
                                        message: "این فیلد اجباریست."
                                    },
                                ]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isFormLoading}>
                                    افزودن
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Flex>
            }
        </>
    );
}

function CustomList({configName}) {
    const [data, setData] = useState([]);
    const [isDataLoading, setDataLoading] = useState(true);
    const [isFormLoading, setFormLoading] = useState(false);
    const [needFetch, setNeedFetch] = useState(false);


    function fetch() {
        setNeedFetch(!needFetch);
    }

    function onFinish(values) {
        console.log(values);
        setFormLoading(true);
        axios.post(getApiUrl(`config/list/create/${configName}/${values.name}`), {}, {withCredentials: true})
            .then(()=>{
                setFormLoading(false);
                fetch();
            }).catch((err)=>{
            console.log(err);
            setFormLoading(false);
        })
    }

    useEffect(() => {
        setDataLoading(true);
        axios.get(getApiUrl(`config/${configName}`), {withCredentials: true}).then((res) => {
            setData(res.data.config);
            setDataLoading(false);
        }).catch(() => {
            setDataLoading(false);
        })
    }, [needFetch]);

    return (
        <List
            bordered
            dataSource={data}
            loading={isDataLoading}
            renderItem={(item) => (
                <List.Item>
                    <Flex align={"center"} justify={"center"} style={{width: "100%"}}>
                        <Typography.Text>
                            {item}
                        </Typography.Text>
                    </Flex>
                </List.Item>
            )}
            footer={
                <Flex>
                    <Form
                        name={configName}
                        onFinish={onFinish}
                        layout={"inline"}
                    >
                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "این فیلد اجباریست."
                                },
                            ]}
                        >
                            <Input onPressEnter={onFinish}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isFormLoading}>
                                افزودن
                            </Button>
                        </Form.Item>
                    </Form>
                    <Tooltip title={"تازه سازی"}>
                        <Button shape={'circle'} icon={<ReloadOutlined/>} onClick={fetch}/>
                    </Tooltip>
                </Flex>
            }
        />
    );

}

function EditOptions() {

    return (<Flex vertical>
        <>
            {[
                {category: "دین", configName: "religion"},
                {category: "درجه", configName: "rank"},
                {category: "رنگ چشم", configName: "eye-color"},
                {category: "نسبت خانوادگی", configName: "relation"},
                {category: "یگان پیشین", configName: "previous-unit"},
                {category: "تحصیلات", configName: "education"},
                {category: "رشته تحصیلی", configName: "field-of-study"},
                {category: "سلامت روان", configName: "mental-health"},
                {category: "گروه خون", configName: "blood-type"},
                {category: "کسری", configName: "deficit-names"},
            ].map(({category, configName}) => (
                <>
                    <Divider>{category}</Divider>
                    <Flex justify="center">
                        <CustomList configName={configName}/>
                    </Flex>
                </>
            ))}
        </>
        <>
            {[
                {
                    category: "یگان - قسمت",
                    configName: "unit",
                    parentName: "یگان",
                    childName: "قسمت",
                    modalTitle: "یگان - قسمت"
                },
                {
                    category: "استان - شهر",
                    configName: "state",
                    parentName: "استان",
                    childName: "شهر",
                    modalTitle: "استان - شهر"
                },
            ].map(({category, configName, parentName, childName, modalTitle}) => (
                <>
                    <Divider>{category}</Divider>
                    <Flex justify={"center"}>
                        <CustomDependList
                            configName={configName}
                            parentName={parentName}
                            childName={childName}
                            modalTitle={modalTitle}
                        />
                    </Flex>
                </>
            ))}
        </>
        <>
            {[
                {
                    category: "خط امضا",
                    configName: "signs",
                    keyTitle: "مقام",
                    valueTitle: "نام"
                },
                {
                    category: "تیتر نامه",
                    configName: "send-letter-title",
                    keyTitle: "یگان",
                    valueTitle: "تیتر"
                },
            ].map(({category, configName, keyTitle, valueTitle}) => (
                <>
                    <Divider>{category}</Divider>
                    <Flex justify={"center"}>
                        <ObjectOneByOne
                            configName={configName}
                            keyTitle={keyTitle}
                            valueTitle={valueTitle}
                        />
                    </Flex>
                </>
            ))}
        </>
    </Flex>)
}

export default EditOptions;