import {invoke} from "@tauri-apps/api/core";
import moment from "jalali-moment";

function GetDutyDuration(oid) {
    return invoke("get_duty_duration", {"oid": oid})
        .then((res)=>{
            return Promise.resolve(res);
        })
        .catch((err)=>{
            console.log(err);
            return Promise.reject(new Error(err));
        })
}

function IsDutyStopped(oid) {
    return invoke("get_duty_run_stop", {"oid": oid})
        .then((res)=>{
            if (res === "") {
                return Promise.resolve({stop: false, text: res});
            } else {
                return Promise.resolve({stop: true, text: "فرار"});
            }
        })
        .catch((err)=>{
            console.log(err);
            return Promise.reject(new Error(err));
        })
}

function GetQueryDate(jDate) {
    const unix = `${moment(`${jDate}03:30:00`, 'jYYYY/jMM/jDD HH:mm:ss').utc().unix() * 1000}`;
    return ({"$date": {"$numberLong": unix}});
}

export {GetDutyDuration, IsDutyStopped, GetQueryDate};