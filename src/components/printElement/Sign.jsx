import {Flex, Popover, Select, Typography} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";


const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

function Single({defaultSign, fontSize, forceRefresh}) {

    const [value, setValue] = useState({title: "", signer: ""});
    const [selectValue, setSelectValue] = useState("");

    const[signs, setSigns] = useState([]);

    useEffect(() => {
        axios.get(getApiUrl("config/signs"), {withCredentials: true}).then((res) => {
            setSigns(res.data.config.map(({key, value}) => {
                return {
                    title: key,
                    signer: value
                };
            }))
        }).catch(() => {
        });
    }, []);

    useEffect(() => {
        if (forceRefresh !== true) {
            if (selectValue !== "") {
                return;
            }
            if (signs === undefined) {
                return;
            }
        }
        const temp = signs.find(e=> e.title === defaultSign);
        if (temp === undefined) {
            return;
        }
        setValue(temp);
        setSelectValue(temp.title);
    }, [defaultSign, signs]);

    function popoverContent() {
        return (
            <Select
                onChange={(v) => {
                    setSelectValue(v);
                    const temp = signs.find(e=> e.title === v);
                    if (temp === undefined) {
                        return;
                    }
                    setValue(temp);
                }}
                placement={"bottomRight"}
                value={selectValue}
                placeholder={"امضا را انتخاب کنید"}
                popupMatchSelectWidth={false}
                maxTagCount={0}
                showSearch
                filterOption={filterOption}
                options={signs.map(({title, signer}) => {
                    return ({
                        label: title + " - " + signer,
                        value: title
                    });
                })}
                loading={signs.length === 0}
                style={{width: "100%"}}
            />
        );
    }

    return (
        <Popover content={()=> popoverContent()}>
            <Flex vertical={true} justify={"center"} align={"center"}>
                <Typography.Text style={{fontSize: `${fontSize}px`, fontWeight: "bold"}}>{value.title}</Typography.Text>
                <Typography.Text style={{fontSize: `${fontSize}px`, fontWeight: "bold"}}>{value.signer}</Typography.Text>
            </Flex>
        </Popover>
    );
}

function SingleInline({defaultSign, fontSize}) {

    const [value, setValue] = useState({title: "", signer: ""});
    const [selectValue, setSelectValue] = useState("");

    const[signs, setSigns] = useState([]);

    useEffect(() => {
        axios.get(getApiUrl("config/signs"), {withCredentials: true}).then((res) => {
            setSigns(res.data.config.map(({key, value}) => {
                return {
                    title: key,
                    signer: value
                };
            }))
        }).catch(() => {
        });
    }, []);

    useEffect(() => {
        if (selectValue !== "") {
            return;
        }
        if (signs === undefined) {
            return;
        }
        const temp = signs.find(e=> e.title === defaultSign);
        if (temp === undefined) {
            return;
        }
        setValue(temp);
        setSelectValue(temp.title);
    }, [defaultSign, signs]);

    function popoverContent() {
        return (
            <Select
                onChange={(v) => {
                    setSelectValue(v);
                    const temp = signs.find(e=> e.title === v);
                    if (temp === undefined) {
                        return;
                    }
                    setValue(temp);
                }}
                placement={"bottomRight"}
                value={selectValue}
                placeholder={"امضا را انتخاب کنید"}
                popupMatchSelectWidth={false}
                maxTagCount={0}
                showSearch
                filterOption={filterOption}
                options={signs.map(({title, signer}) => {
                    return ({
                        label: title + " - " + signer,
                        value: title
                    });
                })}
                loading={signs.length === 0}
                style={{width: "100%"}}
            />
        );
    }

    return (
        <Popover content={()=> popoverContent()}>
            <Flex gap={"small"} justify={"center"} align={"center"}>
                <Typography.Text style={{fontSize: `${fontSize}px`, fontWeight: "bold"}}>{value.title}</Typography.Text>
                <Typography.Text>-</Typography.Text>
                <Typography.Text style={{fontSize: `${fontSize}px`, fontWeight: "bold"}}>{value.signer}</Typography.Text>
            </Flex>
        </Popover>
    );
}


function MultiInline({defaultSign, fontSize, singGap}) {

    const [value, setValue] = useState([]);
    const [selectValue, setSelectValue] = useState([]);

    const[signs, setSigns] = useState([]);

    useEffect(() => {
        axios.get(getApiUrl("config/signs"), {withCredentials: true}).then((res) => {
            setSigns(res.data.config.map(({key, value}) => {
                return {
                    title: key,
                    signer: value
                };
            }))
        }).catch(() => {
        });
    }, []);

    useEffect(() => {
        if (selectValue === []) {
            return;
        }
        if (signs === undefined) {
            return;
        }

        setSelectValue(defaultSign);
        let temp = [];
        defaultSign.forEach(v=>{
            const t = signs.find(e=> e.title === v);
            if (t !== undefined) {
                temp.push(t)
            }
        })
        setValue(temp);
    }, [defaultSign, signs]);

    function popoverContent() {
        return (
            <Select
                onChange={(v) => {
                    setSelectValue(v);
                    let temp = [];
                    v.forEach(v=>{
                        const t = signs.find(e=> e.title === v);
                        if (t !== undefined) {
                            temp.push(t)
                        }
                    })
                    setValue(temp);
                }}
                placement={"bottomRight"}
                value={selectValue}
                placeholder={"امضا را انتخاب کنید"}
                popupMatchSelectWidth={false}
                mode="tags"
                showSearch
                filterOption={filterOption}
                options={signs.map(({title, signer}) => {
                    return ({
                        label: title + " - " + signer,
                        value: title
                    });
                })}
                loading={signs.length === 0}
                style={{width: "100%"}}
            />
        );
    }

    return (
        <Popover content={()=> popoverContent()}>
            <Flex style={{width: "100%"}} vertical={true} gap={singGap} justify={"center"} align={"end"}>
                {
                    value.map((v)=>{
                        return (<Flex align={"center"} gap={"small"}>
                            <Typography.Text style={{fontSize: `${fontSize}px`, fontWeight: "bold"}}>{v.title}</Typography.Text>
                            <Typography.Text>-</Typography.Text>
                            <Typography.Text style={{fontSize: `${fontSize}px`, fontWeight: "bold"}}>{v.signer}</Typography.Text>
                        </Flex>);
                    })
                }
            </Flex>
        </Popover>
    );
}


const Sign = {
    Single,
    SingleInline,
    MultiInline
};
export default Sign;