
import {useCallback, useEffect, useRef} from "react";
import FolderLabel from "../shared/FolderLabel.jsx";
import {Button, Flex} from "antd";
import {useReactToPrint} from "react-to-print";

function SoldierFolderLabel({setPrintTitle, soldierKey}) {
    const printComponent = useRef(null);

    useEffect(()=>{
        setPrintTitle("لیبل پرونده");

    }, [soldierKey])

    const reactToPrintContent = useCallback(() => {
        return printComponent.current;
    }, [printComponent.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        removeAfterPrint: true
    });

    return(
        <div>
            <Flex vertical={false} gap={"middle"} align={"center"} justify={"center"}
                  style={{width: "100%", zIndex: 2, marginBottom: "20px"}}>
                <Button type={"primary"} onClick={handlePrint}>پرینت</Button>
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
                      // style={{
                      //     border: "solid gray 2px",
                      //     borderRadius: "10px",
                      // }}
                      className={"break-after A5-landscape"}
                >
                    <FolderLabel soldierKey={soldierKey}/>
                </Flex>

            </Flex>
        </div>
    );
}

export default SoldierFolderLabel;