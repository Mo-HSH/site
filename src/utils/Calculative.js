import moment from "jalali-moment";
import axios from "axios";
import {getApiUrl} from "./Config.js";

function GetDutyDuration(oid) {
    return axios.get(getApiUrl(`soldier/get_duty_duration/${oid}`), {withCredentials: true}).then((res) => {
        return Promise.resolve(res.data);
    }).catch((err)=>{
        console.log(err);
        return Promise.reject(new Error(err));
    });
}

function IsDutyStopped(oid) {
    return axios.get(getApiUrl(`document/run/duty_stop/${oid}`), {withCredentials: true}).then((res) => {
        if (res.data === "") {
            return Promise.resolve({stop: false, text: res.data});
        } else {
            return Promise.resolve({stop: true, text: "فرار"});
        }
    }).catch((err)=>{
        console.log(err);
        return Promise.reject(new Error(err));
    })
}

function GetQueryDate(jDate) {
    const unix = `${moment(`${jDate}03:30:00`, 'jYYYY/jMM/jDD HH:mm:ss').utc().unix() * 1000}`;
    return ({"$date": {"$numberLong": unix}});
}

export {GetDutyDuration, IsDutyStopped, GetQueryDate};