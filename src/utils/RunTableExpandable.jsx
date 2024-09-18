import {Button, Col, Flex, Form, Input, InputNumber, Row, Select, Typography} from "antd";
import {dateValidator} from "./Validates.js";
import {numberTh} from "./Data.js";
import {useEffect, useState} from "react";


function RunTableExpandable({value, onEditRun}){

    const [record, setRecord] = useState(value);
    const [form] = Form.useForm();

    useEffect(()=>{
        setRecord(value);
    }, [value]);

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Flex vertical={true}>
            <Flex>

            </Flex>
            <Flex style={{width:"100%"}}>
                <Form
                    form={form}
                    initialValues={record}
                    style={{width:"100%"}}
                    onFinish={()=>{onEditRun(record.key, form).then().catch(err=>{console.log(err)})}}
                >
                    <Row gutter={[24,12]} style={{width:"100%"}}>
                        <Col span={12}>
                            <Flex justify={"center"}>
                                <Typography.Title level={"h5"}>فرار</Typography.Title>
                            </Flex>
                            <Form.Item
                                label={"تاریخ نهست"}
                                name={"absence_date"}
                                rules={[{
                                    validator: dateValidator, required: false
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"شماره نامه"}
                                name={"run_letter_number"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"صادره از"}
                                name={"run_letter_sender"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"تاریخ نامه"}
                                name={"run_letter_date"}
                                rules={[{
                                    validator: dateValidator, required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"ماده دستور فرار"}
                                name={"md_run"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"مرحله فرار"}
                                name={"run_count"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <Select
                                    showSearch
                                    filterOption={filterOption}
                                    options={numberTh}
                                />
                            </Form.Item>

                            <Form.Item
                                label={"وضعیت فرار"}
                                name={"run_status"}
                                rules={[{
                                    required: true,
                                }]}
                            >
                                <Select
                                    showSearch
                                    filterOption={filterOption}
                                    options={[
                                        {
                                            title: "ثبت اولیه",
                                            value: "ثبت اولیه"
                                        },
                                        {
                                            title: "صدور ماده دستور فرار",
                                            value: "صدور ماده دستور فرار"
                                        },
                                        {
                                            title: "اتمام ماده دستور فرار",
                                            value: "اتمام ماده دستور فرار"
                                        },
                                        {
                                            title: "بازگشت اولیه",
                                            value: "بازگشت اولیه"
                                        },
                                        {
                                            title: "اعزام به قضایی",
                                            value: "اعزام به قضایی"
                                        },
                                        {
                                            title: "اعزام به یگان",
                                            value: "اعزام به یگان"
                                        },
                                        {
                                            title: "صدور ماده دستور مراجعت",
                                            value: "صدور ماده دستور مراجعت"
                                        },
                                        {
                                            title: "اتمام ماده دستور مراجعت",
                                            value: "اتمام ماده دستور مراجعت"
                                        },
                                        {
                                            title: "فرار بالای 6 ماه",
                                            value: "فرار بالای 6 ماه"
                                        },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label={"مدت فرار"}
                                name={"run_duration"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <InputNumber disabled min={0} addonAfter={"روز"}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Flex justify={"center"}>
                                <Typography.Title level={"h5"}>مراجعت</Typography.Title>
                            </Flex>
                            <Form.Item
                                label={"تاریخ مراجعت"}
                                name={"return_date"}
                                rules={[{
                                    validator: dateValidator, required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"شماره نامه"}
                                name={"return_letter_number"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"صادره از"}
                                name={"return_letter_sender"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"تاریخ نامه"}
                                name={"return_letter_date"}
                                rules={[{
                                    validator: dateValidator, required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"ماده دستور مراجعت"}
                                name={"md_return"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label={"اضافه خدمت تنبیهی"}
                                name={"run_punish"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <InputNumber min={0} style={{width:"100%"}}/>
                            </Form.Item>

                            <Form.Item
                                label={"حکم قضایی"}
                                name={"court_order"}
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <Select
                                    showSearch
                                    mode={"tags"}
                                    maxCount={1}
                                    filterOption={filterOption}
                                    options={[
                                        {
                                            title: "جریمه نقدی",
                                            value: "جریمه نقدی"
                                        },
                                        {
                                            title: "اضافه خدمت",
                                            value: "اضافه خدمت"
                                        },
                                        {
                                            title: "کان لم یکن",
                                            value: "کان لم یکن"
                                        },
                                        {
                                            title: "معاف از کیفر",
                                            value: "معاف از کیفر"
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            ثبت
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
        </Flex>
    );
}

export default RunTableExpandable;