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
    Select, Table,
    Typography
} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import {useReactToPrint} from "react-to-print";
import padafandLogo from "../../../assets/img/Padafand_Logo.svg";
import Sign from "../../../components/printElement/Sign.jsx";
import padafandLogoOpacityLow from "../../../assets/img/Padafand_Logo_1.svg";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";
import {calculateDate} from "../../../utils/date.js";


function Remission({setPrintTitle, soldierKey}) {

    const [soldier, setSoldier] = useState({});
    const printComponent = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const [today, setToday] = useState("");
    const [readyForPrint, setReadyForPrint] = useState(false);
    const [input, setInput] = useState({
        "guard_duration": 0,
        "info_duty": "-",
        "bad_term": 0,
        "remission_req": 0,
    });
    const [input2, setInput2] = useState({
        "info": "",
    });
    const [selectValue, setSelectValue] = useState("");
    const options = [
        {
            label: "بند 1-کارکنان وظیفه‌ای که برابر ضوابط سازمان محل خدمت، به عنوان سرباز نمونه در یگان‌های خدمتی به نیروی مربوطه یا رده‌‌های همطراز جهت معرفی به جشنواره‌های سازمانی و نیرویی ماننده جشنواره حضرت علی اکبر (ع)، مراسم گرامیداشت روز سرباز، برتر دوره‌های آموزشی (رزم مقدماتی، تخصصی، مهارت آموزی ...) انتخاب شده باشند.",
            value: "بند 1-کارکنان وظیفه‌ای که برابر ضوابط سازمان محل خدمت، به عنوان سرباز نمونه در یگان‌های خدمتی به نیروی مربوطه یا رده‌‌های همطراز جهت معرفی به جشنواره‌های سازمانی و نیرویی ماننده جشنواره حضرت علی اکبر (ع)، مراسم گرامیداشت روز سرباز، برتر دوره‌های آموزشی (رزم مقدماتی، تخصصی، مهارت آموزی ...) انتخاب شده باشند."
        },
        {
            label: "بند 2-کارکنان وظیفه که در عین رعایت نظم و انضباط، در طول خدمت موفق به ثبت ابتکار منجر به تولید محصول، مقاله علمی مهم و معتبر قبل از ورود به خدمت و یا حین خدمت شده باشند.",
            value: "بند 2-کارکنان وظیفه که در عین رعایت نظم و انضباط، در طول خدمت موفق به ثبت ابتکار منجر به تولید محصول، مقاله علمی مهم و معتبر قبل از ورود به خدمت و یا حین خدمت شده باشند."
        },
        {
            label: "بند 3-کارکنان وظیفه نفر اول تا سوم مسابقات فرهنگی، ورزشی، علوم قرآنی و علمی و ... در سطح یگانی، استانی، نیرویی گردند.",
            value: "بند 3-کارکنان وظیفه نفر اول تا سوم مسابقات فرهنگی، ورزشی، علوم قرآنی و علمی و ... در سطح یگانی، استانی، نیرویی گردند."
        },
        {
            label: "بند 4-نفرات حائز رتبه برتر اول تا دهم مسابقات فرهنگی، ورزشی، علوم قرآنی و علمی و ... نیروهای که در سطح سازمان‌های نیروهای مسلح برگزار می‌شود.",
            value: "بند 4-نفرات حائز رتبه برتر اول تا دهم مسابقات فرهنگی، ورزشی، علوم قرآنی و علمی و ... نیروهای که در سطح سازمان‌های نیروهای مسلح برگزار می‌شود."
        },
        {
            label: "بند 5-کارکنان وظیفه حافظ حداقل یک جزء قرآن را حفظ نمایند.",
            value: "بند 5-کارکنان وظیفه حافظ حداقل یک جزء قرآن را حفظ نمایند."
        },
        {
            label: "بند 6-کارکنان وظیفه حافظ حداقل یک پنجم (نهج البلاغه، صحیفه سجادیه، اصول کافی).",
            value: "بند 6-کارکنان وظیفه حافظ حداقل یک پنجم (نهج البلاغه، صحیفه سجادیه، اصول کافی)."
        },
        {
            label: "بند 7-کارکنان وظیفه فعال در امور فرهنگی، از قبیل مراسمات هفتگی دعای کمیل، زیارت عاشورا، دعای توسل، دعای ندبه و ... در طول خدمت دوره ضرورت.",
            value: "بند 7-کارکنان وظیفه فعال در امور فرهنگی، از قبیل مراسمات هفتگی دعای کمیل، زیارت عاشورا، دعای توسل، دعای ندبه و ... در طول خدمت دوره ضرورت. "
        },
        {
            label: "بند 8-کارکنان وظیفه‌ای که در حین خدمت و انجان ماموریت، بنا به هردلیل چار حادثه منجر به معلولیت یا جانبازی یا از کار افتادگی شوند. در صورتی که نجر به معافیت نشود.",
            value: "بند 8-کارکنان وظیفه‌ای که در حین خدمت و انجان ماموریت، بنا به هردلیل چار حادثه منجر به معلولیت یا جانبازی یا از کار افتادگی شوند. در صورتی که نجر به معافیت نشود."
        },
        {
            label: "بند 9-کارکنان وظیفه‌ای که در راستای ترویج فرهنگ علوم قرآنی، برگزاری نماز جماعت و ترویج تفکر بسیجی، انجام وظایف محوله در بین کارکنان وظیفه شاخص و تاثیر گذار، مثبت و الگو می‌باشند.",
            value: "بند 9-کارکنان وظیفه‌ای که در راستای ترویج فرهنگ علوم قرآنی، برگزاری نماز جماعت و ترویج تفکر بسیجی، انجام وظایف محوله در بین کارکنان وظیفه شاخص و تاثیر گذار، مثبت و الگو می‌باشند."
        },
        {
            label: "بند 10-کارکنان وظیفه‌ای که با تلاش وافر جهت تقویت اعتقادات دینی و اسلامی و انجام وظایف سازمانی در طول مدت خدمت پیشرفت قابل ملاحظه‌ای داشته باشند.",
            value: "بند 10-کارکنان وظیفه‌ای که با تلاش وافر جهت تقویت اعتقادات دینی و اسلامی و انجام وظایف سازمانی در طول مدت خدمت پیشرفت قابل ملاحظه‌ای داشته باشند."
        },

        {
            label: "بند 11-حسن نگهداری اموال در اختیار مانند: رانندگان و سربازان ساعی، به تایید فرمانده یگان و نیروی انسانی محل خدمت.",
            value: "بند 11-حسن نگهداری اموال در اختیار مانند: رانندگان و سربازان ساعی، به تایید فرمانده یگان و نیروی انسانی محل خدمت."
        },
        {
            label: "بند 12-افرادی که دارای شرایط خاص می‌باشند (مانند کارکنان وظیفه یتیم، فرزند ایثارگران، کارکنان وظیفه متاهل، پدر در حبس مشروط به اینکه محکومیت امنیتی نباشد، فوت اعضای درجه یک خانواده در طول خدمت کارکنان وظیفه تحت پوشش کمیته امداد و یا سازمان بهزیستی ...).",
            value: "بند 12-افرادی که دارای شرایط خاص می‌باشند (مانند کارکنان وظیفه یتیم، فرزند ایثارگران، کارکنان وظیفه متاهل، پدر در حبس مشروط به اینکه محکومیت امنیتی نباشد، فوت اعضای درجه یک خانواده در طول خدمت کارکنان وظیفه تحت پوشش کمیته امداد و یا سازمان بهزیستی ...)."
        },
        {
            label: "بند 13-خدمت در مناطق امنیتی درگیر حداقل به مدت 6 ماه، در صورتی که بلافاصله بعد از اتمام آموزش رزم مقدماتی به مناطق معرفی شده باشند، یا 8 ماه متناوب در طول خدمت (برای بومی و غیر بومی).",
            value: "بند 13-خدمت در مناطق امنیتی درگیر حداقل به مدت 6 ماه، در صورتی که بلافاصله بعد از اتمام آموزش رزم مقدماتی به مناطق معرفی شده باشند، یا 8 ماه متناوب در طول خدمت (برای بومی و غیر بومی)."
        },
        {
            label: "بند 14-خدمت کارکنان وظیفه غیر بومی در منطق عملیاتی و امنیتی غیر درگیر به مدت 10 ماه.",
            value: "بند 14-خدمت کارکنان وظیفه غیر بومی در منطق عملیاتی و امنیتی غیر درگیر به مدت 10 ماه."
        },
        {
            label: "بند 15-خدمت کارکنان وظیفه غیر بومی در مناطق محروم و بد آب و هوا حداقل به مدت 12 ماه.",
            value: "بند 15-خدمت کارکنان وظیفه غیر بومی در مناطق محروم و بد آب و هوا حداقل به مدت 12 ماه."
        },
        {
            label: "بند 16-خدمت در مشاغل سخت و زیان‌آور مانند امور حفاظت فیزیکی، دژبانی، رانندگی در مناطق کم برخوردار، خدمت پشتیبانی در مناطق محروم و بد آب و هوا، عملیاتی و امنیتی، برابر مقررات ابلاغی مربوط حداقل به مدت 12 ماه.",
            value: "بند 16-خدمت در مشاغل سخت و زیان‌آور مانند امور حفاظت فیزیکی، دژبانی، رانندگی در مناطق کم برخوردار، خدمت پشتیبانی در مناطق محروم و بد آب و هوا، عملیاتی و امنیتی، برابر مقررات ابلاغی مربوط حداقل به مدت 12 ماه."
        },
        {
            label: "بند 17-خدمت کارکنان وظیفه در مناطقی بیش از 300 کیلومتر خارج از محل سکونت حداقل به مدت 12 ماه.",
            value: "بند 17-خدمت کارکنان وظیفه در مناطقی بیش از 300 کیلومتر خارج از محل سکونت حداقل به مدت 12 ماه."
        },
        {
            label: "بند 18-کارکنان وظیفه شاغل در مناطق عادی که حداقل یک سال را در یگان پاسداری خدمت نمایند.",
            value: "بند 18-کارکنان وظیفه شاغل در مناطق عادی که حداقل یک سال را در یگان پاسداری خدمت نمایند."
        },
        {
            label: "بند 19-نفرات اول تا سوم منتخب دوره‌های آموزشی مهارت آموزی شاغل در مناطق کم برخوردار، در صورت بکارگیری در مهارت کسب شده در یگان خدمتی.",
            value: "بند 19-نفرات اول تا سوم منتخب دوره‌های آموزشی مهارت آموزی شاغل در مناطق کم برخوردار، در صورت بکارگیری در مهارت کسب شده در یگان خدمتی."
        },
        {
            label: "بند 20-کارکنان وظیفه ای که دارای توانایی و مهارت مورد نیاز یگان ن.م بوده و در طول خدمت در مشاغل مرتبط با تخصص به گونه ای موثر بکارگیری شده باشند.",
            value: "بند 20-کارکنان وظیفه ای که دارای توانایی و مهارت مورد نیاز یگان ن.م بوده و در طول خدمت در مشاغل مرتبط با تخصص به گونه ای موثر بکارگیری شده باشند."
        },

        {
            label: "بند 21-نفرات اول تا سوم هر گروهان، گردان و تیپ در دوره‌های آموزش رزم مقدماتی و تخصصی.",
            value: "بند 21-نفرات اول تا سوم هر گروهان، گردان و تیپ در دوره‌های آموزش رزم مقدماتی و تخصصی."
        },
        {
            label: "بند 22-کسب نمرات 90 از 100 به بالاتر در دوره آموزش رزم مقدماتی و تخصصی.",
            value: "بند 22-کسب نمرات 90 از 100 به بالاتر در دوره آموزش رزم مقدماتی و تخصصی."
        },
        {
            label: "بند 23-کارکنان وظیفه‌ ای که در طول خدمت وظایف محوله به آنان عمدتا در محیط‌های خارج از ساختمان‌ها می‌باشد که به واسطه انجام شغل، عموما در معرض شرایط جوی در سرما و گرما حضور دارند.",
            value: "بند 23-کارکنان وظیفه‌ ای که در طول خدمت وظایف محوله به آنان عمدتا در محیط‌های خارج از ساختمان‌ها می‌باشد که به واسطه انجام شغل، عموما در معرض شرایط جوی در سرما و گرما حضور دارند."
        },
        {
            label: "بند 24-فرزندان کاکنان نیروهای مسلح مشروط به خدمت در خارج از محل سکونت و به صورت غیر بومی.",
            value: "بند 24-فرزندان کاکنان نیروهای مسلح مشروط به خدمت در خارج از محل سکونت و به صورت غیر بومی."
        },
        {
            label: "بند 25-کارکنان وظیفه ای که موفق به گذراندن دوره های تخصصی مورد نیاز یگان‌های نیروهای مسلح می‌شوند، در صورت بکارگیری موثر در تخصص مربوط.",
            value: "بند 25-کارکنان وظیفه ای که موفق به گذراندن دوره های تخصصی مورد نیاز یگان‌های نیروهای مسلح می‌شوند، در صورت بکارگیری موثر در تخصص مربوط."
        },
        {
            label: "بند 26-کارکنان وظیفه فعال در راستای اجرایی نمودن در دستورالعمل‌های محوری در حوزه کارکنان وظیفه در مانند اجرای طرح مشاور سرباز، طرح معین سربازی، طرح مودت، طرح بازگشت به سنگر، طرح‌های میثاق و ... .",
            value: "بند 26-کارکنان وظیفه فعال در راستای اجرایی نمودن در دستورالعمل‌های محوری در حوزه کارکنان وظیفه در مانند اجرای طرح مشاور سرباز، طرح معین سربازی، طرح مودت، طرح بازگشت به سنگر، طرح‌های میثاق و ... ."
        },
        {
            label: "بند 27-سایر موارد بناء به تشخیص کمیسیون سرباز در یگان و تایید مقامات سرلشکری و بالاتر.",
            value: "بند 27-سایر موارد بناء به تشخیص کمیسیون سرباز در یگان و تایید مقامات سرلشکری و بالاتر."
        },
    ]
    // const [desc, setDesc] = useState("");
    const [value, setValue] = useState("-");
    const [position, setPosition] = useState("-");


    useEffect(() => {
        setPrintTitle("گردشکار اضافه سنواتی");

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
                        "first_name": 1,
                        "last_name": 1,
                        "father_name": 1,
                        "military_rank": 1,
                        "deployment_date": 1,
                        "national_code": 1,
                        "additional_service_day": 1,
                        "absence_discharge": 1,
                        "absence_punish": 1,
                        "arrest_punish": 1,
                        "entry_date": 1,
                        "education": 1,
                        "deficit": 1,
                        "family": 1,
                        "legal_release_date": 1,
                        "overall_release_date": 1,
                    }
            },
            {withCredentials: true}
        )
            .then((response) => {
                let res = response.data;
                // console.log(DateRenderer(res[0]["run"][0]["absence_date"]))
                // console.log(DateRenderer(res[0]["run"][0]["run_date"]))
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSoldier({
                        ...res[0],
                        "full_name": res[0]["first_name"] + " " + res[0]["last_name"],
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                        "legal_date": calculateDate(res[0]["legal_release_date"]["$date"]["$numberLong"], res[0]["additional_service_day"]),
                        "deficit": res[0]["deficit"].reduce((acc, i) => i.day + acc, 0),
                        "marriage": res[0]["family"].find(i => i.relative === "همسر") ? "متاهل" : "مجرد",
                        "arrest": res[0]["arrest_punish"]
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
                </Flex>
                <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                      style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>
                    <Form layout={"inline"}
                          onValuesChange={(changedValues, allValues) => {
                              setInput(allValues);
                          }}>
                        <Form
                            layout={"inline"}
                            style={{marginBottom: "10px"}}
                            onValuesChange={(changedValues, allValues) => {
                                setInput(allValues);
                            }}
                        >
                            <Form.Item
                                label={"مدت انجام پاسداری"}
                                name={"guard_duration"}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="خدمات برجسته در طول خدمت"
                                name="info_duty"
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="قسمت / محل خدمتی"
                                name="bad_term"
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="مدت درخواست بخشش"
                                name="remission_req"
                            >
                                <Input/>
                            </Form.Item>
                        </Form>
                        <Form
                            layout={"inline"}
                            onValuesChange={(changedValues, allValues) => {
                                setInput2(allValues);
                            }}
                        >
                            <Form.Item label="مصادیق">
                                <Select
                                    onSelect={(e) => {
                                        setValue(e)
                                    }}
                                    mode={"tags"}
                                    showSearch
                                    options={options}
                                    // loading={fieldOfStudy.length === 0}
                                    placeholder={"مصادیق"}
                                    maxCount={1}
                                    style={{width: "500px"}}
                                />
                            </Form.Item>
                            <Form.Item label="پاسداری / دژبانی">
                                <Select
                                    onSelect={(e) => {
                                        setPosition(e)
                                    }}
                                    mode={"tags"}
                                    showSearch
                                    options={[{label: "پاسداری", value: "پاسداری"}, {label: "دژبانی", value: "دژبانی"}]}
                                    // loading={fieldOfStudy.length === 0}
                                    placeholder={"پاسداری / دژبانی"}
                                    maxCount={1}
                                    style={{width: "200px"}}
                                />
                            </Form.Item>

                        </Form>
                        <Button disabled={!readyForPrint} type={"primary"} onClick={handlePrint}>پرینت</Button>
                    </Form>
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
                    <Flex vertical={true}
                          style={{
                              border: "solid gray 2px",
                              borderRadius: "10px",
                              background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`,
                              // padding: "0 30px"
                          }}
                          className={"break-after A4-portrait"}
                    >
                        <Flex vertical={true} style={{padding: "10px 30px"}}>

                            <Flex vertical={true} style={{marginBottom: "15px"}}>
                                <Typography.Text strong={true} style={{fontSize: "20px"}}>بسمه تعالی</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "10px"}}>
                                <Typography.Text>از: مدیریت نیروی انسانی پشتیبانی مرکز نیروی پدافند هوایی آجا(دایره
                                    وظیفه
                                    ها)</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "10px"}}>
                                <Typography.Text>به: فرماندهی محترم پشتیبانی مرکز نیروی پدافند هوایی
                                    آجا</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "20px"}}>
                                <Typography.Text>
                                    {"موضوع: "}
                                    <Typography.Text strong={true}>{soldier["military_rank"]}</Typography.Text>
                                    {" وظیفه "}
                                    <Typography.Text strong={true}>{soldier["first_name"]}</Typography.Text>
                                    {" "}
                                    <Typography.Text strong={true}>{soldier["last_name"]}</Typography.Text>
                                    {" فرزند: "}
                                    <Typography.Text strong={true}>{soldier["father_name"]}</Typography.Text>
                                    {" اعزامی: "}
                                    <Typography.Text strong={true}>{soldier["deployment_date"]}</Typography.Text>
                                    {" کد ملی: "}
                                    <Typography.Text strong={true}>{soldier["national_code"]}</Typography.Text>
                                </Typography.Text>
                            </Flex>
                        </Flex>
                        <Flex vertical={true}
                              style={{
                                  textAlign: "center",
                                  borderTop: "1px solid #000",
                                  borderBottom: "1px solid #000",
                                  padding: "10px 0",
                                  marginBottom: "10px"
                              }}>
                            <Typography.Text strong={true} style={{fontSize: "24px"}}>گردشکار</Typography.Text>
                        </Flex>
                        <Flex vertical={true} style={{padding: "10px 30px"}}>
                            <Flex vertical={true} style={{marginBottom: "15px"}}>
                                <Typography.Text strong={true} style={{fontSize: "20px"}}>سلام علیکم</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "15px"}}>
                                <Typography.Text strong={true}
                                                 style={{fontSize: "16px", textIndent: "40px", lineHeight: "30px"}}>احتراماً
                                    به استحضار میرساند:</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "10px"}}>
                                <Typography.Text style={{
                                    textIndent: "40px",
                                    textAlign: "justify",
                                    fontSize: "16px",
                                    lineHeight: "30px"
                                }}>
                                    ۱- به موجب تبصره1ماده 58 قانون خدمت وظیفه عمومی مصوب 1390 مجلس شورای اسلامی (مندرج
                                    در دستورالعمل طرح میثاق 6) مشمولین غایبی که به خدمت اعزام میشوند، درصورتی که در حین
                                    خدمت، حسن اخلاق و رفتار و جدیت در انجام وظیفه از خود نشان دهند، در مناطق جنگی،
                                    امنیتی و عملیاتی و...ابراز شجاعت و فداکاری نمایند، به طوری که مراتب مورد تأیید
                                    فرماندهان و مسئولین جایگاه های سرلشگری و یا همطراز باشد، تمام یا بخشی از مدت اضافه
                                    خدمت سنواتی آنان برابر ضوابط مورد بخشش قرارمیگیرد.
                                </Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "30px"}}>
                                <Typography.Text style={{
                                    textIndent: "40px",
                                    textAlign: "justify",
                                    fontSize: "16px",
                                    lineHeight: "30px"
                                }}>
                                    2- سوابق یادشده بالا مورد بررسی قرار گرفت و وضعیت خدمتی مشارالیه در طول مدت انجام
                                    وظیفه در این یگان شرح ذیل میباشد.
                                </Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "30px"}}>
                                <Table
                                    pagination={false}
                                    size={"small"}
                                    bordered={true}
                                    rowClassName={(record, index) => {
                                        if (index % 2 === 0) {
                                            return ("gray-background");
                                        } else {
                                            return ("");
                                        }
                                    }}
                                    showHeader={false}
                                    columns={[...Array(6)].map((v, index) => {
                                        return ({
                                            align: "center",

                                            dataIndex: index
                                        })
                                    })}
                                    style={{width: "100%"}}
                                    dataSource={[
                                        {
                                            0: "مدرک تحصیلی",
                                            1: "تاریخ معرفی به یگان",
                                            2: "مدت نهست",
                                            3: "مدت اضافه خدمت ناشی از نهست و انضباطی",
                                            4: "مدت انجام پاسداری",
                                            5: "خدمات برجسته در طول خدمت",
                                        },
                                        {
                                            0: soldier["education"],
                                            1: DateRenderer(soldier["entry_date"]),
                                            2: soldier["absence_discharge"],
                                            3: soldier["absence_punish"],
                                            4: input["guard_duration"] ? `${input["guard_duration"]} ماه` : "",
                                            5: input["info_duty"] ? input["info_duty"] : "",
                                        },
                                        {
                                            0: "تاریخ ترخیص ازخدمت با اضافه خدمت",
                                            1: "تاریخ ترخصی قانونی",
                                            2: "مدت کسر خدمت",
                                            3: "قسمت / محل خدمتی",
                                            4: "مدت اضافه خدمت سنواتی",
                                            5: "وضعیت تاهل",
                                        },
                                        {
                                            0: DateRenderer(soldier["legal_release_date"]),
                                            1: soldier["legal_date"],
                                            2: `${soldier["deficit"]}روز`,
                                            3: input["bad_term"] ? `${input["bad_term"]}` : "",
                                            4: `${soldier["additional_service_day"]} روز`,
                                            5: soldier["marriage"],
                                        },
                                    ]}
                                />
                            </Flex>
                            <Flex vertical={true}>
                                <Typography.Text style={{
                                    textIndent: "40px",
                                    textAlign: "justify",
                                    fontSize: "16px",
                                    lineHeight: "30px"
                                }}>
                                    {"3- با عنایت به مراتب معروضه و "}
                                    <Typography.Text strong={true}>جهت پیاده سازی فرامین و تدابیر فرماندهی معظم کل قوا)
                                        مدظله العالی </Typography.Text>
                                    {"در راستای تقویت انگیزه سربازان برای خدمت در سرپنجه ها و خوشـایند سازی خدمت سربازی و کادر سازی برای نظام جمهـوری اسلامـی ایران و افزایـش توانایی و کارایی و بهره وری آنان و همچنین به استنـاد تبصره 2 آییـن نامه مذکور و به موجـب ماده 122 آیین نامـه انضباطـی که فرماندهان و رئوسا و مدیران قسمتهـای گردان و تیپ ها می توانند از اختیارات یک مقام بالاتر استفاده نمایند، "}
                                </Typography.Text>
                            </Flex>

                        </Flex>
                    </Flex>
                    <Flex vertical={true}
                          style={{
                              border: "solid gray 2px",
                              borderRadius: "10px",
                              background: `url(${padafandLogoOpacityLow}) center center / contain no-repeat`,
                              // padding: "0 30px"
                          }}
                          className={"break-after A4-portrait"}
                    >
                        <Flex vertical={true} style={{padding: "10px 30px"}}>
                            <Flex vertical={true}>
                                <Typography.Text style={{
                                    fontSize: "18px",
                                    lineHeight: "30px",
                                    textDecoration: "underline"
                                }}>برابر {value.split("-")[0]} مصادیق اخلاق و رفتار طرح صدر الاشاره که اشعار می دارد
                                    :</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "30px"}}>
                                <Typography.Text style={{textAlign: "justify"}}>
                                    <Typography.Text style={{
                                        fontSize: "18px",
                                        lineHeight: "30px"
                                    }}>"{value.split("-")[1]}"</Typography.Text>
                                    {" "}
                                </Typography.Text>
                            </Flex>
                            <Flex>
                                <Typography.Text style={{
                                    fontSize: "18px",
                                    lineHeight: "30px",
                                    textAlign: "justify",
                                    marginBottom: "30px"
                                }}>
                                    - با عنایت به مطالب مطروحه و نظر به اینکه برابر با جدول پیش گفته، مشارالیه در طول خدمت دارای
                                    {" "}
                                    <Typography.Text style={{
                                        fontSize: "18px",
                                        lineHeight: "30px"
                                    }} underline={true}>{input["guard_duration"] ? `${input["guard_duration"]}` : ""} ماه سابقه {position} </Typography.Text>
                                    {" "}
                                    و
                                    {" "}
                                    <Typography.Text style={{
                                        fontSize: "18px",
                                        lineHeight: "30px"
                                    }} underline={true}>{soldier["absence_discharge"]} روز نهست</Typography.Text>
                                    {" "}
                                    و
                                    {" "}
                                    <Typography.Text style={{
                                        fontSize: "18px",
                                        lineHeight: "30px"
                                    }} underline={true}>{soldier["arrest"]} روز بازداشت</Typography.Text>
                                    {" "}
                                    میباشد و یگان خدمتی وی با توجه به نحوه ی انجام وظیفه در مدت خدمت در این فرماندهی در خواست بخشش
                                    {" "}
                                    <Typography.Text style={{
                                        fontSize: "18px",
                                        lineHeight: "30px"
                                    }} underline={true}>
                                        {input["remission_req"]}
                                        ماه از مدت اضافه خدمت سنواتی وی را دارد.
                                    </Typography.Text>
                                </Typography.Text>
                            </Flex>
                            <Flex>
                                <Typography.Text style={{
                                    fontSize: "18px",
                                    lineHeight: "30px"
                                }}>پیشنهاد میگردد:</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "30px"}}>
                                <Typography.Text style={{
                                    fontSize: "18px",
                                    lineHeight: "30px"
                                }}>- برابر صلاح دید، در خصوص میزان بخشش اضافه خدمت سنواتی یاد شده بالا اوامر مقتضی صادر گردد.</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{marginBottom: "30px"}}>
                                <Typography.Text style={{
                                    textIndent: "40px",
                                    textAlign: "justify",
                                    fontSize: "18px",
                                    lineHeight: "30px"
                                }}>
                                    4) هرگونه اقدام منوط به امرعالیست.
                                </Typography.Text>
                            </Flex>
                            <Flex style={{justifyContent: "flex-end", marginBottom: "40px"}}>
                                <Sign.Single defaultSign={"مدیر نیروی انسانی ف پش نپاجا"}/>
                            </Flex>
                            <Flex vertical={true} style={{height: "170px", marginTop: "30px", backgroundColor: "#fff"}}>
                                <Typography.Text style={{
                                    fontSize: "18px",
                                    padding: "15px",
                                    border: "1px solid #000",
                                    borderRadius: "10px",
                                    height: "350px"
                                }}>اوامر فرماندهی محترم
                                    پشتیبانی مرکز نیروی پدافند هوایی آجا:</Typography.Text>
                            </Flex>
                            <Flex vertical={true} style={{height: "170px", marginTop: "50px", backgroundColor: "#fff"}}>
                                <Typography.Text style={{
                                    fontSize: "18px",
                                    padding: "15px",
                                    border: "1px solid #000",
                                    borderRadius: "10px",
                                    height: "350px"
                                }}>نظریه جانشین محترم فرماندهی پشتیبانی مرکز نیروی پدافند هوایی آجا:</Typography.Text>
                            </Flex>
                        </Flex>
                    </Flex>

                </Flex>
            </ConfigProvider>
        </div>
    );
}

export default Remission;