import {useEffect, useState} from "react";
import {Col, Form, Select} from "antd";

const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

function PairedSelect({data, parentName, ChildName, parentLabel, ChildLabel}) {

    const [parentData, setParentData] = useState([]);
    const [childData, setChildData] = useState([]);

    const onParentChange = (value) => {
        console.log(value);
        setChildData(data.find(v=>v.name === value).config.map(v=> {
            return(
                {
                    value: v,
                    label: v
                }
            );
        }));
    }

    useEffect(() => {
        setParentData([...data.map(v=> {
            return ({
                value: v.name,
                label: v.name
            });
        })]);
    }, [data]);


    return (
        <>
            <Col flex={1}>
                <Form.Item
                    name={parentName}
                    label={parentLabel}
                    rules={[{
                        required: true,
                    }]}
                >
                    <Select
                        showSearch
                        filterOption={filterOption}
                        options={parentData}
                        loading={parentData.length === 0}
                        onChange={onParentChange}
                    />
                </Form.Item>
            </Col>
            <Col flex={1}>
                <Form.Item
                    name={ChildName}
                    label={ChildLabel}
                    rules={[{
                        required: true,
                    }]}
                >
                    <Select
                        showSearch
                        filterOption={filterOption}
                        options={childData}
                        loading={childData.length === 0}
                    />
                </Form.Item>
            </Col>
        </>
    );
}

export {PairedSelect};