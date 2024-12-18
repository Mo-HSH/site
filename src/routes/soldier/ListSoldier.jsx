import {Button, Checkbox, Divider, Drawer, Flex, Form, notification, Popover, Select, Table, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import StringFilterCard from "../../components/filterCards/StringFilterCard.jsx";
import DateFilterCard from "../../components/filterCards/DateFilterCard.jsx";
import SelectFilterCard from "../../components/filterCards/SelectFilterCard.jsx";
import axios from "axios";
import {getApiUrl} from "../../utils/Config.js";

function ListSoldier() {
    const [filter, setFilter] = useState({});
    const [projection, setProjection] = useState({});
    const [columns, setColumns] = useState([]);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [openSettingDrawer, setOpenSettingDrawer] = useState(false);
    const [data, setData] = useState([]);

    const [filterForm, projectionForm] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();


    useEffect(() => {
        axios.post(getApiUrl("soldier/list"), {
            "filter": filter,
            "projection": projection
        }, {withCredentials: true})
            .then((response) => {
                let res = response.data;
                setData(res);
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err.response.data
                });
            });
    }, [filter, projection]);

    function columnsChange(checkedValues) {
        setColumns(checkedValues);
    }

    const options = [
        {
          label: "ردیف",
          value: {
              title: "ردیف",
              render: (text, record, index) => (
                  index + 1
              )
          }
        },
        {
            label: "نام",
            value: {
                title: "نام",
                dataIndex: "first_name",
            },
        },
        {
            label: "نشان",
            value: {
                title: "نشان",
                dataIndex: "last_name",
            },
        },
        {
            label: "کد ملی",
            value: {
                title: "کد ملی",
                dataIndex: "national_code",
            },
        },
        {
            label: "تاریخ اعزام",
            value: 3,
        },
        {
            label: "درجه",
            value: 4,
        },
        {
            label: "مدرک تحصیلی",
            value: 5,
        },
        {
            label: "تاریخ تولد",
            value: 6,
        },
        {
            label: "نام پدر",
            value: 7,
        },
        {
            label: "استان",
            value: 8,
        },
        {
            label: "شهر",
            value: 9,
        },
        {
            label: "یگان",
            value: 10,
        },
        {
            label: "قسمت",
            value: 11,
        },
        {
            label: "محل تولد",
            value: 12,
        },
        {
            label: "رشته تحصیلی",
            value: 13,
        },
        {
            label: "تاریخ ترخیص قانونی",
            value: 14,
        },
        {
            label: "تاریخ ترخیص کل",
            value: 15,
        },
        {
            label: "بومی/غیر بومی",
            value: 16,
        },
        {
            label: "دین",
            value: 17,
        },
        {
            label: "کسری",
            value: 18,
        },
        {
            label: "تاریخ ورود",
            value: 19,
        },
        {
            label: "سلامت روان",
            value: 20,
        },
        {
            label: "گروه خونی",
            value: 21,
        },
        {
            label: "رنگ چشم",
            value: 22,
        },
        {
            label: "قد",
            value: 23,
        },
    ]

    return (
        <Flex vertical={true} style={{width: "100%"}}>
            {contextHolder}
            <Flex align={"center"} justify={"flex-end"} style={{borderRadius: 5, padding: 10, background: "#d5d5d5", zIndex: 10, transform: "translateY(15%)", position: "absolute"}}>
                <Flex gap={"small"} align={"center"}>
                    <Button type={"primary"} onClick={()=>{setOpenFilterDrawer(true)}}>فیلتر</Button>
                    <Button type={"primary"} onClick={()=>{setOpenSettingDrawer(true)}}>پیکربندی خروجی</Button>
                    <Button type={"primary"}>دانلود</Button>
                    <Button type={"default"}>نتیجه جستجو: {data.length} نفر</Button>
                </Flex>
            </Flex>

            <Drawer title={"فیلتر"} placement={"right"} size={"large"} open={openFilterDrawer} onClose={() => setOpenFilterDrawer(false)}>
            {/*    filter    */}

            </Drawer>
            <Drawer title={"تنظیمات"} placement={"left"} open={openSettingDrawer} onClose={() => setOpenSettingDrawer(false)}>
                <Checkbox.Group options={options} onChange={columnsChange}>

                </Checkbox.Group>
            </Drawer>

            <Flex justify={"center"}>
                <Table
                    pagination={{
                        position: ["topLeft"],
                    }}
                    dataSource={data}
                    columns={columns}
                    style={{width: "100%"}}
                />
            </Flex>
        </Flex>
    );
}

export default ListSoldier;