import {Button, Card, Cascader, Form, Input, Radio, Select} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function SelectFilterCard({label, configName, parentQuery, childQuery, setQuery, removeFilter, index, width, height}) {

    const [options, setOptions] = useState([]);
    const [configType, setConfigType] = useState(0);

    useEffect(() => {
        axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
            .then((response) => {
                let temp = [];
                response.data.config.forEach((value) => {
                    if (typeof (value) === "string") {
                        temp.push({
                            value: value,
                            label: value
                        });
                    } else {
                        setConfigType(1);
                        temp.push({
                            value: value.name,
                            label: value.name,
                            children: [...value.config.map(i => {
                                return ({
                                    value: i,
                                    label: i
                                })
                            })]
                        })
                    }
                });
                setOptions(temp);
            })
            .catch(() => {
            });
    }, []);

    function onFinish(e) {
        switch (configType) {
            case 0:
                setQuery((prev) => {
                    let temp = [...prev];
                    let q = {};
                    q[parentQuery] = {"$in": e.value};
                    temp[index] = q;
                    return temp;
                });
                break;
            default:
                setQuery((prev) => {
                    let temp = [...prev];
                    let q = {};
                    q[parentQuery] = {"$in": e.value.map(subArray => subArray[0])};
                    q[childQuery] = {"$in": e.value.map(subArray => subArray[1])};
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
            <Form
                size="middle"
                onFinish={onFinish}
            >
                <Form.Item
                    label={label}
                    name={"value"}
                    rules={[{
                        required: true
                    }]}
                >
                    {
                        configType
                            ?
                            <Cascader
                                showSearch
                                multiple
                                options={options}
                                showCheckedStrategy={Cascader.SHOW_CHILD}
                            />
                            :
                            <Select
                                showSearch
                                mode={"tags"}
                                options={options}
                            />
                    }
                </Form.Item>
                <Form.Item>
                    <Button type={"primary"} block={true} htmlType={"submit"}>فیلتر</Button>
                </Form.Item>
                <Form.Item>
                    <Button type={"primary"} danger={true} block={true} onClick={() => onRemove()}>حذف فیلتر</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default SelectFilterCard;