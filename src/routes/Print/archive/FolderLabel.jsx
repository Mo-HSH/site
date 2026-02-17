import { Input, Button, Divider, Flex, Form, Typography } from "antd";
import { useCallback, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { getApiUrl } from "../../../utils/Config.js";
import { GetQueryDate } from "../../../utils/Calculative.js";
import FolderLabelComponent from "../shared/FolderLabelComponent.jsx";
import { InputDatePicker } from "jalaali-react-date-picker";
import "jalaali-react-date-picker/lib/styles/index.css";

function FolderLabel() {
    const printComponent = useRef(null);
    const [pages, setPages] = useState([]);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [nationalCode, setNationalCode] = useState(null);

    function chunk(arr, size) {
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    }

    function onFinish() {
        // Prepare filter object
        const filter = {};

        // Handle date filtering with guard
        if (fromDate && fromDate.format) {
            filter.deployment_date = filter.deployment_date || {};
            filter.deployment_date.$gte = GetQueryDate(fromDate.format('jYYYY/jMM/jDD'));
        }

        if (toDate && toDate.format) {
            filter.deployment_date = filter.deployment_date || {};
            filter.deployment_date.$lte = GetQueryDate(toDate.format('jYYYY/jMM/jDD'));
        }

        // Handle national code filter
        if (nationalCode) {
            filter.national_code = filter.national_code || {};
            filter.national_code.$eq = nationalCode;
        }

        axios
            .post(
                getApiUrl("soldier/list"),
                {
                    filter: filter,
                    projection: {
                        _id: 1,
                    },
                },
                { withCredentials: true }
            )
            .then((response) => {
                setPages(chunk(chunk(response.data, 2), 6));
            })
            .catch((err) => {
                // handle error if needed
            });
    }

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true,
    });

    return (
        <Flex vertical={true} style={{ width: "100%" }}>
            <Flex justify="center">
                <Typography.Title level={3}>لیبل پرونده ها</Typography.Title>
            </Flex>
            <Divider />
            <Flex style={{ marginBottom: "10px" }}>
                <Form layout="inline" onFinish={onFinish}>
                    <Form.Item label="از تاریخ اعزام" name="from_date">
                        <InputDatePicker
                            value={fromDate}
                            format="jYYYY/jMM/jDD"
                            onChange={(date) => setFromDate(date)}
                        />
                    </Form.Item>

                    <Form.Item label="تا تاریخ اعزام" name="to_date">
                        <InputDatePicker
                            value={toDate}
                            format="jYYYY/jMM/jDD"
                            onChange={(date) => setToDate(date)}
                        />
                    </Form.Item>

                    <Form.Item label="کد ملی" name="national_code">
                        <Input
                            value={nationalCode}
                            onChange={(e) => setNationalCode(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            جستجو
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" onClick={handlePrint}>
                            پرینت
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>

            <Flex ref={printComponent} style={{ width: "100%" }} vertical>
                <style>
                    {`
            @media print {
              @page {
                size: portrait;
              }
            }
          `}
                </style>
                {pages.map((page, index) => (
                    <Flex
                        key={index}
                        vertical
                        gap="small"
                        width="100%"
                        align="start"
                        className="break-after A4-portrait"
                        justify="center"
                    >
                        {page.map((row, rowIndex) => (
                            <Flex key={rowIndex} gap="small" justify="start" width="100%">
                                {row.map((soldier) => (
                                    <FolderLabelComponent key={soldier.key} soldierKey={soldier.key} />
                                ))}
                            </Flex>
                        ))}
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}

export default FolderLabel;