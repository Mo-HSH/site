import {
    Button,
    ConfigProvider,
    Divider,
    Flex,
    Form,
    Input,
    notification, Row,
    Table,
    Tooltip,
    Typography
} from "antd";
import {dateValidator} from "../../utils/Validates.js";
import {useCallback, useRef, useState, useEffect} from "react";
import {useReactToPrint} from "react-to-print";
import padafandLogoOpacityLow from "../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";
import {GetDateMinus, GetQueryDate, GetYear} from "../../utils/Calculative.js";
import Sign from "../../components/printElement/Sign.jsx";

function QuantityReport() {
    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);

    const [gordanSold, setGordanSold] = useState(0);
    const [gordanSerg, setGordanSerg] = useState(0);
    const [gordanOffice, setGordanOffice] = useState(0);

    const [hefazatSold, setHefazatSold] = useState(0);
    const [hefazatSerg, setHefazatSerg] = useState(0);
    const [hefazatOffice, setHefazatOffice] = useState(0);

    useEffect(() => {
        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "entry_date": {
                    "$lte": GetQueryDate(Date.now())
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

                    ]
                },
                "military_rank": {
                    "$in": [
                        "سرباز",
                        "سرباز یکم",
                        "سرباز دوم",
                        "سرجوخه"
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
                "last_name": 1
            }
        }, {withCredentials: true}).then((response) => {
            const {data} = response;
            setGordanSold(data.length);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "entry_date": {
                    "$lte": GetQueryDate(Date.now())
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

                    ]
                },
                "military_rank": {
                    "$in": [
                        "گروهبان سوم",
                        "گروهبان دوم",
                        "گروهبان یکم",
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
                "last_name": 1
            }
        }, {withCredentials: true}).then((response) => {
            const {data} = response;
            setGordanSerg(data.length);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        });

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "entry_date": {
                    "$lte": GetQueryDate(Date.now())
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

                    ]
                },
                "military_rank": {
                    "$in": [
                        "ستوان سوم",
                        "ستوان دوم",
                        "ستوان یکم",
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
                "last_name": 1
            }
        }, {withCredentials: true}).then((response) => {
            const {data} = response;
            setGordanOffice(data.length);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        });

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "entry_date": {
                    "$lte": GetQueryDate(Date.now())
                },
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                    ]
                },
                "military_rank": {
                    "$in": [
                        "سرباز",
                        "سرباز یکم",
                        "سرباز دوم",
                        "سرجوخه"
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
                "last_name": 1
            }
        }, {withCredentials: true}).then((response) => {
            const {data} = response;
            setHefazatSold(data.length);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        })

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "entry_date": {
                    "$lte": GetQueryDate(Date.now())
                },
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                    ]
                },
                "military_rank": {
                    "$in": [
                        "گروهبان سوم",
                        "گروهبان دوم",
                        "گروهبان یکم",
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
                "last_name": 1
            }
        }, {withCredentials: true}).then((response) => {
            const {data} = response;
            setHefazatSerg(data.length);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        });

        axios.post(getApiUrl("soldier/list"), {
            "filter": {
                "entry_date": {
                    "$lte": GetQueryDate(Date.now())
                },
                "status": {
                    "$in": [
                        "حاضر",
                        "فرار"
                    ]
                },
                "unit": {
                    "$in": [
                        "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
                    ]
                },
                "military_rank": {
                    "$in": [
                        "ستوان سوم",
                        "ستوان دوم",
                        "ستوان یکم",
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
                "last_name": 1
            }
        }, {withCredentials: true}).then((response) => {
            const {data} = response;
            setHefazatOffice(data.length);
        }).catch((err) => {
            api["error"]({
                message: "خطا", description: err
            });
        });
    }, []);


    // function onFinish(value) {
    //
    //     axios.post(getApiUrl("soldier/list"), {
    //         "filter": {
    //             "entry_date": {
    //                 "$lte": GetQueryDate(value["date"])
    //             },
    //             "status": {
    //                 "$in": [
    //                     "حاضر",
    //                     "فرار"
    //                 ]
    //             },
    //             "unit": {
    //                 "$in": [
    //                     "فرماندهی پشتیبانی مرکز نپاجا - گ.خ",
    //                     "فرماندهی پشتیبانی مرکز نپاجا - ت.ح",
    //                 ]
    //             }
    //         },
    //         "projection": {
    //             "education": 1,
    //             "field_of_study": 1,
    //             "military_rank": 1,
    //             "mental_health": 1,
    //             "extra_info": 1,
    //             "religion": 1,
    //             "is_native": 1,
    //         }
    //     }, {withCredentials: true}).then((response) => {
    //
    //         console.log(response)
    //     }).catch((err) => {
    //         api["error"]({
    //             message: "خطا", description: err
    //         });
    //     })
    //
    //
    // }

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
                {/*<Button onClick={onFinish}>ارسال</Button>*/}
            </Flex>
            <Divider/>
            <Flex vertical={true} style={{marginBottom: "20px"}}>

                <Form
                    layout={"inline"}
                    style={{ width: "100%",justifyContent: "center" }}
                >
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
                <Flex style={{
                    border: "solid gray 2px",
                    borderRadius: "10px",
                    background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`
                }}
                      className={"break-after A5-landscape"}
                      gap={"small"}>
                    <Flex vertical={true} style={{width: "100%", padding: "50px"}} align={"center"}>
                        <Typography.Text strong={true} style={{marginBottom: "50px", fontSize: "24px"}}>فرماندهی پشتیانی مرکز
                            نپاجا</Typography.Text>
                        <table className="qr-table" style={{width: '100%', textAlign: "center"}} border={2}>
                            <thead>
                            <tr>
                                <th className="qr-title" style={{width: "25%", height: "80px"}}>
                                    <span>درجه</span>
                                    <span>یگان</span>
                                </th>
                                <th style={{width: "25%"}}>تامین حفاظت</th>
                                <th style={{width: "25%"}}>خدمات پاسداری</th>
                                <th style={{width: "25%"}}>جمع کل</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr style={{height: "80px"}}>
                                <td style={{textAlign: "center"}}>افسر</td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{hefazatOffice}</td>
                                            <td>82</td>
                                        </tr>
                                    </table>
                                </td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{gordanOffice}</td>
                                            <td>194</td>
                                        </tr>
                                    </table>
                                </td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{hefazatOffice + gordanOffice}</td>
                                            <td>0</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{height: "80px"}}>
                                <td style={{textAlign: "center"}}>درجه دار</td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{hefazatSerg}</td>
                                            <td>0</td>
                                        </tr>
                                    </table>
                                </td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{gordanSerg}</td>
                                            <td>40</td>
                                        </tr>
                                    </table>
                                </td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{hefazatSerg + gordanSerg}</td>
                                            <td>40</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{height: "80px"}}>
                                <td style={{textAlign: "center"}}>سرباز</td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{hefazatSold}</td>
                                            <td>0</td>
                                        </tr>
                                    </table>
                                </td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{gordanSold}</td>
                                            <td>718</td>
                                        </tr>
                                    </table>
                                </td>
                                <td>
                                    <table border={2} style={{width: "100%"}}>
                                        <tr>
                                            <td>موجودی</td>
                                            <td>سازمانی</td>
                                        </tr>
                                        <tr>
                                            <td>{hefazatSold + gordanSerg}</td>
                                            <td>718</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            </tbody>

                        </table>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default QuantityReport;