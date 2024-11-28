import {Button, Card, ConfigProvider, Form, Input, Radio, Typography} from "antd";
import {useEffect} from "react";
import {dateValidator} from "../../utils/Validates.js";
import {GetQueryDate} from "../../utils/Calculative.js";

function DateFilterCard({label, query, setQuery, removeFilter, index, width, height}) {

    const [form] = Form.useForm();
    const searchType = Form.useWatch('search_type', form);

    function onFinish(e) {
        switch (e.search_type) {
            case "exact":
                setQuery((prev) => {
                    let temp = [...prev];
                    let q = {};
                    q[query] = GetQueryDate(e.date);
                    temp[index] = q;
                    return temp;
                });
                break;
            default:
                setQuery((prev) => {
                    let temp = [...prev];
                    let q = {};
                    q[query] = {
                        "$gte": GetQueryDate(e.from_date),
                        "$lte": GetQueryDate(e.to_date)
                    };
                    temp[index] = q;
                    return temp;
                });
                break;
        }
    }

    function onRemove() {
        setQuery((prev) => {
            let temp = [...prev];
            temp.splice(index, 1);
            return temp;
        });
        removeFilter(index);
    }

    useEffect(() => {
        setQuery((prev) => {
            let temp = [...prev];
            temp[index] = {};
            return temp;
        });
    }, []);

    return (
        <Card style={{width: width, height: height}}>
            <Typography.Title level={4} style={{textAlign: "center"}}>{label}</Typography.Title>
            <ConfigProvider
                theme={{
                    components: {
                        Form: {
                            itemMarginBottom: 12
                        },
                    },
                }}
            >
                <Form
                    size="middle"
                    form={form}
                    onFinish={onFinish}
                >
                    {
                        searchType === "exact"
                            ?
                            <Form.Item
                                label={"تاریخ"}
                                name={"date"}
                                rules={[{
                                    validator: dateValidator, required: true,
                                }]}
                            >
                                <Input/>
                            </Form.Item>
                            :
                            <>
                                <Form.Item
                                    label={"از"}
                                    name={"from_date"}
                                    rules={[{
                                        validator: dateValidator, required: true,
                                    }]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    label={"تا"}
                                    name={"to_date"}
                                    rules={[{
                                        validator: dateValidator, required: true,
                                    }]}
                                >
                                    <Input/>
                                </Form.Item>
                            </>
                    }

                    <Form.Item
                        name={"search_type"}
                        initialValue={"exact"}
                        style={{width: "100%"}}
                    >
                        <Radio.Group block buttonStyle="solid">
                            <Radio.Button value="exact">برابر</Radio.Button>
                            <Radio.Button value="range">بازه</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button type={"primary"} block={true} htmlType={"submit"}>فیلتر</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type={"primary"} danger={true} block={true} onClick={() => onRemove()}>حذف
                            فیلتر</Button>
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </Card>
    );
}

export default DateFilterCard;