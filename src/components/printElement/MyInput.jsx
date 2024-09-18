import {useEffect, useState} from "react";
import {Input} from "antd";

function MyInput({defaultValue, className}) {

    const [value, setValue] = useState("")

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);


    return(
        <Input.TextArea autoSize={true} variant={"borderless"} value={value} onChange={e=>setValue(e.target.value)} className={className}/>
    );
}

export default MyInput;