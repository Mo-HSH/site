import {useEffect, useState} from "react";
import {Col, Flex, notification, Row, Typography} from "antd";
import {DateRenderer} from "../../../utils/TableRenderer.jsx";
import axios from "axios";
import {getApiUrl} from "../../../utils/Config.js";

function FolderLabelComponent({soldierKey}) {
    const [api, contextHolder] = notification.useNotification();
    const [soldier, setSoldier] = useState({});

    useEffect(()=>{
        axios.post(getApiUrl("soldier/list"),
            {
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
                        "first_name": 1,
                        "last_name": 1,
                        "military_rank": 1,
                        "national_code": 1,
                        "father_name": 1,
                        "deployment_date": 1,
                        "folder_number": 1,
                    }
            },
            {withCredentials: true}
        )
            .then((response) => {
                let res = response.data;
                if (res.length === 0) {
                    api["error"]({
                        message: "خطا", description: "مشکلی در سرور پیش آمده."
                    });
                } else {
                    setSoldier({
                        ...res[0],
                        "deployment_date": DateRenderer(res[0]["deployment_date"]),
                    });
                }
            })
            .catch((err) => {
                api["error"]({
                    message: "خطا", description: err
                });
            });
    }, [soldierKey])


    return(
        <Flex style={{minWidth: "280px", height: "175px", border: "solid black 2px"}}>
            {contextHolder}
            <Row style={{width: "100%", height: "100%"}}>
                <Col span={4} style={{border: "solid black 1px"}}>
                    <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                        <Typography.Text style={{writingMode: "vertical-lr", textOrientation: "mixed", fontSize: "26px"}}>{soldier["folder_number"]}</Typography.Text>
                    </Flex>
                </Col>
                <Col span={20} style={{width: "100%", border: "solid black 1px"}}>
                    <Row style={{width: "100%", height: "25%"}}>
                        <Col col={24} style={{width: "100%", borderBottom: "solid black 1px"}}>
                            <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                                <Typography.Text>
                                    {soldier["military_rank"]}
                                    &nbsp;
                                    {soldier["first_name"]}
                                    &nbsp;
                                    {soldier["last_name"]}
                                </Typography.Text>
                            </Flex>
                        </Col>
                    </Row>
                    <Row style={{width: "100%", height: "25%"}}>
                        <Col span={8} style={{border: "solid black", borderWidth: "0 0 1px 1px"}}>
                            <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                                <Typography.Text>کد ملی</Typography.Text>
                            </Flex>
                        </Col>
                        <Col span={16} style={{border: "solid black", borderWidth: "0 0 1px 0"}}>
                            <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                                <Typography.Text>{soldier["national_code"]}</Typography.Text>
                            </Flex>
                        </Col>
                    </Row>
                    <Row style={{width: "100%", height: "25%"}}>
                        <Col span={8} style={{border: "solid black", borderWidth: "0 0 1px 1px"}}>
                            <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                                <Typography.Text>نام پدر</Typography.Text>
                            </Flex>
                        </Col>
                        <Col span={16} style={{border: "solid black", borderWidth: "0 0 1px 0"}}>
                            <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                                <Typography.Text>{soldier["father_name"]}</Typography.Text>
                            </Flex>
                        </Col>
                    </Row>
                    <Row style={{width: "100%", height: "25%"}}>
                        <Col span={8} style={{border: "solid black", borderWidth: "0 0 0 1px"}}>
                            <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                                <Typography.Text>تاریخ اعزام</Typography.Text>
                            </Flex>
                        </Col>
                        <Col span={16} style={{border: "solid black", borderWidth: "0 0 0 0"}}>
                            <Flex style={{width: "100%", height: "100%"}} justify={"center"} align={"center"}>
                                <Typography.Text>{soldier["deployment_date"]}</Typography.Text>
                            </Flex>
                        </Col>
                    </Row>

                </Col>
            </Row>
        </Flex>
    );
}

export default FolderLabelComponent;