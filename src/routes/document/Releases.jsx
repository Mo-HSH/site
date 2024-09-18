import SearchSelect from "../../layouts/SearchSelect.jsx";
import {useEffect, useState} from "react";
import {Form, Input, Spin} from "antd";
import SoldierRelease from "../soldier/SoldierRelease.jsx";
import {
    dateValidator,
    justNumericValidator,
    justStringValidator,
    nationalCodeValidator
} from "../../utils/Validates.js";
import {GetQueryDate} from "../../utils/Calculative.js";
import {DateRenderer} from "../../utils/TableRenderer.jsx";

function Releases() {
    const [targetSoldier, setTargetSoldier] = useState({});
    const [key, setKey] = useState("");

    return (
        <SearchSelect
            showInitiallyAll={true}
            setSoldierOid={setKey}
            setSelectedSoldierState={setTargetSoldier}
            selectedSoldierView={<SoldierRelease oid={key}/>}
            searchProject={{
                "first_name": 1,
                "last_name": 1,
                "national_code": 1,
                "deployment_date": 1,
                "military_rank": 1,
                "father_name": 1,
                "unit": 1,
                "section": 1,
                "release": 1,
                "release_progress": 1
            }}
            additionalFilter={{
                "release": {
                    "$ne": null
                }
            }}
            overrideFilter={{
                "release_date": (value) => {
                    return ["release.release_date", {
                        "$eq": GetQueryDate(value)
                    }];
                },
                "alef_form_number": (value) => {
                    return ["release_progress.alef_form_number", {
                        "$eq": value
                    }];
                }
            }}
            searchColumns={[
                {
                    title: "نام",
                    dataIndex: "first_name",
                    key: "first_name",
                    align: "center",
                },
                {
                    title: "نشان",
                    dataIndex: "last_name",
                    key: "last_name",
                    align: "center",
                },
                {
                    title: "کد ملی",
                    dataIndex: "national_code",
                    key: "national_code",
                    align: "center",
                },
                {
                    title: "تاریخ اعزام",
                    dataIndex: "deployment_date",
                    key: "deployment_date",
                    render: DateRenderer,
                    align: "center",
                },
                {
                    title: "درجه",
                    dataIndex: "military_rank",
                    key: "military_rank",
                    align: "center",
                },
                {
                    title: "نام پدر",
                    dataIndex: "father_name",
                    key: "father_name",
                    align: "center",
                },
                {
                    title: "یگان",
                    dataIndex: "unit",
                    key: "unit",
                    align: "center",
                },
                {
                    title: "قسمت",
                    dataIndex: "section",
                    key: "section",
                    align: "center",
                },
                {
                    title: "تاریخ ترخیص",
                    dataIndex: "release",
                    key: "release_date",
                    render: (v)=> DateRenderer(v["release_date"]),
                    align: "center",
                },
                {
                    title: "شماره فرم الف",
                    dataIndex: "release_progress",
                    key: "alef_form_number",
                    render: (v)=> v["alef_form_number"],
                    align: "center",
                },
            ]}
            searchFormFields={
                <>
                    <Form.Item
                        label={"نام"}
                        name={"first_name"}
                        rules={[{
                            required: false,
                            validator: justStringValidator
                        }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={"نشان"}
                        name={"last_name"}
                        rules={[{
                            required: false,
                            validator: justStringValidator
                        }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={"نام پدر"}
                        name={"father_name"}
                        rules={[{
                            required: false,
                            validator: justStringValidator
                        }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={"کد ملی"}
                        name={"national_code"}
                        rules={[{
                            required: false,
                            validator: justNumericValidator
                        }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={"تاریخ ترخیص"}
                        name={"release_date"}
                        rules={[{
                            required: false,
                            validator: dateValidator
                        }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={"فرم الف"}
                        name={"alef_form_number"}
                        rules={[{
                            required: false,
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                </>
            }
        />
    );
}

export default Releases;