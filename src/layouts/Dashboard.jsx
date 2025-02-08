import {Outlet, useNavigate} from "react-router-dom";
import {Button, Divider, Flex, Image, Layout, Menu, Space, Typography} from "antd";
import {useState} from "react";
import {
    AuditOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined, FileTextOutlined, HomeOutlined, SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import padafandLogo from "../assets/img/Padafand_Logo.svg";
import axios from "axios";
import {getApiUrl} from "../utils/Config.js";


function Dashboard() {

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const navigate = useNavigate();

    function onSelectMenu(e) {
        navigate(e.key);
    }

    const items = [
        getItem('خانه', '/', <HomeOutlined/>),
        getItem('سرباز', 'soldier', <UserOutlined/>, [
            getItem('پذیرش سرباز', '/add-soldier'),
            getItem('جستجو سرباز', '/search-soldier'),
        ]),
        getItem('اسناد', 'document', <AuditOutlined />, [
            getItem('ثبتی ها', '/leave'),
            getItem('تسویه ها', '/releases'),
            getItem('فرم الف', '/alef_form'),
        ]),
        getItem('گزارش', 'report', <FileTextOutlined />, [
            getItem('گزارش گیری', '/list-soldier'),
            getItem('نهست', '/absence_report'),
            getItem('کان لم یکن', '/absence_ignored_report'),
            getItem('گروه خدمتی', '/duty_group_report'),
            getItem('ماده 60', '/md_60_report'),
            getItem('فرار', '/run_report'),
            getItem('مراجعت', '/return_report'),
            getItem('ترخیص', '/release_report'),
            getItem('اضافه سنواتی', '/init_additional_service_report'),
            getItem('سربازان جدید الورود', '/new_soldier_report'),
            getItem('آمار پایه خدمتی', '/stats_report'),
        ]),
        getItem('ابزار بایگانی', 'archiving tools', <FileTextOutlined />, [
            getItem('لیبل پرونده', '/folder_label'),
            // getItem('نهست', '/absence_report'),
        ]),
        localStorage.getItem("user_access") === null ? null : localStorage.getItem("user_access") === undefined ? null : localStorage.getItem("user_access").length === 0 ? null :
            getItem('تنظیمات', 'setting', <SettingOutlined />, [
                getItem('گزینه ها', '/edit-options'),
                getItem('محاسباتی', '/edit-calculative'),
                getItem('شغل سازمانی', '/edit-organization-job'),
                getItem('آلارم', '/edit-notification'),
                getItem('کاربران', '/user'),
            ]),
    ];

    function Logout() {
        axios.post(getApiUrl("user/logout"), {}, {withCredentials: true}).then(() => {
            location.reload();
        }).catch()
    }

    return (
        <Layout>
            <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
                <Flex align={"center"} justify={collapsed ? "center" : "right"} vertical={false} gap={"small"} style={{height:"93px", borderBottom: "solid 1px #DBDBDB"}}>
                    {!collapsed &&
                        <>
                            <Typography.Text/>
                            <Typography.Text/>
                            <Image src={padafandLogo} style={{width:"50px", position: "static"}} preview={false} alt="padafdan logo"/>
                            <Flex vertical justify={"center"}>
                                <Typography.Text style={{display: "block", overflow: "hidden", whiteSpace: "nowrap"}}>ارتش جمهوری</Typography.Text>
                                <Typography.Text style={{display: "block", overflow: "hidden", whiteSpace: "nowrap"}}>اسلامی ایران</Typography.Text>
                            </Flex></>}
                    <Button type="Typography.Text" icon={collapsed ? <DoubleLeftOutlined/> : <DoubleRightOutlined/>}
                            onClick={toggleCollapsed}/>
                </Flex>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                    onSelect={onSelectMenu}
                />
            </Layout.Sider>
            <Layout>
                <Layout.Header style={{
                    height: "93px"
                }}>

                    <Flex align={"center"} justify={"space-between"} gap={"middle"} style={{
                        height: "100%", width: "100%"
                    }}>
                        <Typography.Text style={{
                            textAlign: "right"
                        }}>
                            مدیریت نیروی انسانی: سامانه اطلاعات کارگزینی کارکنان وظیفه
                        </Typography.Text>
                        <Flex align={"center"} gap={"middle"}>
                        <Typography.Text>{localStorage.getItem("user_rank")} {localStorage.getItem("user_first_name")} {localStorage.getItem("user_last_name")}</Typography.Text>
                        <Button danger={true} type={"primary"} onClick={()=>Logout()}>خروج</Button>
                        </Flex>
                    </Flex>
                </Layout.Header>

                <Layout.Content style={{padding:'30px', overflowY:'auto'}} id={"Content"}>
                    <Outlet />
                </Layout.Content>
            </Layout>

        </Layout>
    );
}


export default Dashboard;