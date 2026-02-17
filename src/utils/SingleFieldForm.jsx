import {Button, Flex, Input, InputNumber, Radio, Select, Tag, Tooltip, Typography} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined, StopOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import {getTagColor} from "./Color.js";
import axios from "axios";
import {getApiUrl} from "./Config.js";

const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

function InputFieldForm({label, validator, initValue, onConfirmEdit, notEditable}) {
    const [isEditable, setIsEditable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const inputRef = useRef(null);

    function onConfirm() {
        const value = inputRef.current.input.value;
        validator({'required': true}, value)
            .then((res)=>{
                onConfirmEdit(value);
                setIsEditable(false);
                setErrorMessage("");
            })
            .catch((err)=>{
                setErrorMessage(err.toString());
            });
    }

    function onCancel() {
        inputRef.current.input.value = initValue;
        setIsEditable(false);
        setErrorMessage("");
    }

    return (
        <Flex vertical={true}>
            <Flex vertical={false} align={"center"} >
                <Typography.Text>{label}</Typography.Text>
                {
                    isEditable
                        ?
                        <Flex>
                            <Tooltip title={"ثبت"}>
                                <Button type={"text"} icon={<CheckOutlined style={{color: "lime"}}/>} onClick={onConfirm}/>
                            </Tooltip>
                            <Tooltip title={"لغو"}>
                                <Button type={"text"} icon={<CloseOutlined style={{color: "red"}}/>} onClick={onCancel}/>
                            </Tooltip>
                        </Flex>
                        : notEditable
                            ?
                            <Flex>
                                <Tooltip title={"قابل ویرایش نمیباشد"}>
                                    <StopOutlined />
                                </Tooltip>
                            </Flex>
                        :
                        <Flex>
                            <Tooltip title={"ویرایش"}>
                                <Button type={"text"} icon={<EditOutlined/>} onClick={() => setIsEditable(true)}/>
                            </Tooltip>
                        </Flex>
                }
            </Flex>
            {
                isEditable
                    ?
                    <>
                        <Input ref={inputRef} defaultValue={initValue} onPressEnter={onConfirm} status={errorMessage === "" ? null : "error"} style={{width:"80%"}}/>
                        <Typography.Text style={{color: "red"}}>{errorMessage}</Typography.Text>
                    </>
                    :
                    <Typography.Text>{initValue}</Typography.Text>
            }
        </Flex>
    );
}

function NumberFieldForm({label, validator, initValue, onConfirmEdit, addonAfter}) {
    const [isEditable, setIsEditable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [value, setValue] = useState(null);
    const inputRef = useRef(null);

    function onConfirm() {
        if (value === null) {
            return;
        }
        if (validator === undefined) {
            onConfirmEdit(value);
            setIsEditable(false);
            setErrorMessage("");
        }
        else {
            validator({'required': true}, value)
                .then((res)=>{
                    onConfirmEdit(value);
                    setIsEditable(false);
                    setErrorMessage("");
                })
                .catch((err)=>{
                    setErrorMessage(err.toString());
                });
        }
    }

    function onCancel() {
        setIsEditable(false);
        setErrorMessage("");
    }

    return (
        <Flex vertical={true}>
            <Flex vertical={false} align={"center"} >
                <Typography.Text>{label}</Typography.Text>
                {
                    isEditable
                        ?
                        <Flex>
                            <Tooltip title={"ثبت"}>
                                <Button type={"text"} icon={<CheckOutlined style={{color: "lime"}}/>} onClick={onConfirm}/>
                            </Tooltip>
                            <Tooltip title={"لغو"}>
                                <Button type={"text"} icon={<CloseOutlined style={{color: "red"}}/>} onClick={onCancel}/>
                            </Tooltip>
                        </Flex>
                        :
                        <Flex>
                            <Tooltip title={"ویرایش"}>
                                <Button type={"text"} icon={<EditOutlined/>} onClick={() => setIsEditable(true)}/>
                            </Tooltip>
                        </Flex>
                }
            </Flex>
            {
                isEditable
                    ?
                    <>
                        <InputNumber ref={inputRef} onChange={(v)=> setValue(v)} min={0} defaultValue={initValue} onPressEnter={onConfirm} status={errorMessage === "" ? null : "error"} style={{width:"80%"}} addonAfter={addonAfter}/>
                        <Typography.Text style={{color: "red"}}>{errorMessage}</Typography.Text>
                    </>
                    :
                    <Typography.Text>{initValue}</Typography.Text>
            }
        </Flex>
    );
}

function TagSelectFieldForm({label, validator, initValue, onConfirmEdit, options}) {
    const [isEditable, setIsEditable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [value, setValue] = useState(null);
    const inputRef = useRef(null);

    function onConfirm() {
        if (value === null) {
            return;
        }
        if (validator === undefined) {
            onConfirmEdit(value);
            setIsEditable(false);
            setErrorMessage("");
        }
        else {
            validator({'required': true}, value)
                .then((res)=>{
                    onConfirmEdit(value);
                    setIsEditable(false);
                    setErrorMessage("");
                })
                .catch((err)=>{
                    setErrorMessage(err.toString());
                });
        }
    }

    function onCancel() {
        setIsEditable(false);
        setErrorMessage("");
    }

    return (
        <Flex vertical={true}>
            <Flex vertical={false} align={"center"} >
                <Typography.Text>{label}</Typography.Text>
                {
                    isEditable
                        ?
                        <Flex>
                            <Tooltip title={"ثبت"}>
                                <Button type={"text"} icon={<CheckOutlined style={{color: "lime"}}/>} onClick={onConfirm}/>
                            </Tooltip>
                            <Tooltip title={"لغو"}>
                                <Button type={"text"} icon={<CloseOutlined style={{color: "red"}}/>} onClick={onCancel}/>
                            </Tooltip>
                        </Flex>
                        :
                        <Flex>
                            <Tooltip title={"ویرایش"}>
                                <Button type={"text"} icon={<EditOutlined/>} onClick={() => setIsEditable(true)}/>
                            </Tooltip>
                        </Flex>
                }
            </Flex>
            {
                isEditable
                    ?
                    <>
                        <Select
                            mode={"tags"}
                            onChange={(v)=> setValue(v)}
                            options={options}
                            defaultValue={initValue}
                            status={errorMessage === "" ? null : "error"}
                        />
                        <Typography.Text style={{color: "red"}}>{errorMessage}</Typography.Text>
                    </>
                    : initValue
                        ?
                            <Flex wrap={true}>
                                {initValue.map((elem) => {
                                    return (
                                        <Tag color={getTagColor(elem)}>{elem}</Tag>
                                    );
                                })}
                            </Flex>
                        :
                            <></>
            }
        </Flex>
    );
}

function SelectFieldForm({label, validator, initValue, onConfirmEdit, configName, addable}) {
    const [isEditable, setIsEditable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState("");

    const selectRef = useRef(null);

    useEffect(() => {
        setValue(initValue);
        axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
            .then((response) => {
                let res = response.data;
                let temp = [];
                res.config.forEach((value) => {
                    temp.push({
                        value: value,
                        label: value
                    });
                });
                setOptions(temp);
            })
            .catch(() => {
            });
    }, []);

    function onConfirm() {
        if (value === undefined) {
            return;
        }
        if (validator === undefined) {
            onConfirmEdit(value);
            setIsEditable(false);
            setErrorMessage("");
        }
        else {
            validator({'required': true}, value)
                .then((res)=>{
                    onConfirmEdit(value);
                    setIsEditable(false);
                    setErrorMessage("");
                })
                .catch((err)=>{
                    setErrorMessage(err.toString());
                });
        }
    }

    function onCancel() {
        setIsEditable(false);
        setErrorMessage("");
    }

    return (
        <Flex vertical={true}>
            <Flex vertical={false} align={"center"} >
                <Typography.Text>{label}</Typography.Text>
                {
                    isEditable
                        ?
                        <Flex>
                            <Tooltip title={"ثبت"}>
                                <Button type={"text"} icon={<CheckOutlined style={{color: "lime"}}/>} onClick={onConfirm}/>
                            </Tooltip>
                            <Tooltip title={"لغو"}>
                                <Button type={"text"} icon={<CloseOutlined style={{color: "red"}}/>} onClick={onCancel}/>
                            </Tooltip>
                        </Flex>
                        :
                        <Flex>
                            <Tooltip title={"ویرایش"}>
                                <Button type={"text"} icon={<EditOutlined/>} onClick={() => setIsEditable(true)}/>
                            </Tooltip>
                        </Flex>
                }
            </Flex>
            {
                isEditable
                    ?
                    addable
                        ?
                        <>
                            <Select
                                ref={selectRef}
                                mode={"tags"}
                                maxCount={1}
                                showSearch
                                filterOption={filterOption}
                                options={options}
                                defaultValue={initValue}
                                loading={options.length === 0}
                                status={errorMessage === "" ? null : "error"}
                                style={{width:"80%"}}
                                onChange={(v)=>setValue(v)}

                            />
                            <Typography.Text style={{color: "red"}}>{errorMessage}</Typography.Text>
                        </>
                        :
                        <>
                            <Select
                                ref={selectRef}
                                showSearch
                                filterOption={filterOption}
                                options={options}
                                defaultValue={initValue}
                                loading={options.length === 0}
                                status={errorMessage === "" ? null : "error"}
                                style={{width:"80%"}}
                                onChange={(v)=>setValue(v)}

                            />
                            <Typography.Text style={{color: "red"}}>{errorMessage}</Typography.Text>
                        </>
                    :
                    <Typography.Text>{initValue}</Typography.Text>
            }
        </Flex>
    );
}

function BooleanFieldForm({label, initValue, initLabel, onConfirmEdit, trueLabel, falseLabel}) {
    const [isEditable, setIsEditable] = useState(false);
    const [value, setValue] = useState("");

    const selectRef = useRef(null);

    useEffect(() => {
        setValue(initValue);
    }, []);

    function onConfirm() {
        onConfirmEdit(value);
        setIsEditable(false);
    }

    function onCancel() {
        setIsEditable(false);
    }

    return (
        <Flex vertical={true}>
            <Flex vertical={false} align={"center"} >
                <Typography.Text>{label}</Typography.Text>
                {
                    isEditable
                        ?
                        <Flex>
                            <Tooltip title={"ثبت"}>
                                <Button type={"text"} icon={<CheckOutlined style={{color: "lime"}}/>} onClick={onConfirm}/>
                            </Tooltip>
                            <Tooltip title={"لغو"}>
                                <Button type={"text"} icon={<CloseOutlined style={{color: "red"}}/>} onClick={onCancel}/>
                            </Tooltip>
                        </Flex>
                        :
                        <Flex>
                            <Tooltip title={"ویرایش"}>
                                <Button type={"text"} icon={<EditOutlined/>} onClick={() => setIsEditable(true)}/>
                            </Tooltip>
                        </Flex>
                }
            </Flex>
            {
                isEditable
                    ?
                    <Radio.Group size="large" defaultValue={initValue} onChange={(v)=> setValue(v.target.value)}>
                        <Radio.Button value={true}>{trueLabel}</Radio.Button>
                        <Radio.Button value={false}>{falseLabel}</Radio.Button>
                    </Radio.Group>
                    :
                    <Typography.Text>{initLabel}</Typography.Text>
            }
        </Flex>
    );
}

function PairedSelectFieldForm({label, initParentValue, initChildValue, onConfirmEdit, configName}) {
    const [isEditable, setIsEditable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [parentOptions, setParentOptions] = useState([]);
    const [childOptions, setChildOptions] = useState([]);
    const [data, setData] = useState([]);
    const [parentValue, setParentValue] = useState("");
    const [childValue, setChildValue] = useState("");


    useEffect(() => {
        axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
            .then((response) => {
                let res = response.data;
                setData(res.config);
                setParentOptions(res.config.map(v=>{
                    return({
                        value: v.name,
                        label: v.name,
                    })
                }));
                setChildOptions(res.config.find(v=>v.name===initParentValue).config.map(v=>{
                    return({
                        value: v,
                        label: v,
                    })
                }));
                setParentValue(initParentValue);
                setChildValue(initChildValue);
            })
            .catch(() => {
            });
    }, [initParentValue]);

    useEffect(() => {
        axios.get(getApiUrl(`config/${configName}`), {withCredentials: true})
            .then((response) => {
                let res = response.data;
                setData(res.config);
                setParentOptions(res.config.map(v=>{
                    return({
                        value: v.name,
                        label: v.name,
                    })
                }));
                setChildOptions(res.config.find(v=>v.name===parentValue).config.map(v=>{
                    return({
                        value: v,
                        label: v,
                    })
                }));
            })
            .catch(() => {
            });
    }, [parentValue]);

    function onConfirm() {
        if (parentValue === undefined) {
            return;
        }
        if (childValue === undefined) {
            return;
        }
        const childOptions = data.find(v=>v.name === parentValue);
        if (childOptions === undefined) {
            setErrorMessage("قسمت در یگان یافت نشد");
            return;
        }
        if (childOptions.config.find(v=> v===childValue) === undefined) {
            setErrorMessage("قسمت در یگان یافت نشد");
            return;
        }
        onConfirmEdit(parentValue, childValue);
        setIsEditable(false);
        setErrorMessage("");
    }

    function onCancel() {
        setIsEditable(false);
        setErrorMessage("");
        setParentValue(initParentValue);
        setChildValue(initChildValue);
    }

    return (
        <Flex vertical={true}>
            <Flex vertical={false} align={"center"} >
                <Typography.Text>{label}</Typography.Text>
                {
                    isEditable
                        ?
                        <Flex>
                            <Tooltip title={"ثبت"}>
                                <Button type={"text"} icon={<CheckOutlined style={{color: "lime"}}/>} onClick={onConfirm}/>
                            </Tooltip>
                            <Tooltip title={"لغو"}>
                                <Button type={"text"} icon={<CloseOutlined style={{color: "red"}}/>} onClick={onCancel}/>
                            </Tooltip>
                        </Flex>
                        :
                        <Flex>
                            <Tooltip title={"ویرایش"}>
                                <Button type={"text"} icon={<EditOutlined/>} onClick={() => setIsEditable(true)}/>
                            </Tooltip>
                        </Flex>
                }
            </Flex>
            {
                isEditable
                    ?
                    <>
                        <Flex>
                            <Flex flex={1}>
                                <Select
                                    showSearch
                                    filterOption={filterOption}
                                    options={parentOptions}
                                    defaultValue={initParentValue}
                                    loading={parentOptions.length === 0}
                                    status={errorMessage === "" ? null : "error"}
                                    style={{width:"80%"}}
                                    onChange={(v)=>setParentValue(v)}
                                />
                            </Flex>
                            <Flex flex={1}>
                                <Select
                                    showSearch
                                    filterOption={filterOption}
                                    options={childOptions}
                                    defaultValue={initChildValue}
                                    loading={childOptions.length === 0}
                                    status={errorMessage === "" ? null : "error"}
                                    style={{width:"80%"}}
                                    onChange={(v)=>setChildValue(v)}
                                />
                            </Flex>
                        </Flex>
                        <Typography.Text style={{color: "red"}}>{errorMessage}</Typography.Text>
                    </>
                    :
                    <Flex vertical={false} gap={"large"}>
                            <Typography.Text>{initParentValue}</Typography.Text>
                        <> - </>
                            <Typography.Text>{initChildValue}</Typography.Text>
                    </Flex>
            }
        </Flex>
    );
}


export {InputFieldForm, SelectFieldForm, NumberFieldForm, PairedSelectFieldForm, TagSelectFieldForm, BooleanFieldForm};