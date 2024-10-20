import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";
import {Button, Flex, notification} from "antd";
import {useReactToPrint} from "react-to-print";

function AlefForm({setPrintTitle, alefFormNumber, refresher}) {
    const [soldier, setSoldier] = useState({
        "folder_number": "",
        "release": {
            "create_date": "",
            "military_guild": ""
        }
    });
    const [releaseSign, setReleaseSign] = useState([]);
    const [readyForPrint, setReadyForPrint] = useState(false);

    const [api, contextHolder] = notification.useNotification();
    const printComponent = useRef(null);

    useEffect(() => {
        setPrintTitle("فرم الف");
        axios.get(getApiUrl("config/signs"), {withCredentials: true}).then((res) => {
            let temp = [];
            res.data.config.forEach(({key, value}) => {
                if (key in ["رئیس دایره وظیفه های ف پش نیروی پدافند هوایی آجا"]) {
                    temp.push(value);
                }
            })
            setReleaseSign(temp)
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تنظیمات امضا!"
            });
        });

        axios.post(getApiUrl("soldier/list"), {

            "filter":
                {
                    "release_progress":
                        {
                            "alef_form_number": alefFormNumber
                        }
                }
            ,
            "projection":
                {
                    "first_name": 1,
                    "last_name": 1,
                    "father_name": 1,
                    "military_rank": 1,
                    "deployment_date": 1,
                    "national_code": 1,
                    "release_progress": 1,
                }
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSoldier({
                        ...res[0],
                    });

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data.message
                });
            });
    }, [setPrintTitle, alefFormNumber, refresher]);

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });


    return (
        <div className={"highlighter"}>
            {contextHolder}
            <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                  style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>

                <Button disabled={!readyForPrint} type={"primary"} onClick={handlePrint}>پرینت</Button>
            </Flex>

            <Flex justify={"center"} align={"center"} vertical={true} ref={printComponent}
                  style={{width: "100%", top: "50%", left: "50%"}}>
                <style>
                    {`
                            @media print {
                              @page {
                                size: landscape;
                              }
                            }
                        `}
                </style>

            </Flex>
        </div>
    );
}

export default AlefForm;