import {useCallback, useEffect, useRef, useState} from "react";
import {
    Button,
    Col,
    ConfigProvider,
    Flex,
    Form,
    Image,
    Input,
    notification,
    Popover,
    Row,
    Select,
    Typography
} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";


function MD60({setPrintTitle, soldierKey}) {

    const [soldier, setSoldier] = useState({});
    const printComponent = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const [today, setToday] = useState("");
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [input, setInput] = useState({});
    const [selectValue, setSelectValue] = useState("");
    const options = [
        {
            label: "الف-بیماری مانع از حضور که وفق مقررات ابلاغی به تائید پزشک یگان محل خدمت فرد برسد",
            value: "الف-بیماری مانع از حضور که وفق مقررات ابلاغی به تائید پزشک یگان محل خدمت فرد برسد"
        },
        {
            label: "ب-فوت همسر، پدر، مادر، برادر، خواهر، اولاد (در زمانی که عرفا برای مراسم اولیه ضرورت دارد) و همچنین بیماری سخت یکی از آنان (در صورتی که مراقبدیگری نباشد و به مراقبت وی نیاز باشد)",
            value: "ب-فوت همسر، پدر، مادر، برادر، خواهر، اولاد (در زمانی که عرفا برای مراسم اولیه ضرورت دارد) و همچنین بیماری سخت یکی از آنان (در صورتی که مراقبدیگری نباشد و به مراقبت وی نیاز باشد)"
        },
        {
            label: "پ-ابتلا به بلایای طبیعی و حوادث بزرگ مانند سیل، زلزله، صاعقه، آتش سوزی‌های مهیب، تصادفات دارای خسارت مالی یا جانی",
            value: "پ-ابتلا به بلایای طبیعی و حوادث بزرگ مانند سیل، زلزله، صاعقه، آتش سوزی‌های مهیب، تصادفات دارای خسارت مالی یا جانی"
        },
        {label: "ت-در توقیف یا حبس بودن با تائید مراجع مربوطه", value: "ت-در توقیف یا حبس بودن با تائید مراجع مربوطه"},
        {
            label: "ث-سایر موارد بنا به تشخیص هیئت مانند ورشکستگی یا مشکلات شدید مالی. تحت پوشش بودن نهادهای حمایتی مثل بنیاد مستضعفان. کمیته امداد. بهزیستی. متارکه والدین. مسئولیت نگهداری یک از اعضا معلول خانواده که نیاز به مراقبت دارند. سر پرستی همسر، فرزند، برادر یا خواهر کوچک‌تر فاقد سرپرست. نوع رفتار مسئولین یگان که در فرار از خدمت سربازان موثر بوده است",
            value: "ث-سایر موارد بنا به تشخیص هیئت مانند ورشکستگی یا مشکلات شدید مالی. تحت پوشش بودن نهادهای حمایتی مثل بنیاد مستضعفان. کمیته امداد. بهزیستی. متارکه والدین. مسئولیت نگهداری یک از اعضا معلول خانواده که نیاز به مراقبت دارند. سر پرستی همسر، فرزند، برادر یا خواهر کوچک‌تر فاقد سرپرست. نوع رفتار مسئولین یگان که در فرار از خدمت سربازان موثر بوده است"
        },
    ]
    // const [desc, setDesc] = useState("");
    const [value, setValue] = useState("-");


    useEffect(() => {
        setPrintTitle("صورتجلسه ماده 60");

        axios.get(getApiUrl("utils/get_date_now"), {withCredentials: true}).then((res) => {
            setToday(DateRenderer({"$date": {"$numberLong": res.data}}));
        }).catch(() => {
            api["error"]({
                message: "خطا",
                description: "خطا در دریافت تاریخ!"
            });
        });

        axios.post(getApiUrl("soldier/list"), {
                "filter":
                    {
                        "_id":
                            {
                                "$oid": soldierKey
                            }
                    }
                ,
                "projection":
                    {
                        "profile": 1,
                        "folder_number": 1,
                        "first_name": 1,
                        "last_name": 1,
                        "father_name": 1,
                        "military_rank": 1,
                        "deployment_date": 1,
                        "national_code": 1,
                        "run": 1
                    }
            },
            {withCredentials: true}
        )
            .then((response) => {
                let res = response.data;
                // console.log(DateRenderer(res[0]["run"][0]["absence_date"]))
                // console.log(DateRenderer(res[0]["run"][0]["run_date"]))
                console.log(Date(+res[0]["run"][0]["return_date"]["$date"]["$numberLong"] - +res[0]["run"][0]["run_date"]["$date"]["$numberLong"]))
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSoldier({
                        ...res[0],
                        "full_name": res[0]["first_name"] + " " + res[0]["last_name"],
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        "absence_date": DateRenderer(res[0]["run"][0]["absence_date"]),
                        "run_date": DateRenderer(res[0]["run"][0]["run_date"]),
                        "run_count": DateRenderer(res[0]["run"][0]["run_count"]),
                        "return_date": DateRenderer(res[0]["run"][0]["return_date"]),
                        "run_duration": res[0]["run"][0]["run_duration"],
                        "run_punishment": res[0]["run"][0]["run_duration"] >= 45 ? 90 : res[0]["run"][0]["run_duration"] * 2
                    });

                    setReadyForPrint(true);
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.data
                });
            });

    }, [soldierKey]);

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    function popoverContent() {
        return (
            <Select
                onChange={(v) => {
                    console.log(v)
                    setSelectValue(v);
                    const temp = options.find(e => e.label === v);
                    if (temp === undefined) {
                        return;
                    }
                    setValue(temp);
                }}
                placement={"bottomCenter"}
                defaultValue={"default"}
                value={selectValue}
                placeholder={"امضا را انتخاب کنید"}
                popupMatchSelectWidth={false}
                maxTagCount={0}
                showSearch
                options={options}
                style={{width: "100%"}}
            />
        );
    }

    return (
        <div>
            <ConfigProvider

            >
                {contextHolder}
                <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                      style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>
                    <Select
                        onSelect={(e) => {
                            setValue(e)
                        }}
                        mode={"tags"}
                        showSearch
                        options={options}
                        // loading={fieldOfStudy.length === 0}
                        placeholder={"علت ماده 60 را انتخاب کنید."}
                        maxCount={1}
                        style={{width: "300px"}}
                    />
                    <Button disabled={!readyForPrint} type={"primary"} onClick={handlePrint}>پرینت</Button>
                </Flex>
                <Flex justify={"center"} align={"center"} vertical={true} ref={printComponent}
                      style={{width: "100%", top: "50%", left: "50%"}}>
                    <style>
                        {`
                            @media print {
                              @page {
                                size: portrait;
                              }
                            }
                        `}
                    </style>
                    <Flex vertical={true} align={"center"}
                          style={{
                              border: "solid gray 2px",
                              borderRadius: "10px",
                              // background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`,
                              padding: "0 30px"
                          }}
                          className={"break-after A4-portrait"}
                    >
                        <Flex vertical={true} style={{width: "100%", textAlign: "center"}} justify={"center"}>
                            <Typography.Text style={{margin: "20px 0"}} strong={true}>بسمه تعالی</Typography.Text>
                            <Typography.Text style={{fontSize: "14px"}} strong={true}> صورتجلسه کمیسیون طرح میثاق
                                8(دستور العمل بند الف ماده 60 قانون مجازات جرائم نیروهای مسلح)
                                مورخه {today}</Typography.Text>
                        </Flex>

                        <Flex vertical={true}
                              className="md-content"
                              style={{
                                  width: "100%",
                                  marginTop: "30px",
                                  gap: "10px",
                                  textAlign: "justify",
                                  lineHeight: "2"
                              }}
                              justify={"center"}>
                            <Typography.Text style={{display: "block"}}>
                                {"1-در اجرای "}
                                <Typography.Text underline={true}>مفاد بند الف ماده 60 قانون مجازات جرائم نیروهای
                                    مسلح</Typography.Text>
                                {" که اشعار می دارد:"}
                            </Typography.Text>
                            <Typography.Text style={{textIndent: "60px", display: "block"}}>
                                الف) با کارکنان وظیفه جمعی که در زمان صلح برای اولین بار مرتکب فرار از خدمت شده و ظرف
                                مدت 60 روز از شروع غیبت (از روزی که در محل خدمت حاضر شده تا پایان شصتمین روز) مراجعه
                                نمایند، بدون ارجاع پرونده به مراجع قضایی بر اساس این دستورالعمل رفتار نمایند.
                            </Typography.Text>
                            <Typography.Text style={{textIndent: "60px", display: "block"}}>
                                ب) به خدمت دوره ضرورت کارکنان وظیفه این دستورالعمل به ازا هر روز غیبت و فرار تا 2 روز به
                                خدمت آنان اضافه شود که این اضافه خدمت بیش از3 ماه نخواهد بود؛
                            </Typography.Text>
                            <Typography.Text style={{display: "block"}}>
                                {"وضعیت خدمتی "}
                                <Typography.Text strong={true}
                                >{soldier["military_rank"]}</Typography.Text>
                                {" و "}
                                <Typography.Text strong={true}>{soldier["full_name"]}</Typography.Text>
                                {" اعزامی "}
                                <Typography.Text strong={true}
                                >{soldier["deployment_date"]}</Typography.Text>
                                {" که از مورخه "}
                                <Typography.Text strong={true}
                                >{soldier["absence_date"]}</Typography.Text>
                                {" مبادرت به نهست و در تاریخ "}
                                <Typography.Text strong={true}>{soldier["run_date"]}</Typography.Text>
                                {" برای اولین مرتبه از خدمت فراری و در تاریخ "}
                                <Typography.Text strong={true}
                                >{soldier["return_date"]}</Typography.Text>
                                {" پس مدت از "}
                                <Typography.Text strong={true}
                                >{soldier["run_duration"]}</Typography.Text>
                                {" روز از فرار مراجعت که برابر مفاد ماده قانون پیش گفته ، به مدت خدمت وی "}
                                <Typography.Text strong={true}
                                >{soldier["run_punishment"]}</Typography.Text>
                                {" مورد بررسی قرارگرفت ومشخص گردید برابر مدارک ارائه شده مدت غیبت و فرار نامبرده متاثر ازبیماری و وضعیت معیشتی بسیار نامناسب مشارالیه بوده است."}
                            </Typography.Text>
                            <Typography.Text style={{display: "block"}}>
                                {"2-پس از بحث و تبادل نظر اعضاء مقرر گردید  با توجه به وضعیت خاص خدمتی نامبرده که از سربازان ساعی و پرتلاش خدمات پاسداری بوده،"}
                                <Typography.Text strong={true}>
                                    {" مدت "}
                                    <Typography.Text>{soldier["run_punishment"]}</Typography.Text>
                                    {" روز اضافه خدمت انضباطی  ناشی از فرار مرتبه اول"}
                                </Typography.Text>
                                {" به استناد بند "}
                                <Typography.Text strong={true}
                                >{value.split("-")[0]}</Typography.Text>
                                {" قسمت "}
                                <Typography.Text strong={true}
                                >5</Typography.Text>
                                {" دستورالعمل معاذیربخشش اضافه خدمت سربازان اشاره شده در "}
                                <Typography.Text strong={true}
                                >طرح میثاق8</Typography.Text>
                                {' که بیان می نماید "'}
                                <Typography.Text strong={true}
                                >{value.split("-")[1]}</Typography.Text>
                                {'" مورد بخشش قرار گرفت .'}
                            </Typography.Text>
                        </Flex>


                        <Flex vertical={true}
                              style={{width: "100%", marginTop: "60px"}}>
                            <Sign.Md60/>
                        </Flex>
                    </Flex>

                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default MD60;