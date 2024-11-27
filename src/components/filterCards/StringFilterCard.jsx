import {Button, Card, Form, Input, Radio} from "antd";
import {useEffect} from "react";

function StringFilterCard({label, query, setQuery, removeFilter, index, width, height}) {

    function onFinish(e) {
        switch (e.search_type) {
            case "exact":
                setQuery((prev)=>{
                    let temp = [...prev];
                    let q = {};
                    q[query] = e.value;
                    temp[index] = q;
                    return temp;
                });
                break;
            case "start":
                setQuery((prev)=>{
                    let temp = [...prev];
                    let q = {};
                    q[query] = {"$regex": `^${e.value}`};
                    temp[index] = q;
                    return temp;
                });
                break;
            case "end":
                setQuery((prev)=>{
                    let temp = [...prev];
                    let q = {};
                    q[query] = {"$regex": `.*${e.value}$`};
                    temp[index] = q;
                    return temp;
                });
                break;
            default:
                setQuery((prev)=>{
                    let temp = [...prev];
                    let q = {};
                    q[query] = {"$regex": `.*${e.value}.*`};
                    temp[index] = q;
                    return temp;
                });
                break;
        }
    }

    function onRemove() {
        setQuery((prev)=>{
            let temp = [...prev];
            temp.splice(index, 1);
            return temp;
        });
        removeFilter(index);
    }

    useEffect(() => {
        setQuery((prev)=>{
            let temp = [...prev];
            temp[index] = {};
            return temp;
        });
    }, []);

    return (
        <Card style={{width: width, height: height}}>
            <Form
                size="middle"
                onFinish={onFinish}
            >
                <Form.Item
                    label={label}
                    name={"value"}
                    rules={[{
                        required: true
                    }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name={"search_type"}
                    initialValue={"middle"}
                >
                    <Radio.Group buttonStyle="solid" block={true}>
                        <Radio.Button value="exact">برابر</Radio.Button>
                        <Radio.Button value="start">شروع با</Radio.Button>
                        <Radio.Button value="middle">بین</Radio.Button>
                        <Radio.Button value="end">اتمام با</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Button type={"primary"} block={true} htmlType={"submit"}>فیلتر</Button>
                </Form.Item>
                <Form.Item>
                    <Button type={"primary"} danger={true} block={true} onClick={()=> onRemove()}>حذف فیلتر</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default StringFilterCard;