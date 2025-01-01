import {Button, Divider, Flex, Form, Input, Select, Tooltip, Typography} from "antd";
import {dateValidator} from "../../../utils/Validates.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";
import {GetQueryDate} from "../../../utils/Calculative.js";
import FolderLabelComponent from "../shared/FolderLabelComponent.jsx";


function FolderLabel() {

    const printComponent = useRef(null);
    const [pages, setPages] = useState([]);

    function chunk(arr, size) {
        return Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
            arr.slice(i * size, i * size + size));
    }

    function onFinish(value) {
        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "deployment_date": {
                    "$gte": GetQueryDate(value["from_date"]),
                    "$lte": GetQueryDate(value["to_date"]),
                }
            },
            "projection": {
                "_id": 1
            }
        }, {withCredentials: true}).then((response) => {
            setPages(chunk(chunk(response.data, 2), 6))
        }).catch((err) => {

        })
    }

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    return (
        <Flex vertical={true} style={{width: "100%"}}>
            <Flex justify={"center"}>
                <Typography.Title level={3}>
                    لیبل پرونده ها
                </Typography.Title>
            </Flex>
            <Divider/>
            <Flex style={{marginBottom: "20px"}}>
                <Form
                    layout={"inline"}
                    onFinish={onFinish}
                >
                    <Tooltip title={"از تاریخ اعزام"}>
                        <Form.Item
                            label={"از تاریخ اعزام"}
                            name={"from_date"}
                            rules={[{
                                validator: dateValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Tooltip>
                    <Tooltip title={"تا تاریخ اعزام"}>
                        <Form.Item
                            label={"تا تاریخ اعزام"}
                            name={"to_date"}
                            rules={[{
                                validator: dateValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Tooltip>

                    <Form.Item>
                        <Button block={true} type={"primary"} htmlType="submit">جستجو</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button block={true} type={"primary"} onClick={handlePrint}>پرینت</Button>
                    </Form.Item>
                </Form>
            </Flex>

            <Flex
                ref={printComponent}
                style={{width: "100%"}}
                vertical={true}
            >
                <style>
                    {`
                            @media print {
                              @page {
                                size: portrait;
                              }
                            }
                        `}
                </style>
                {
                    pages.map((page) => {
                        return (
                            <Flex vertical={true} gap={"small"} width={"100%"} align={"start"}
                                  className={"break-after A4-portrait"} justify={"center"}>
                                {
                                    page.map((row) => {
                                        return (
                                            <Flex gap={"small"} justify={"start"} width={"100%"}>
                                                {
                                                    row.map((soldier) => {
                                                        return (
                                                            <FolderLabelComponent soldierKey={soldier.key}/>
                                                        );
                                                    })
                                                }
                                            </Flex>
                                        );
                                    })
                                }
                            </Flex>
                        );
                    })
                }
            </Flex>
        </Flex>
    );
}

export default FolderLabel;