import {Popover, Select, Typography} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function LetterReceiver({defaultValue}) {

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const [receivers, setReceivers] = useState([]);
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("");

    useEffect(()=>{
        axios.get(getApiUrl("config/send-letter-title"), {withCredentials: true}).then((res) => {
            setReceivers(res.data.config.map(({key, value}) => {
                return {
                    unit: key,
                    letterTitle: value
                };
            }));
            setValue(defaultValue);
        }).catch(() => {
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