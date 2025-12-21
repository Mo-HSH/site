import {
    Button,
    ConfigProvider,
    Divider,
    Flex,
    Form,
    Input,
    notification,
    Table,
    Tooltip,
    Typography
} from "antd";
import {dateValidator} from "../../utils/Validates.js";
import {useCallback, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";
import {GetDateMinus, GetQueryDate, GetYear} from "../../utils/Calculative.js";
import Sign from "../../components/printElement/Sign.jsx";

function StatsReport() {
    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);
    const [data_1, setData1] = useState([]);
    const [data_2, setData2] = useState([]);
    const [data_3, setData3] = useState([]);
    const [data_4, setData4] = useState([]);
    const [data_5, setData5] = useState([]);
    const [data_6, setData6] = useState([]);
    const [data_7, setData7] = useState([]);
    const [data_8, setData8] = useState([]);
    const [data_9, setData9] = useState([]);
    const [data_10, setData10] = useState([]);
    const [data_11, setData11] = useState([]);
    const [data_12, setData12] = useState([]);
    const [data_13, setData13] = useState([]);
    const [data_14, setData14] = useState([]);
    const [data_15, setData15] = useState([]);
    const [data_16, setData16] = useState([]);
    const [data_17, setData17] = useState([]);
    const [data_19, setData19] = useState([]);
    const [data_20, setData20] = useState([]);

    function onFinish(value) {

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "entry_date": {
                    "$lte": GetQueryDate(value["date"])
                },
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                        "فرماندهی پشتیبانی مرکز نپاجا - مأمورین",
                    ]
                }
            },
            "projection": {
                "education": 1,
                "field_of_study": 1,
                "military_rank": 1,
                "mental_health": 1,
                "extra_info": 1,
                "religion": 1,
                "is_native": 1,
            }
        }, {withCredentials: true}).then((response) => {
            let res = response.data;
            console.log(res.length)
            let temp1 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "other": 0,
                "diploma": 0,
                "associate": 0,
                "bachelor": 0,
                "master": 0,
                "phd": 0,
                "doctor": 0,
                "dentist": 0,
                "medicine": 0,
                "animal_doctor": 0,
                "overall": response.data.length,
            };
            let temp2 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "sotvan_1": 0,
                "sotvan_2": 0,
                "sotvan_3": 0,
                "gorohban_1": 0,
                "gorohban_2": 0,
                "gorohban_3": 0,
                "sarjokhe": 0,
                "sarbaz_1": 0,
                "sarbaz_2": 0,
                "sarbaz": 0,
                "overall": response.data.length,
            };
            let temp3 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "afsar": 0,
                "darajeh_dar": 0,
                "sarbaz": 0,
                "overall": response.data.length,
            };
            let temp4 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "other": 0,
                "diploma": 0,
                "associate": 0,
                "bachelor": 0,
                "master": 0,
                "phd": 0,
                "doctor": 0,
                "dentist": 0,
                "medicine": 0,
                "animal_doctor": 0,
                "overall": response.data.filter(v => v["mental_health"] === "گروه الف" && v["extra_info"].includes("معاف از رزم")).length,
            };
            let temp5 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "shiyee": 0,
                "soni": 0,
                "masihi": 0,
                "zartosht": 0,
                "yahodi": 0,
                "bahaei": 0,
                "kalimi": 0,
                "overall": response.data.length,
            };

            let temp15 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "afsar": 0,
                "afsar_native": 0,
                "afsar_not_native": 0,
                "darajeh_dar": 0,
                "darajeh_dar_native": 0,
                "darajeh_dar_not_native": 0,
                "sarbaz": 0,
                "sarbaz_native": 0,
                "sarbaz_not_native": 0,
                "overall": response.data.length,
            };
            for (const index in res) {
                if (res[index]["education"]) {
                    switch (res[index]["education"][0]) {
                        case "دیپلم":
                            temp1.diploma++;
                            if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                temp4.diploma++;
                            }
                            break;
                        case "کاردانی":
                            temp1.associate++;
                            if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                temp4.associate++;
                            }
                            break;
                        case "کارشناسی":
                            temp1.bachelor++;
                            if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                temp4.bachelor++;
                            }
                            break;
                        case "کارشناسی ارشد":
                            temp1.master++;
                            if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                temp4.master++;
                            }
                            break;
                        case "دکترا":
                            if (!res[index]["field_of_study"]) {
                                temp1.phd++;
                                if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                    temp4.phd++;
                                }
                                break;
                            } else {
                                let field = res[index]["field_of_study"][0];
                                if (field === "دندان پزشک") {
                                    temp1.dentist++;
                                    if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                        temp4.dentist++;
                                    }
                                    break;
                                } else if (field === "دامپزشکی") {
                                    temp1.animal_doctor++;
                                    if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                        temp4.animal_doctor++;
                                    }
                                    break;
                                } else if (field === "داروساز") {
                                    temp1.medicine++;
                                    if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                        temp4.medicine++;
                                    }
                                    break;
                                } else if (field === "پزشکی عمومی") {
                                    temp1.doctor++;
                                    if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                        temp4.doctor++;
                                    }
                                    break;
                                } else {
                                    temp1.phd++;
                                    if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                        temp4.phd++;
                                    }
                                    break;
                                }
                            }
                        default:
                            temp1.other++;
                            if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                                temp4.other++;
                            }
                            break;

                    }
                } else {
                    temp1.other++;
                    if (res[index]["mental_health"] === "گروه الف" && res[index]["extra_info"].includes("معاف از رزم")) {
                        temp4.other++;
                    }
                }

                if (res[index]["military_rank"]) {
                    switch (res[index]["military_rank"]) {
                        case "سرباز":
                            temp2.sarbaz++;
                            temp3.sarbaz++;

                            temp15.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp15.sarbaz_native++;
                            } else {
                                temp15.sarbaz_not_native++;
                            }
                            break;
                        case "سرباز یکم":
                            temp2.sarbaz_1++;
                            temp3.sarbaz++;

                            temp15.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp15.sarbaz_native++;
                            } else {
                                temp15.sarbaz_not_native++;
                            }
                            break;
                        case "سرباز دوم":
                            temp2.sarbaz_2++;
                            temp3.sarbaz++;

                            temp15.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp15.sarbaz_native++;
                            } else {
                                temp15.sarbaz_not_native++;
                            }
                            break;
                        case "سرجوخه":
                            temp2.sarjokhe++;
                            temp3.sarbaz++;

                            temp15.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp15.sarbaz_native++;
                            } else {
                                temp15.sarbaz_not_native++;
                            }
                            break;
                        case "گروهبان سوم":
                            temp2.gorohban_3++;
                            temp3.darajeh_dar++;

                            temp15.darajeh_dar++;
                            if (res[index]["is_native"]) {
                                temp15.darajeh_dar_native++;
                            } else {
                                temp15.darajeh_dar_not_native++;
                            }
                            break;
                        case "گروهبان دوم":
                            temp2.gorohban_2++;
                            temp3.darajeh_dar++;

                            temp15.darajeh_dar++;
                            if (res[index]["is_native"]) {
                                temp15.darajeh_dar_native++;
                            } else {
                                temp15.darajeh_dar_not_native++;
                            }
                            break;
                        case "گروهبان یکم":
                            temp2.gorohban_1++;
                            temp3.darajeh_dar++;

                            temp15.darajeh_dar++;
                            if (res[index]["is_native"]) {
                                temp15.darajeh_dar_native++;
                            } else {
                                temp15.darajeh_dar_not_native++;
                            }
                            break;
                        case "ستوان سوم":
                            temp2.sotvan_3++;
                            temp3.afsar++;

                            temp15.afsar++;
                            if (res[index]["is_native"]) {
                                temp15.afsar_native++;
                            } else {
                                temp15.afsar_not_native++;
                            }
                            break;
                        case "ستوان دوم":
                            temp2.sotvan_2++;
                            temp3.afsar++;

                            temp15.afsar++;
                            if (res[index]["is_native"]) {
                                temp15.afsar_native++;
                            } else {
                                temp15.afsar_not_native++;
                            }
                            break;
                        case "ستوان یکم":
                            temp2.sotvan_1++;
                            temp3.afsar++;

                            temp15.afsar++;
                            if (res[index]["is_native"]) {
                                temp15.afsar_native++;
                            } else {
                                temp15.afsar_not_native++;
                            }
                            break;
                        default:
                            temp2.sarbaz++;
                            temp3.sarbaz++;

                            temp15.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp15.sarbaz_native++;
                            } else {
                                temp15.sarbaz_not_native++;
                            }
                            break;
                    }
                } else {
                    temp2.sarbaz++;
                    temp3.sarbaz++;

                    temp15.sarbaz++;
                    if (res[index]["is_native"]) {
                        temp15.sarbaz_native++;
                    } else {
                        temp15.sarbaz_not_native++;
                    }
                }

                if (res[index]["religion"]) {
                    const religion = res[index]["religion"];
                    if (religion.includes("شیعه")) {
                        temp5.shiyee++;
                    } else if (religion.includes("سنی")) {
                        temp5.soni++;
                    } else if (religion.includes("مسیحی")) {
                        temp5.masihi++;
                    } else if (religion.includes("زرتشت")) {
                        temp5.zartosht++;
                    } else if (religion.includes("یهودی")) {
                        temp5.yahodi++;
                    } else if (religion.includes("بهایی") || religion.includes("بهائی")) {
                        temp5.bahaei++;
                    } else if (religion.includes("کلیمی")) {
                        temp5.kalimi++;
                    } else {
                        temp5.shiyee++;
                    }
                } else {
                    temp5.shiyee++;
                }
                setData1([temp1, {...temp1, rowIndex: "جمع کل"}]);
                setData2([temp2, {...temp2, rowIndex: "جمع کل"}]);
                setData3([temp3, {...temp3, rowIndex: "جمع کل"}]);
                setData4([temp4, {...temp4, rowIndex: "جمع کل"}]);
                setData5([temp5, {...temp5, rowIndex: "جمع کل"}]);
                setData15([temp15, {...temp15, rowIndex: "جمع کل"}]);
            }
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                        "فرماندهی پشتیبانی مرکز نپاجا - مأمورین",
                    ]
                },
                "run": {
                    "$elemMatch": {
                        "run_date": {
                            "$gte": GetDateMinus(value["date"], 6)
                        }
                    }
                }
            },
            "projection": {
                "education": 1,
                "field_of_study": 1,
            }
        }, {withCredentials: true}).then((response) => {
            let res = response.data;

            let temp6 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "other": 0,
                "diploma": 0,
                "associate": 0,
                "bachelor": 0,
                "master": 0,
                "phd": 0,
                "doctor": 0,
                "overall": res.length,
            };
            for (const index in res) {
                if (res[index]["education"]) {
                    switch (res[index]["education"][0]) {
                        case "دیپلم":
                            temp6.diploma++;
                            break;
                        case "کاردانی":
                            temp6.associate++;
                            break;
                        case "کارشناسی":
                            temp6.bachelor++;
                            break;
                        case "کارشناسی ارشد":
                            temp6.master++;
                            break;
                        case "دکترا":
                            if (!res[index]["field_of_study"]) {
                                temp6.phd++;
                                break;
                            } else {
                                temp6.doctor++;
                                break;
                            }
                        default:
                            temp6.other++;
                            break;

                    }
                } else {
                    temp6.other++;
                }
            }
            setData6([temp6, {...temp6, rowIndex: "جمع کل"}]);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                        "فرماندهی پشتیبانی مرکز نپاجا - مأمورین",
                    ]
                },
                "run": {
                    "$elemMatch": {
                        "return_date": {
                            "$gte": GetDateMinus(value["date"], 6)
                        }
                    }
                }
            },
            "projection": {
                "education": 1,
                "field_of_study": 1,
                "status": 1,
            }
        }, {withCredentials: true}).then((response) => {
            let res = response.data;
            let temp7 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "other": 0,
                "diploma": 0,
                "associate": 0,
                "bachelor": 0,
                "master": 0,
                "phd": 0,
                "doctor": 0,
                "overall": res.length,
            };
            for (const index in res) {
                if (res[index]["education"]) {
                    switch (res[index]["education"][0]) {
                        case "دیپلم":
                            temp7.diploma++;
                            break;
                        case "کاردانی":
                            temp7.associate++;
                            break;
                        case "کارشناسی":
                            temp7.bachelor++;
                            break;
                        case "کارشناسی ارشد":
                            temp7.master++;
                            break;
                        case "دکترا":
                            if (!res[index]["field_of_study"]) {
                                temp7.phd++;
                                break;
                            } else {
                                temp7.doctor++;
                                break;
                            }
                        default:
                            temp7.other++;
                            break;
                    }
                } else {
                    temp7.other++;
                }
            }
            setData7([temp7, {...temp7, rowIndex: "جمع کل"}]);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        let result = [];
        let temp8_last_row = {
            "rowIndex": "جمع کل",
            "other": 0,
            "diploma": 0,
            "associate": 0,
            "bachelor": 0,
            "master": 0,
            "phd": 0,
            "doctor": 0,
            "overall": 0,
        }

        for (let i = 0; i < 19; i++) {
            axios.post(getApiUrl("soldier/list"), {
                "filter": {
                    "status": {
                        "$in": [
                            "حاضر",
                            "فرار"
                        ]
                    },
                    "unit": {
                        "$in": [
                            "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
                            "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                            "فرماندهی پشتیبانی مرکز نپاجا - مأمورین",
                        ]
                    },
                    "run": {
                        "$elemMatch": {
                            "absence_date": {
                                "$gte": GetQueryDate(`${GetYear(value["date"]) - i}/1/1`),
                                "$lt": GetQueryDate(`${GetYear(value["date"]) - i + 1}/1/1`),
                            }
                        }
                    }
                },
                "projection": {
                    "education": 1,
                    "field_of_study": 1
                }
            }, {withCredentials: true}).then((response) => {
                let res = response.data;
                let temp8 = {
                    "rowIndex": i + 1,
                    "unit": "پشتیبانی مرکز",
                    "year": GetYear(value["date"]) - i,
                    "other": 0,
                    "diploma": 0,
                    "associate": 0,
                    "bachelor": 0,
                    "master": 0,
                    "phd": 0,
                    "doctor": 0,
                    "overall": res.length,
                };
                temp8_last_row["overall"] += res.length
                for (const index in res) {
                    if (res[index]["education"]) {
                        switch (res[index]["education"][0]) {
                            case "دیپلم":
                                temp8.diploma++;
                                temp8_last_row.diploma++;
                                break;
                            case "کاردانی":
                                temp8.associate++;
                                temp8_last_row.associate++;
                                break;
                            case "کارشناسی":
                                temp8.bachelor++;
                                temp8_last_row.bachelor++;
                                break;
                            case "کارشناسی ارشد":
                                temp8.master++;
                                temp8_last_row.master++;
                                break;
                            case "دکترا":
                                if (!res[index]["field_of_study"]) {
                                    temp8.phd++;
                                    temp8_last_row.phd++;
                                    break;
                                } else {
                                    temp8.doctor++;
                                    temp8_last_row.doctor++;
                                    break;
                                }
                            default:
                                temp8.other++;
                                temp8_last_row.other++;
                                break;
                        }
                    } else {
                        temp8.other++;
                        temp8_last_row.other++;
                    }
                }
                result[i] = temp8;
                result[19] = temp8_last_row;
            }).catch((err) => {
                api["error"]({
                    message: "خطا", description: err
                });
            })

            setData8(result);
        }

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                        "فرماندهی پشتیبانی مرکز نپاجا - مأمورین",
                    ]
                },
                "extra_info": {
                    "$in": [
                        "معاف از رزم"
                    ]
                }
            },
            "projection": {
                "education": 1,
                "field_of_study": 1,
                "military_rank": 1,
            }
        }, {withCredentials: true}).then((response) => {

            let temp9 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "other": 0,
                "diploma": 0,
                "associate": 0,
                "bachelor": 0,
                "master": 0,
                "phd": 0,
                "doctor": 0,
                "dentist": 0,
                "medicine": 0,
                "animal_doctor": 0,
                "overall": response.data.length,
            };
            let temp10 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "afsar": 0,
                "darajeh_dar": 0,
                "sarbaz": 0,
                "overall": response.data.length,
            };

            let res = response.data;

            for (const index in res) {
                if (res[index]["education"]) {
                    switch (res[index]["education"][0]) {
                        case "دیپلم":
                            temp9.diploma++;
                            break;
                        case "کاردانی":
                            temp9.associate++;
                            break;
                        case "کارشناسی":
                            temp9.bachelor++;
                            break;
                        case "کارشناسی ارشد":
                            temp9.master++;
                            break;
                        case "دکترا":
                            if (!res[index]["field_of_study"]) {
                                temp9.phd++;
                                break;
                            } else {
                                let field = res[index]["field_of_study"][0];
                                if (field === "دندان پزشک") {
                                    temp9.dentist++;
                                    break;
                                } else if (field === "دامپزشکی") {
                                    temp9.animal_doctor++;
                                    break;
                                } else if (field === "داروساز") {
                                    temp9.medicine++;
                                    break;
                                } else if (field === "پزشکی عمومی") {
                                    temp9.doctor++;
                                    break;
                                } else {
                                    temp9.phd++;
                                    break;
                                }
                            }
                        default:
                            temp9.other++;
                            break;

                    }
                } else {
                    temp9.other++;
                }

                if (res[index]["military_rank"]) {
                    switch (res[index]["military_rank"]) {
                        case "سرباز":
                            temp10.sarbaz++;
                            break;
                        case "سرباز یکم":
                            temp10.sarbaz++;
                            break;
                        case "سرباز دوم":
                            temp10.sarbaz++;
                            break;
                        case "سرجوخه":
                            temp10.sarbaz++;
                            break;
                        case "گروهبان سوم":
                            temp10.darajeh_dar++;
                            break;
                        case "گروهبان دوم":
                            temp10.darajeh_dar++;
                            break;
                        case "گروهبان یکم":
                            temp10.darajeh_dar++;
                            break;
                        case "ستوان سوم":
                            temp10.afsar++;
                            break;
                        case "ستوان دوم":
                            temp10.afsar++;
                            break;
                        case "ستوان یکم":
                            temp10.afsar++;
                            break;
                        default:
                            temp10.sarbaz++;
                            break;
                    }
                } else {
                    temp10.sarbaz++;
                }
            }

            setData9([temp9, {...temp9, rowIndex: "جمع کل"}]);
            setData10([temp10, {...temp10, rowIndex: "جمع کل"}]);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                        "فرماندهی پشتیبانی مرکز نپاجا - مأمورین",
                    ]
                },
                "family": {
                    "$elemMatch": {
                        "relative": "همسر"
                    }
                }
            },
            "projection": {
                "is_native": 1,
                "military_rank": 1,
                "education": 1,
                "field_of_study": 1
            }
        }, {withCredentials: true}).then((response) => {
            let res = response.data;

            let temp11 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "afsar": 0,
                "afsar_native": 0,
                "afsar_not_native": 0,
                "darajeh_dar": 0,
                "darajeh_dar_native": 0,
                "darajeh_dar_not_native": 0,
                "sarbaz": 0,
                "sarbaz_native": 0,
                "sarbaz_not_native": 0,
                "overall": response.data.length,
            };

            for (const index in res) {
                if (res[index]["military_rank"]) {
                    switch (res[index]["military_rank"]) {
                        case "سرباز":
                            temp11.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp11.sarbaz_native++;
                            } else {
                                temp11.sarbaz_not_native++;
                            }
                            break;
                        case "سرباز یکم":
                            temp11.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp11.sarbaz_native++;
                            } else {
                                temp11.sarbaz_not_native++;
                            }
                            break;
                        case "سرباز دوم":
                            temp11.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp11.sarbaz_native++;
                            } else {
                                temp11.sarbaz_not_native++;
                            }
                            break;
                        case "سرجوخه":
                            temp11.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp11.sarbaz_native++;
                            } else {
                                temp11.sarbaz_not_native++;
                            }
                            break;
                        case "گروهبان سوم":
                            temp11.darajeh_dar++;
                            if (res[index]["is_native"]) {
                                temp11.darajeh_dar_native++;
                            } else {
                                temp11.darajeh_dar_not_native++;
                            }
                            break;
                        case "گروهبان دوم":
                            temp11.darajeh_dar++;
                            if (res[index]["is_native"]) {
                                temp11.darajeh_dar_native++;
                            } else {
                                temp11.darajeh_dar_not_native++;
                            }
                            break;
                        case "گروهبان یکم":
                            temp11.darajeh_dar++;
                            if (res[index]["is_native"]) {
                                temp11.darajeh_dar_native++;
                            } else {
                                temp11.darajeh_dar_not_native++;
                            }
                            break;
                        case "ستوان سوم":
                            temp11.afsar++;
                            if (res[index]["is_native"]) {
                                temp11.afsar_native++;
                            } else {
                                temp11.afsar_not_native++;
                            }
                            break;
                        case "ستوان دوم":
                            temp11.afsar++;
                            if (res[index]["is_native"]) {
                                temp11.afsar_native++;
                            } else {
                                temp11.afsar_not_native++;
                            }
                            break;
                        case "ستوان یکم":
                            temp11.afsar++;
                            if (res[index]["is_native"]) {
                                temp11.afsar_native++;
                            } else {
                                temp11.afsar_not_native++;
                            }
                            break;
                        default:
                            temp11.sarbaz++;
                            if (res[index]["is_native"]) {
                                temp11.sarbaz_native++;
                            } else {
                                temp11.sarbaz_not_native++;
                            }
                            break;
                    }
                } else {
                    temp11.sarbaz++;
                    if (res[index]["is_native"]) {
                        temp11.sarbaz_native++;
                    } else {
                        temp11.sarbaz_not_native++;
                    }
                }
            }
            setData11([temp11, {...temp11, rowIndex: "جمع کل"}]);

            let temp12 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "other": 0,
                "diploma": 0,
                "associate": 0,
                "bachelor": 0,
                "master": 0,
                "phd": 0,
                "doctor": 0,
                "dentist": 0,
                "medicine": 0,
                "animal_doctor": 0,
                "overall": response.data.filter(v => v.is_native).length,
            };

            for (const index in res.filter(v => v.is_native)) {
                if (res[index]["education"]) {
                    switch (res[index]["education"][0]) {
                        case "دیپلم":
                            temp12.diploma++;
                            break;
                        case "کاردانی":
                            temp12.associate++;
                            break;
                        case "کارشناسی":
                            temp12.bachelor++;
                            break;
                        case "کارشناسی ارشد":
                            temp12.master++;
                            break;
                        case "دکترا":
                            if (!res[index]["field_of_study"]) {
                                temp12.phd++;
                                break;
                            } else {
                                let field = res[index]["field_of_study"][0];
                                if (field === "دندان پزشک") {
                                    temp12.dentist++;
                                    break;
                                } else if (field === "دامپزشکی") {
                                    temp12.animal_doctor++;
                                    break;
                                } else if (field === "داروساز") {
                                    temp12.medicine++;
                                    break;
                                } else if (field === "پزشکی عمومی") {
                                    temp12.doctor++;
                                    break;
                                } else {
                                    temp12.phd++;
                                    break;
                                }
                            }
                        default:
                            temp12.other++;
                            break;

                    }
                } else {
                    temp12.other++;
                }
            }

            setData12([temp12, {...temp12, rowIndex: "جمع کل"}]);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "entry_date": {
                    "$lte": GetQueryDate(value["date"])
                },
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                        "فرماندهی پشتیبانی مرکز نپاجا - مأمورین",
                    ]
                },
            },
            "projection": {
                "education": 1,
                "extra_info": 1,
                "mental_health": 1,
                "field_of_study": 1,
                "military_rank": 1,
            }
        }, {withCredentials: true}).then((response) => {
            let res = response.data

            let result = [];
            let result2 = [];
            let temp13 = {
                "rowIndex": 1,
                "education": "",
                "razmi": 0,
                "posh_razmi": 0,
                "khadamat_razmi": 0,
                "overall": 0
            };
            let temp14 = {
                "rowIndex": 1,
                "rank": "",
                "razmi": 0,
                "posh_razmi": 0,
                "khadamat_razmi": 0,
                "overall": 0
            };
            [
                "زیر دیپلم",
                "دیپلم",
                "فوق دیپلم",
                "لیسانس",
                "فوق لیسانس",
                "دکتری غیرپزشکی",
                "دکتری پزشکی",
                "دندان پزشک",
                "داروساز",
                "دامپزشک",
            ].forEach((v, i) => {
                result.push({...temp13, "education": v, "rowIndex": i + 1})
            });
            [
                "افسر",
                "درجه دار",
                "سرباز",
            ].forEach((v, i) => {
                result2.push({...temp14, "rank": v, "rowIndex": i + 1})
            });

            for (const index in res) {
                if (res[index]["education"]) {
                    switch (res[index]["education"][0]) {
                        case "دیپلم":
                            result[1].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result[1].razmi++;
                            }
                            break;
                        case "کاردانی":
                            result[2].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result[2].razmi++;
                            }
                            break;
                        case "کارشناسی":
                            result[3].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result[3].razmi++;
                            }
                            break;
                        case "کارشناسی ارشد":
                            result[4].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result[4].razmi++;
                            }
                            break;
                        case "دکترا":
                            if (!res[index]["field_of_study"]) {
                                result[5].overall++;
                                if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                    result[5].razmi++;
                                }
                                break;
                            } else {
                                let field = res[index]["field_of_study"][0];
                                if (field === "دندان پزشک") {
                                    result[7].overall++;
                                    if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                        result[7].razmi++;
                                    }
                                    break;
                                } else if (field === "دامپزشکی") {
                                    result[9].overall++;
                                    if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                        result[9].razmi++;
                                    }
                                    break;
                                } else if (field === "داروساز") {
                                    result[8].overall++;
                                    if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                        result[8].razmi++;
                                    }
                                    break;
                                } else if (field === "پزشکی عمومی") {
                                    result[7].overall++;
                                    if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                        result[7].razmi++;
                                    }
                                    break;
                                } else {
                                    result[5].overall++;
                                    if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                        result[5].razmi++;
                                    }
                                    break;
                                }
                            }
                        default:
                            result[0].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result[0].razmi++;
                            }
                            break;

                    }
                } else {
                    result[0].overall++;
                    if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                        result[0].razmi++;
                    }
                }

                if (res[index]["military_rank"]) {
                    switch (res[index]["military_rank"]) {
                        case "سرباز":
                            result2[2].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[2].razmi++;
                            }
                            break;
                        case "سرباز یکم":
                            result2[2].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[2].razmi++;
                            }
                            break;
                        case "سرباز دوم":
                            result2[2].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[2].razmi++;
                            }
                            break;
                        case "سرجوخه":
                            result2[2].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[2].razmi++;
                            }
                            break;
                        case "گروهبان سوم":
                            result2[1].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[1].razmi++;
                            }
                            break;
                        case "گروهبان دوم":
                            result2[1].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[1].razmi++;
                            }
                            break;
                        case "گروهبان یکم":
                            result2[1].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[1].razmi++;
                            }
                            break;
                        case "ستوان سوم":
                            result2[0].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[0].razmi++;
                            }
                            break;
                        case "ستوان دوم":
                            result2[0].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[0].razmi++;
                            }
                            break;
                        case "ستوان یکم":
                            result2[0].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[0].razmi++;
                            }
                            break;
                        default:
                            result2[2].overall++;
                            if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                                result2[2].razmi++;
                            }
                            break;
                    }
                } else {
                    result2[2].overall++;
                    if (res[index]["mental_health"] === "گروه الف" && !res[index]["extra_info"].includes("معاف از رزم")) {
                        result2[2].razmi++;
                    }
                }

                let overall_razmi = 0;
                let overall_posh_razmi = 0;
                let overall_posh_khadamat_razmi = 0;
                let overall_overall = 0;

                for (const resultKey in result) {
                    const posh_razmi = parseInt((result[resultKey].overall - result[resultKey].razmi) * 7 / 10);
                    const posh_khadamat_razmi = parseInt(result[resultKey].overall - result[resultKey].razmi - posh_razmi);

                    overall_razmi += result[resultKey].razmi;
                    overall_posh_razmi += posh_razmi;
                    overall_posh_khadamat_razmi += posh_khadamat_razmi;
                    overall_overall += result[resultKey].overall;

                    result[resultKey].posh_razmi = posh_razmi;
                    result[resultKey].khadamat_razmi = posh_khadamat_razmi;
                }

                setData13([...result, {
                    "rowIndex": "جمع کل",
                    "razmi": overall_razmi,
                    "posh_razmi": overall_posh_razmi,
                    "khadamat_razmi": overall_posh_khadamat_razmi,
                    "overall": overall_overall
                }]);

                overall_razmi = 0;
                overall_posh_razmi = 0;
                overall_posh_khadamat_razmi = 0;
                overall_overall = 0;

                for (const resultKey in result2) {
                    const posh_razmi = parseInt((result2[resultKey].overall - result2[resultKey].razmi) * 7 / 10);
                    const posh_khadamat_razmi = parseInt(result2[resultKey].overall - result2[resultKey].razmi - posh_razmi);

                    overall_razmi += result2[resultKey].razmi;
                    overall_posh_razmi += posh_razmi;
                    overall_posh_khadamat_razmi += posh_khadamat_razmi;
                    overall_overall += result2[resultKey].overall;

                    result2[resultKey].posh_razmi = posh_razmi;
                    result2[resultKey].khadamat_razmi = posh_khadamat_razmi;
                }

                setData14([...result2, {
                    "rowIndex": "جمع کل",
                    "razmi": overall_razmi,
                    "posh_razmi": overall_posh_razmi,
                    "khadamat_razmi": overall_posh_khadamat_razmi,
                    "overall": overall_overall
                }]);
            }
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "release.release_date": {
                    "$lte": GetQueryDate(value["date"]),
                    "$gte": GetDateMinus(value["date"], 1)
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                        "فرماندهی پشتیبانی مرکز نپاجا - مأمورین",
                    ]
                }
            },
            "projection": {
                "military_rank": 1,
                "education": 1,
                "field_of_study": 1,
            }
        }, {withCredentials: true}).then((response) => {
            let res = response.data;
            console.log(res);
            let temp16 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "other": 0,
                "diploma": 0,
                "associate": 0,
                "bachelor": 0,
                "master": 0,
                "phd": 0,
                "doctor": 0,
                "dentist": 0,
                "medicine": 0,
                "animal_doctor": 0,
                "overall": response.data.length,
            };
            let temp17 = {
                "rowIndex": 1,
                "unit": "پشتیبانی مرکز",
                "sotvan_1": 0,
                "sotvan_2": 0,
                "sotvan_3": 0,
                "gorohban_1": 0,
                "gorohban_2": 0,
                "gorohban_3": 0,
                "sarjokhe": 0,
                "sarbaz_1": 0,
                "sarbaz_2": 0,
                "sarbaz": 0,
                "overall": response.data.length,
            };

            for (const index in res) {
                if (res[index]["education"]) {
                    switch (res[index]["education"][0]) {
                        case "دیپلم":
                            temp16.diploma++;
                            break;
                        case "کاردانی":
                            temp16.associate++;
                            break;
                        case "کارشناسی":
                            temp16.bachelor++;
                            break;
                        case "کارشناسی ارشد":
                            temp16.master++;
                            break;
                        case "دکترا":
                            if (!res[index]["field_of_study"]) {
                                temp16.phd++;
                                break;
                            } else {
                                let field = res[index]["field_of_study"][0];
                                if (field === "دندان پزشک") {
                                    temp16.dentist++;
                                    break;
                                } else if (field === "دامپزشکی") {
                                    temp16.animal_doctor++;
                                    break;
                                } else if (field === "داروساز") {
                                    temp16.medicine++;
                                    break;
                                } else if (field === "پزشکی عمومی") {
                                    temp16.doctor++;
                                    break;
                                } else {
                                    temp16.phd++;
                                    break;
                                }
                            }
                        default:
                            temp16.other++;
                            break;

                    }
                } else {
                    temp16.other++;
                }

                if (res[index]["military_rank"]) {
                    switch (res[index]["military_rank"]) {
                        case "سرباز":
                            temp17.sarbaz++;
                            break;
                        case "سرباز یکم":
                            temp17.sarbaz_1++;
                            break;
                        case "سرباز دوم":
                            temp17.sarbaz_2++;
                            break;
                        case "سرجوخه":
                            temp17.sarjokhe++;
                            break;
                        case "گروهبان سوم":
                            temp17.gorohban_3++;
                            break;
                        case "گروهبان دوم":
                            temp17.gorohban_2++;
                            break;
                        case "گروهبان یکم":
                            temp17.gorohban_1++;
                            break;
                        case "ستوان سوم":
                            temp17.sotvan_3++;
                            break;
                        case "ستوان دوم":
                            temp17.sotvan_2++;
                            break;
                        case "ستوان یکم":
                            temp17.sotvan_1++;
                            break;
                        default:
                            temp17.sarbaz++;
                            break;
                    }
                } else {
                    temp17.sarbaz++;
                }
            }

            setData16([temp16, {...temp16, rowIndex: "جمع کل"}]);
            setData17([temp17, {...temp17, rowIndex: "جمع کل"}]);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": "امریه"
            },
            "projection": {
                "section": 1,
                "education": 1,
                "military_rank": 1
            }
        }, {withCredentials: true}).then((response) => {
            let res = response.data;
            let result = [];
            let result2 = [];
            let temp19 = {
                "rowIndex": 1,
                "section": "",
                "other": 0,
                "diploma": 0,
                "associate": 0,
                "bachelor": 0,
                "master": 0,
                "phd": 0,
                "doctor": 0,
                "overall": 1,
            }
            let temp20 = {
                "rowIndex": 1,
                "section": "",
                "afsar": 0,
                "darajeh_dar": 0,
                "sarbaz": 0,
                "overall": 1,
            };

            function add_1(soldier, education) {
                let index = result.findIndex((value) => value.section === soldier.section);
                if (index >= 0) {
                    result[index][education]++;
                    result[index]["overall"]++;
                } else {
                    let t = {...temp19, section: soldier.section, rowIndex: result.length + 1};
                    t[education]++;
                    result.push(t);
                }
            }

            function add_2(soldier, rank) {
                let index = result2.findIndex((value) => value.section === soldier.section);
                if (index >= 0) {
                    result2[index][rank]++;
                    result2[index]["overall"]++;
                } else {
                    let t = {...temp20, section: soldier.section, rowIndex: result2.length + 1};
                    t[rank]++;
                    result2.push(t);
                }
            }

            for (const index in res) {
                if (res[index]["education"]) {
                    switch (res[index]["education"][0]) {
                        case "دیپلم":
                            add_1(res[index], "diploma");
                            break;
                        case "کاردانی":
                            add_1(res[index], "associate");
                            break;
                        case "کارشناسی":
                            add_1(res[index], "bachelor");
                            break;
                        case "کارشناسی ارشد":
                            add_1(res[index], "master");
                            break;
                        case "دکترا":
                            add_1(res[index], "phd");
                            break;
                        default:
                            add_1(res[index], "other");
                            break;

                    }
                } else {
                    add_1(res[index], "other");
                }

                if (res[index]["military_rank"]) {
                    switch (res[index]["military_rank"]) {
                        case "سرباز":
                            add_2(res[index], "sarbaz");
                            break;
                        case "سرباز یکم":
                            add_2(res[index], "sarbaz");
                            break;
                        case "سرباز دوم":
                            add_2(res[index], "sarbaz");
                            break;
                        case "سرجوخه":
                            add_2(res[index], "sarbaz");
                            break;
                        case "گروهبان سوم":
                            add_2(res[index], "darajeh_dar");
                            break;
                        case "گروهبان دوم":
                            add_2(res[index], "darajeh_dar");
                            break;
                        case "گروهبان یکم":
                            add_2(res[index], "darajeh_dar");
                            break;
                        case "ستوان سوم":
                            add_2(res[index], "afsar");
                            break;
                        case "ستوان دوم":
                            add_2(res[index], "afsar");
                            break;
                        case "ستوان یکم":
                            add_2(res[index], "afsar");
                            break;
                        default:
                            add_2(res[index], "sarbaz");
                            break;
                    }
                } else {
                    add_2(res[index], "sarbaz");
                }
            }

            setData19([...result,
                {
                    "rowIndex": "جمع کل",
                    "other": result.reduce(
                        (prev, current) => {
                            return (prev + current["other"])
                        }, 0
                    ),
                    "diploma": result.reduce(
                        (prev, current) => {
                            return (prev + current["diploma"])
                        }, 0
                    ),
                    "associate": result.reduce(
                        (prev, current) => {
                            return (prev + current["associate"])
                        }, 0
                    ),
                    "bachelor": result.reduce(
                        (prev, current) => {
                            return (prev + current["bachelor"])
                        }, 0
                    ),
                    "master": result.reduce(
                        (prev, current) => {
                            return (prev + current["master"])
                        }, 0
                    ),
                    "phd": result.reduce(
                        (prev, current) => {
                            return (prev + current["phd"])
                        }, 0
                    ),
                    "doctor": result.reduce(
                        (prev, current) => {
                            return (prev + current["doctor"])
                        }, 0
                    ),
                    "overall": result.reduce(
                        (prev, current) => {
                            return (prev + current["overall"])
                        }, 0
                    ),
                }
            ]);
            setData20([...result2,
                {
                    "rowIndex": "جمع کل",
                    "afsar": result2.reduce(
                        (prev, current) => {
                            return (prev + current["afsar"])
                        }, 0
                    ),
                    "darajeh_dar": result2.reduce(
                        (prev, current) => {
                            return (prev + current["darajeh_dar"])
                        }, 0
                    ),
                    "sarbaz": result2.reduce(
                        (prev, current) => {
                            return (prev + current["sarbaz"])
                        }, 0
                    ),
                    "overall": result2.reduce(
                        (prev, current) => {
                            return (prev + current["overall"])
                        }, 0
                    ),
                }
            ]);

        })
    }

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    const column_1 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "زیر دیپلم",
            dataIndex: "other",
        },
        {
            title: "دیپلم",
            dataIndex: "diploma",
        },
        {
            title: "فوق دیپلم",
            dataIndex: "associate",
        },
        {
            title: "لیسانس",
            dataIndex: "bachelor",
        },
        {
            title: "فوق لیسانس",
            dataIndex: "master",
        },
        {
            title: "دکتری غیر پزشکی",
            dataIndex: "phd",
        },
        {
            title: "پزشک عمومی",
            dataIndex: "doctor",
        },
        {
            title: "دندانپزشک",
            dataIndex: "dentist",
        },
        {
            title: "داروساز",
            dataIndex: "medicine",
        },
        {
            title: "دامپزشک",
            dataIndex: "animal_doctor",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_2 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "ستوان 1",
            dataIndex: "sotvan_1",
        },
        {
            title: "ستوان 2",
            dataIndex: "sotvan_2",
        },
        {
            title: "ستوان 3",
            dataIndex: "sotvan_3",
        },
        {
            title: "گروهبان 1",
            dataIndex: "gorohban_1",
        },
        {
            title: "گروهبان 2",
            dataIndex: "gorohban_2",
        },
        {
            title: "گروهبان 3",
            dataIndex: "gorohban_3",
        },
        {
            title: "سرجوخه",
            dataIndex: "sarjokhe",
        },
        {
            title: "سرباز 1",
            dataIndex: "sarbaz_1",
        },
        {
            title: "سرباز 2",
            dataIndex: "sarbaz_2",
        },
        {
            title: "سرباز",
            dataIndex: "sarbaz",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_3 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "افسر",
            dataIndex: "afsar",
        },
        {
            title: "درجه دار",
            dataIndex: "darajeh_dar",
        },
        {
            title: "سرباز",
            dataIndex: "sarbaz",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_4 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "زیر دیپلم",
            dataIndex: "other",
        },
        {
            title: "دیپلم",
            dataIndex: "diploma",
        },
        {
            title: "فوق دیپلم",
            dataIndex: "associate",
        },
        {
            title: "لیسانس",
            dataIndex: "bachelor",
        },
        {
            title: "فوق لیسانس",
            dataIndex: "master",
        },
        {
            title: "دکتری غیر پزشکی",
            dataIndex: "phd",
        },
        {
            title: "پزشک عمومی",
            dataIndex: "doctor",
        },
        {
            title: "دندانپزشک",
            dataIndex: "dentist",
        },
        {
            title: "داروساز",
            dataIndex: "medicine",
        },
        {
            title: "دامپزشک",
            dataIndex: "animal_doctor",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_5 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "شیعه",
            dataIndex: "shiyee",
        },
        {
            title: "سنی",
            dataIndex: "soni",
        },
        {
            title: "مسیحی",
            dataIndex: "masihi",
        },
        {
            title: "زرتشت",
            dataIndex: "zartosht",
        },
        {
            title: "یهودی",
            dataIndex: "yahodi",
        },
        {
            title: "بهایی",
            dataIndex: "bahaei",
        },
        {
            title: "کلیمی",
            dataIndex: "kalimi",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_6 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "زیر دیپلم",
            dataIndex: "other",
        },
        {
            title: "دیپلم",
            dataIndex: "diploma",
        },
        {
            title: "فوق دیپلم",
            dataIndex: "associate",
        },
        {
            title: "لیسانس",
            dataIndex: "bachelor",
        },
        {
            title: "فوق لیسانس",
            dataIndex: "master",
        },
        {
            title: "دکتری غیر پزشکی",
            dataIndex: "phd",
        },
        {
            title: "دکتری پزشکی",
            dataIndex: "doctor",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_8 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 3 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "سال",
            dataIndex: "year",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "زیر دیپلم",
            dataIndex: "other",
        },
        {
            title: "دیپلم",
            dataIndex: "diploma",
        },
        {
            title: "فوق دیپلم",
            dataIndex: "associate",
        },
        {
            title: "لیسانس",
            dataIndex: "bachelor",
        },
        {
            title: "فوق لیسانس",
            dataIndex: "master",
        },
        {
            title: "دکتری غیر پزشکی",
            dataIndex: "phd",
        },
        {
            title: "دکتری پزشکی",
            dataIndex: "doctor",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_9 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "زیر دیپلم",
            dataIndex: "other",
        },
        {
            title: "دیپلم",
            dataIndex: "diploma",
        },
        {
            title: "فوق دیپلم",
            dataIndex: "associate",
        },
        {
            title: "لیسانس",
            dataIndex: "bachelor",
        },
        {
            title: "فوق لیسانس",
            dataIndex: "master",
        },
        {
            title: "دکتری غیر پزشکی",
            dataIndex: "phd",
        },
        {
            title: "پزشک عمومی",
            dataIndex: "doctor",
        },
        {
            title: "دندانپزشک",
            dataIndex: "dentist",
        },
        {
            title: "داروساز",
            dataIndex: "medicine",
        },
        {
            title: "دامپزشک",
            dataIndex: "animal_doctor",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_10 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "افسر",
            dataIndex: "afsar",
        },
        {
            title: "درجه دار",
            dataIndex: "darajeh_dar",
        },
        {
            title: "سرباز",
            dataIndex: "sarbaz",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_11 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "افسر",
            dataIndex: "afsar",
        },
        {
            title: "بومی",
            dataIndex: "afsar_native",
        },
        {
            title: "غیربومی",
            dataIndex: "afsar_not_native",
        },
        {
            title: "درجه دار",
            dataIndex: "darajeh_dar",
        },
        {
            title: "بومی",
            dataIndex: "darajeh_dar_native",
        },
        {
            title: "غیربومی",
            dataIndex: "darajeh_dar_not_native",
        },
        {
            title: "سرباز",
            dataIndex: "sarbaz",
        },
        {
            title: "بومی",
            dataIndex: "sarbaz_native",
        },
        {
            title: "غیربومی",
            dataIndex: "sarbaz_not_native",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_12 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 3 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "سال",
            dataIndex: "year",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "زیر دیپلم",
            dataIndex: "other",
        },
        {
            title: "دیپلم",
            dataIndex: "diploma",
        },
        {
            title: "فوق دیپلم",
            dataIndex: "associate",
        },
        {
            title: "لیسانس",
            dataIndex: "bachelor",
        },
        {
            title: "فوق لیسانس",
            dataIndex: "master",
        },
        {
            title: "دکتری غیر پزشکی",
            dataIndex: "phd",
        },
        {
            title: "دکتری پزشکی",
            dataIndex: "doctor",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_13 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "مقطع تحصیلی",
            dataIndex: "education",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "رزمی",
            dataIndex: "razmi",
        },
        {
            title: "پش رزمی",
            dataIndex: "posh_razmi",
        },
        {
            title: "پش خدمات رزمی",
            dataIndex: "khadamat_razmi",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        },
    ];

    const column_14 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "درجات",
            dataIndex: "rank",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "رزمی",
            dataIndex: "razmi",
        },
        {
            title: "پش رزمی",
            dataIndex: "posh_razmi",
        },
        {
            title: "پش خدمات رزمی",
            dataIndex: "khadamat_razmi",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        },
    ];

    const column_15 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "افسر",
            dataIndex: "afsar",
        },
        {
            title: "بومی",
            dataIndex: "afsar_native",
        },
        {
            title: "غیربومی",
            dataIndex: "afsar_not_native",
        },
        {
            title: "درجه دار",
            dataIndex: "darajeh_dar",
        },
        {
            title: "بومی",
            dataIndex: "darajeh_dar_native",
        },
        {
            title: "غیربومی",
            dataIndex: "darajeh_dar_not_native",
        },
        {
            title: "سرباز",
            dataIndex: "sarbaz",
        },
        {
            title: "بومی",
            dataIndex: "sarbaz_native",
        },
        {
            title: "غیربومی",
            dataIndex: "sarbaz_not_native",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        },
    ];

    const column_16 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "زیر دیپلم",
            dataIndex: "other",
        },
        {
            title: "دیپلم",
            dataIndex: "diploma",
        },
        {
            title: "فوق دیپلم",
            dataIndex: "associate",
        },
        {
            title: "لیسانس",
            dataIndex: "bachelor",
        },
        {
            title: "فوق لیسانس",
            dataIndex: "master",
        },
        {
            title: "دکتری غیر پزشکی",
            dataIndex: "phd",
        },
        {
            title: "پزشک عمومی",
            dataIndex: "doctor",
        },
        {
            title: "دندانپزشک",
            dataIndex: "dentist",
        },
        {
            title: "داروساز",
            dataIndex: "medicine",
        },
        {
            title: "دامپزشک",
            dataIndex: "animal_doctor",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_17 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "یگان",
            dataIndex: "unit",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "ستوان 1",
            dataIndex: "sotvan_1",
        },
        {
            title: "ستوان 2",
            dataIndex: "sotvan_2",
        },
        {
            title: "ستوان 3",
            dataIndex: "sotvan_3",
        },
        {
            title: "گروهبان 1",
            dataIndex: "gorohban_1",
        },
        {
            title: "گروهبان 2",
            dataIndex: "gorohban_2",
        },
        {
            title: "گروهبان 3",
            dataIndex: "gorohban_3",
        },
        {
            title: "سرجوخه",
            dataIndex: "sarjokhe",
        },
        {
            title: "سرباز 1",
            dataIndex: "sarbaz_1",
        },
        {
            title: "سرباز 2",
            dataIndex: "sarbaz_2",
        },
        {
            title: "سرباز",
            dataIndex: "sarbaz",
        },
        {
            title: "جمع کل موجودی",
            dataIndex: "overall",
        }
    ];

    const column_19 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "قسمت",
            dataIndex: "section",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "زیر دیپلم",
            dataIndex: "other",
        },
        {
            title: "دیپلم",
            dataIndex: "diploma",
        },
        {
            title: "فوق دیپلم",
            dataIndex: "associate",
        },
        {
            title: "لیسانس",
            dataIndex: "bachelor",
        },
        {
            title: "فوق لیسانس",
            dataIndex: "master",
        },
        {
            title: "دکتری و بالاتر",
            dataIndex: "phd",
        },
        {
            title: "جمع کل",
            dataIndex: "overall",
        }
    ];

    const column_20 = [
        {
            title: "ردیف",
            dataIndex: "rowIndex",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 2 : 1,
            }),
        },
        {
            title: "قسمت",
            dataIndex: "section",
            onCell: (record) => ({
                colSpan: record["rowIndex"] === "جمع کل" ? 0 : 1,
            }),
        },
        {
            title: "افسر",
            dataIndex: "afsar",
        },
        {
            title: "درجه دار",
            dataIndex: "darajeh_dar",
        },
        {
            title: "سرباز",
            dataIndex: "sarbaz",
        },
        {
            title: "جمع کل",
            dataIndex: "overall",
        }
    ];

    return (
        <Flex vertical={true} style={{width: "100%"}}>
            {contextHolder}
            <Flex justify={"center"}>
                <Typography.Title level={3}>
                    آمار پایه خدمتی
                </Typography.Title>
            </Flex>
            <Divider/>
            <Flex style={{marginBottom: "20px"}}>
                <Form
                    layout={"inline"}
                    onFinish={onFinish}
                >
                    <Tooltip title={"تاریخ مرجع"}>
                        <Form.Item
                            label={"تاریخ مرجع"}
                            name={"date"}
                            rules={[{
                                validator: dateValidator, required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Tooltip>

                    <Form.Item>
                        <Button block={true} type={"primary"} htmlType="submit">جستجو</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button block={true} type={"primary"} onClick={handlePrint}>پرینت</Button>
                    </Form.Item>
                </Form>
            </Flex>

            <Flex
                ref={printComponent}
                style={{width: "100%"}} justify={"center"} align={"center"} vertical={true}
            >
                <style>
                    {`
                            @media print {
                              @page {
                                size: landscape;
                              }
                            }
                        `}
                </style>
                {
                    [
                        <>
                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    جدول موجودی کارکنان وظیفه بر اساس مدرک تحصیلی
                                </Typography.Title>}
                                dataSource={data_1}
                                columns={column_1}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    جدول موجودی کارکنان وظیفه بر اساس درجه
                                </Typography.Title>}
                                dataSource={data_2}
                                columns={column_2}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    جدول موجودی کارکنان وظیفه بر اساس درجه
                                </Typography.Title>}
                                dataSource={data_3}
                                columns={column_3}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    جدول موجودی کارکنان وظیفه پاسدار به تفکیک مدرک تحصیلی
                                </Typography.Title>}
                                dataSource={data_4}
                                columns={column_4}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    موجودی کلی کارکنان وظیفه به تفکیک مذهب
                                </Typography.Title>}
                                dataSource={data_5}
                                columns={column_5}
                            />
                        </>,
                        <>

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    تعداد کارکنان وظیفه فراری در بازه 6 ماهه.(کارکان وظیفه فراری به علاوه کارکنان وظیفه
                                    ای که از فرار مراجعت نموده اند.)
                                </Typography.Title>}
                                dataSource={data_6}
                                columns={column_6}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    تعداد کارکنان وظیفه فراری در بازه 6 ماهه از فرار مراجعت نموده اند.(تنها کارکان وظیفه
                                    ای که از فرار مراجعت نموده اند.)
                                </Typography.Title>}
                                dataSource={data_7}
                                columns={column_6}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    موجودی کارکنان وظیفه معاف از رزم به تفکیک مقطع تحصیلی
                                </Typography.Title>}
                                dataSource={data_9}
                                columns={column_9}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    موجودی کارکنان وظیفه معاف از رزم به تفکیک درجه
                                </Typography.Title>}
                                dataSource={data_10}
                                columns={column_10}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    موجودی کارکنان وظیفه متاهل بر حسب فاصله 50 کیلومتر به تفکیک درجه
                                </Typography.Title>}
                                dataSource={data_11}
                                columns={column_11}
                            />
                        </>,
                        <>
                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    آمار کارکنان وظیفه فراری در بازه سالانه (تنها کارکان وظیفه فراری)
                                </Typography.Title>}
                                dataSource={data_8}
                                columns={column_8}
                            />
                        </>,
                        <>
                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    جدول موجودی کارکنان وظیفه به تفکیک تخصص(مقطع تحصیلی)
                                </Typography.Title>}
                                dataSource={data_13}
                                columns={column_13}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    جدول موجودی کارکنان وظیفه بر اساس درجه
                                </Typography.Title>}
                                dataSource={data_14}
                                columns={column_14}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    موجودی کارکنان وظیفه متاهل بر حسب فاصله 50 کیلومتر به تفکیک مقطع تحصیلی
                                </Typography.Title>}
                                dataSource={data_12}
                                columns={column_12}
                            />
                        </>,
                        <>
                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    موجودی کارکنان وظیفه بومی و غیر بومی بر مبنای 50 کیلومتر
                                </Typography.Title>}
                                dataSource={data_15}
                                columns={column_15}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    موجودی کارکنان وظیفه بومی و غیر بومی بر مبنای 300 کیلومتر
                                </Typography.Title>}
                                dataSource={data_15}
                                columns={column_15}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    جدول ترخیص کارکنان وظیفه براساس مدرک تحصیلی
                                </Typography.Title>}
                                dataSource={data_16}
                                columns={column_16}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    جدول ترخیص کارکنان وظیفه براساس درجه
                                </Typography.Title>}
                                dataSource={data_17}
                                columns={column_17}
                            />
                        </>,
                        <>
                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    آخرین آمار موجودی ماهیانه کارکنان وظیفه مامور به دستگاه های غیر نظامی بر حسب طیف
                                    تحصیلات
                                </Typography.Title>}
                                dataSource={data_19}
                                columns={column_19}
                            />

                            <Table
                                style={{width: "95%"}}
                                bordered={true}
                                size={"small"}
                                pagination={false}
                                title={() => <Typography.Title level={5} style={{textAlign: "center", fontSize: 14}}>
                                    آخرین آمار موجودی ماهیانه کارکنان وظیفه مامور به دستگاه های غیر نظامی بر حسب طیف
                                    درجه
                                </Typography.Title>}
                                dataSource={data_20}
                                columns={column_20}
                            />
                        </>
                    ].map((v) => (
                        <Flex vertical={true} align={"center"}
                              style={{
                                  border: "solid gray 2px",
                                  borderRadius: "10px",
                                  paddingTop: "20px",
                                  background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                              }}
                              className={"break-after A4-landscape"}
                              gap={"small"}
                        >
                            <Flex justify={"flex-end"} style={{width: "95%"}}>
                                <Flex style={{border: "1px solid black", padding: 3}}>
                                    <Typography.Text>
                                        خیلی محرمانه
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Table: {
                                            fontSize: 12,
                                            paddingXS: 2
                                        }
                                    },
                                }}
                            >
                                {v}
                            </ConfigProvider>
                            <Flex justify={"flex-end"} style={{width: "95%"}}>
                                <Flex style={{border: "1px solid black", padding: 3}}>
                                    <Typography.Text>
                                        خیلی محرمانه
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                            <Flex justify={"space-between"} style={{width: "95%"}}>
                                {
                                    [
                                        "رئیس دایره وظیفه های ف پش نپاجا",
                                        "مدیر نیروی انسانی ف پش نپاجا",
                                        "فرماندهی پشتیبانی مرکز نپاجا"
                                    ].map((v) => (
                                        <Sign.Single
                                            defaultSign={v}
                                            fontSize={12}
                                        />
                                    ))
                                }
                            </Flex>
                        </Flex>
                    ))
                }
            </Flex>
        </Flex>
    );
}

export default StatsReport;