import moment from "jalali-moment";
import axios from "axios";
import {getApiUrl} from "./Config.js";

function GetDutyDuration(oid, jDate) {
    return axios.post(getApiUrl(`soldier/get_duty_duration/${oid}`), {end_span: jDate? jDate : ""}, {withCredentials: true}).then((res) => {
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
    const unix = `${moment(`${jDate} 00:00:00`, 'jYYYY/jMM/jDD HH:mm:ss').utc().unix() * 1000}`;
    return ({"$date": {"$numberLong": unix}});
}

function GetDateMinus(jDate, Month) {
    let res = moment(`${jDate} 00:00:00`, 'jYYYY/jMM/jDD HH:mm:ss');
    const unix = res.subtract(Month, 'month').utc().unix() * 1000;
    return ({"$date": {"$numberLong": `${unix}`}});
}

function GetYear(jDate) {
    let res = moment(`${jDate} 00:00:00`, 'jYYYY/jMM/jDD HH:mm:ss');
    return res.jYear();
}

export {GetDutyDuration, IsDutyStopped, GetQueryDate, GetDateMinus, GetYear};