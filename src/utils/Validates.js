import {getApiUrl} from './Config.js';

import axios from "axios";

function passAnywayValidator(rule, value) {
    return Promise.resolve();
}

function justStringValidator(rule, value) {
    if (!rule['required'] && (value === undefined || value === "")) {
        return Promise.resolve();
    }
    let alphabeticRegex = /^[\u0600-\u06FF\s]+$/;
    if (alphabeticRegex.test(value)) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("ورودی فقط میتواند حروف الفبای فارسی باشد."));
    }
}

function justNumericValidator(rule, value) {
    if (!rule['required'] && (value === undefined || value === "")) {
        return Promise.resolve();
    }
    let alphabeticRegex = /^[0-9]+$/;
    if (alphabeticRegex.test(value)) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("ورودی فقط میتواند اعداد باشد."));
    }
}

function registerNationalCodeValidator(rule, value) {
    if (!rule['required'] && (value === undefined || value === "")) {
        return Promise.resolve();
    }
    let numericRegex = /^[0-9]+$/;
    if (numericRegex.test(value)) {
        if (value.length === 10) {
            return axios.get(getApiUrl(`soldier/exist-check/${value}`), {
                withCredentials: true, validateStatus: (status) => {
                    return status === 404;
                }
            }).then(() => {
                return Promise.resolve();
            }).catch((error) => {
                if (error.status === 401) {
                    return Promise.reject(new Error("دسترسی غیرمجاز میباشد."));
                }
                return Promise.reject(new Error("کد ملی قبلا ثبت نام شده است."));
            })
        } else {
            return Promise.reject(new Error("کد ملی وارد شده باید 10 رقمی باشد."));
        }
    } else {
        return Promise.reject(new Error("ورودی فقط میتواند اعداد باشد."));
    }
}

function nationalCodeValidator(rule, value) {
    if (!rule['required'] && (value === undefined || value === "")) {
        return Promise.resolve();
    }
    let numericRegex = /^[0-9]+$/;
    if (numericRegex.test(value)) {
        if (value.length === 10) {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error("کد ملی وارد شده باید 10 رقمی باشد."));
        }
    } else {
        return Promise.reject(new Error("ورودی فقط میتواند اعداد باشد."));
    }
}

function dateValidator(rule, value) {
    if (!rule['required'] && (value === undefined || value === "")) {
        return Promise.resolve();
    }

    let regex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    if (!regex.test(value))
        return Promise.reject(new Error("فرمت تاریخ اشتباه هست."));

    // Parse the date parts to integers
    let parts = value.split("/");
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1]);
    let day = parseInt(parts[2]);
    if (!(day >= 0 && day <= 31 && month >=0 && month <=12)){
        return Promise.reject(new Error("تاریخ وارد شده اشتباه هست."));
    }
    return Promise.resolve();
}

export {passAnywayValidator, justStringValidator, registerNationalCodeValidator, nationalCodeValidator, dateValidator, justNumericValidator};