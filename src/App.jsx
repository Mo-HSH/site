import {Route, Routes} from "react-router-dom";
import {ConfigProvider} from "antd";
import faIR from 'antd/es/locale/fa_IR';
import Home from "./routes/Home.jsx";
import Dashboard from "./layouts/Dashboard.jsx";
import {useNavigate} from "react-router-dom";

import "./App.css";
import {useEffect} from "react";
import moment from "jalali-moment";
import Login from "./routes/setup/Login.jsx";
import axios from "axios";
import {getApiUrl} from "./utils/Config.js";
// import Register from "./routes/setup/Register.jsx";
import AddSoldier from "./routes/soldier/AddSoldier.jsx";
import EditOptions from "./routes/settings/EditOptions.jsx";
import ListTwoSoldier from "./routes/soldier/ListTwoSoldier.jsx";
import EditCalculative from "./routes/settings/EditCalculative.jsx";
import SearchSoldier from "./routes/soldier/SearchSoldier.jsx";
import EditSoldier from "./routes/soldier/EditSoldier.jsx";
import LeaveAbsenceEscapeDeficitRun from "./routes/document/LeaveAbsenceEscapeDeficitRun.jsx";
// import Test from "./routes/Test.jsx";
import SoldierRelease from "./routes/soldier/SoldierRelease.jsx";
import Releases from "./routes/document/Releases.jsx";
import AlefFormNumber from "./routes/document/AlefFormNumber.jsx";
import AbsenceReport from "./routes/reports/AbsenceReport.jsx";
import AbsenceIgnoredReport from "./routes/reports/AbsenceIgnoredReport.jsx";
import DutyGroupReport from "./routes/reports/DutyGroupReport.jsx";
import MD60Report from "./routes/reports/MD60Report.jsx";
import RunReport from "./routes/reports/RunReport.jsx";
import ReturnReport from "./routes/reports/ReturnReport.jsx";
import ReleaseReport from "./routes/reports/ReleaseReport.jsx";
import InitAdditionalServiceReport from "./routes/reports/InitAdditionalServiceReport.jsx";
import EditOrganizationJob from "./routes/settings/EditOrganizationJob.jsx";
import User from "./routes/settings/User.jsx";
import ListSoldier from "./routes/soldier/ListSoldier.jsx";
import StatsReport from "./routes/reports/StatsReport.jsx";
import NewSoldierReport from "./routes/reports/NewSoldierReport.jsx";
import FolderLabel from "./routes/Print/archive/FolderLabel.jsx";
import EditNotification from "./routes/settings/EditNotification.jsx";
import QuantityReport from "./routes/reports/QuantityReport.jsx";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        moment.locale("fa");

        // check user is logged in
        // axios.post(GetUrl("user/login"), {username: "admin", password: "admin"})
        //     .then(function (response) {
        //         console.log(response);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        axios.get(getApiUrl("user/account"), {withCredentials: true})
            .then((response) => {
                console.log(response);
            })
            .catch(()=>{
                navigate("/login");
            })
    }, []);

    return (
        <ConfigProvider
            direction="rtl"
            locale={faIR}
            theme={{
                token: {
                    fontFamily: "Samim"
                },
                components: {
                    Layout: {
                        siderBg: "#FAFBFC",
                        bodyBg: "#FAFBFC",
                    },
                    Menu: {
                        itemBg: "#ffffff",
                        itemSelectedBg: "#057F03",
                        itemColor: "#787486",
                        itemHoverBg: "rgba(122, 197, 85, 0.3)",
                    },
                    Divider: {
                        colorSplit: "#DBDBDB",
                    },
                },
            }}
        >
            <Routes>
                <Route path="/login" element={<Login/>}/>
                {/*<Route path="/register" element={<Register/>}/>*/}

                    <Route element={<Dashboard/>}>
                    <Route path="/" element={<Home/>}/>
                    {/*<Route path="/test" element={<Test/>}/>*/}

                    <Route path="/add-soldier" element={<AddSoldier/>}/>
                    <Route path="/list-soldier" element={<ListSoldier/>}/>
                    <Route path="/search-soldier" element={<SearchSoldier/>}/>
                    <Route path="/edit-soldier/:key" element={<EditSoldier/>}/>
                    <Route path="/soldier-release/:key" element={<SoldierRelease/>}/>

                    <Route path="/leave" element={<LeaveAbsenceEscapeDeficitRun/>}/>
                    <Route path="/releases" element={<Releases/>}/>
                    <Route path="/alef_form" element={<AlefFormNumber/>}/>

                    <Route path="/absence_report" element={<AbsenceReport />}/>
                    <Route path="/absence_ignored_report" element={<AbsenceIgnoredReport />}/>
                    <Route path="/duty_group_report" element={<DutyGroupReport />}/>
                    <Route path="/md_60_report" element={<MD60Report />}/>
                    <Route path="/run_report" element={<RunReport />}/>
                    <Route path="/return_report" element={<ReturnReport />}/>
                    <Route path="/release_report" element={<ReleaseReport />}/>
                    <Route path="/stats_report" element={<StatsReport />}/>
                    <Route path="/quantity_report" element={<QuantityReport />} />
                    <Route path="/new_soldier_report" element={<NewSoldierReport />}/>
                    <Route path="/init_additional_service_report" element={<InitAdditionalServiceReport />}/>

                    <Route path="/folder_label" element={<FolderLabel/>}/>

                    <Route path="/edit-options" element={<EditOptions/>}/>
                    <Route path="/edit-calculative" element={<EditCalculative/>}/>
                    <Route path="/edit-organization-job" element={<EditOrganizationJob/>}/>
                    <Route path="/edit-notification" element={<EditNotification/>}/>
                    <Route path="/user" element={<User/>}/>
                </Route>
            </Routes>
        </ConfigProvider>
    );
}

export default App;
