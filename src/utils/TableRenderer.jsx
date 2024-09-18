import moment from "jalali-moment";
import {Button, Flex, Spin, Tag, Tooltip} from "antd";
import {getTagColor} from "./Color.js";

function DateRenderer(value) {
    try {
        return moment.unix(value["$date"]["$numberLong"] / 1000).format('YYYY/MM/DD');
    } catch (e) {
        return (<Spin/>);
    }
}

function OpenProfileRenderer(value, tooltipTitle, icon, onClick) {
    return (<Tooltip title={tooltipTitle}> <Button type={"text"} icon={icon} onClick={onClick}/></Tooltip>);
}

function ExtraInfoRenderer(value) {
    return (
        <Flex wrap gap={"small"}>
            {
                value.map((tag)=>{
                    return (<Tag color={getTagColor(tag)}>{tag}</Tag>);
                })
            }
        </Flex>
    );
}

function NativeRenderer(value) {
    try {
        return value ? "بومی" : "غیر بومی";
    } catch (e) {
        return (<Spin/>);
    }
}

function DutyGroupRenderer(value) {
    try {
        return value ? "رزمی" : "غیر رزمی";
    } catch (e) {
        return (<Spin/>);
    }
}

export {DateRenderer, OpenProfileRenderer, ExtraInfoRenderer, NativeRenderer, DutyGroupRenderer};