import {Popover, Select, Typography} from "antd";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";

function LetterReceiver({defaultValue}) {

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const [receivers, setReceivers] = useState([]);
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("");

    useEffect(()=>{
        invoke("get_config", {configName: "send-letter-title"})
            .then((res) => {
                setReceivers(res.config.map(({key, value}) => {
                    return {
                        unit: key,
                        letterTitle: value
                    };
                }));
                setValue(defaultValue);
            })
            .catch((_) => {
            });
    }, [defaultValue]);

    useEffect(()=>{
        if (receivers.find(v=> v.unit === value) !== undefined) {
            setTitle(receivers.find(v=> v.unit === value).letterTitle)
        }
    }, [value]);

    function popoverContent() {
        return (
            <Select
                onChange={(v) => {
                    setValue(v);
                }}
                placement={"bottomRight"}
                value={value}
                placeholder={"تیتر را انتخاب کنید"}
                popupMatchSelectWidth={false}
                maxTagCount={0}
                showSearch
                filterOption={filterOption}
                options={receivers.map(({unit, letterTitle}) => {
                    return ({
                        label: letterTitle,
                        value: unit
                    });
                })}
                loading={receivers.length === 0}
                style={{width: "100%"}}
            />
        );
    }


    return(
        <Popover content={()=> popoverContent()}>
            <Typography.Text>
                {title}
            </Typography.Text>
        </Popover>
    );
}

export default LetterReceiver;