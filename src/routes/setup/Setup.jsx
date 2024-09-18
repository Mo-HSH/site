import padafandLogo from "../../assets/img/Padafand_Logo.svg";
import {Flex, Image, Input, Modal, Space, Typography} from 'antd';
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {useNavigate} from "react-router-dom";

function Setup() {
    const {Text} = Typography;

    const [text, setText] = useState("سلام 123");
    const [newIp, setNewIp] = useState("");
    const [reload, setReload] = useState(false);
    const [isApiUrlModalOpen, setApiUrlModalOpen] = useState(false);
    const [logoAnim, setLogoAnim] = useState('pulse 4s infinite')

    const navigate = useNavigate();

    function reloadPage() {
        setReload(!reload);
    }

    function onCancelModal() {
        setApiUrlModalOpen(false);
        reloadPage();
    }

    function onOkModal() {
        invoke("set_api_url", {url: newIp}).then(() => {
            setApiUrlModalOpen(false);
            reloadPage();
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        setText("در حال بررسی آدرس سرور");

        invoke("get_api_url").then((conf_api_url) => {
            setText("در حال بررسی اتصال به سرور");


            invoke("check_api_connection").then((result) => {
                if (result) {

                    invoke("check_any_user_exist").then((res) => {
                        setText("");
                        setLogoAnim('fade 3s');
                        setTimeout(()=>{
                            if (res) {
                                navigate("/login");
                            } else {
                                navigate("/register");
                            }
                        }, 1500);


                    }).catch(() => {
                        setText("خطا در دریافت تعداد کاربران");
                        setTimeout(() => {
                            reloadPage();
                        }, 3000);
                    });


                } else {
                    setNewIp(conf_api_url);
                    setText("خطا در اتصال به سرور");
                    setApiUrlModalOpen(true);
                }
            }).catch((err) => {
                setText("خطا");
                console.error(err);
            })


        }).catch((err) => {
            console.error(err);
            setApiUrlModalOpen(true);
        });
    }, [reload]);

    return (
        <Flex justify={"center"} align={"center"} vertical gap={"large"}>
            <Image
                src={padafandLogo}
                preview={false}
                alt="padafdan logo"
                width="30%"
                style={{
                    animation: logoAnim,
                }}
            />
            <Flex justify={"center"} align={"center"} gap={"small"}>
                <Space>
                    <Text>
                        {text}
                    </Text>
                </Space>
            </Flex>

            <Modal title={"آدرس سرور"} open={isApiUrlModalOpen} onCancel={() => onCancelModal()}
                   onOk={() => onOkModal()}>
                <Input value={newIp} onChange={e => setNewIp(e.target.value)}/>
            </Modal>

        </Flex>
    );
}

export default Setup;