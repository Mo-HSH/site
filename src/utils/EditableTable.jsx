import {Button, Checkbox, Flex, Form, Input, InputNumber, Popconfirm, Select, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {CheckCircleTwoTone, CloseCircleTwoTone, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import '../NoDisableCheckBox.css';


function EditableTable({
                           columns,
                           dataSource,
                           createForm,
                           formField,
                           onDelete,
                           onEdit,
                           style,
                           pagination,
                           bordered,
                           refresher
                       }) {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [mergedColumns, setMergedColumns] = useState([]);

    useEffect(() => {
        setMergedColumns((_) => {
            let temp = columns.map((column) => {
                if (column.key === "options") {
                    return column;
                }
                return {
                    ...column,
                    onCell: (record) => ({
                        record,
                        inputType: column.inputType,
                        dataIndex: column.dataIndex,
                        title: column.title,
                        validator: column.validator,
                        required: column.required,
                        editing: isEditing(record),
                        selectOption: column.selectOption
                    }),
                };
            });
            temp.push({
                title: "",
                key: "options",
                align: "center",
                render: (_, record) => {
                    const editable = isEditing(record);

                    return editable ? (
                        <Flex gap={"middle"} justify={"center"} align={"center"}>
                            <Popconfirm title="برای ذخیره مطمئن هستید؟"
                                        icon={<CheckCircleTwoTone twoToneColor="#4096ff"/>}
                                        onConfirm={() => {
                                            onEdit(record.key, form).then((result) => {
                                                if (result) {
                                                    cancel();
                                                }
                                            }).catch();
                                        }}>
                                <Button type="primary">ذخیره</Button>
                            </Popconfirm>
                            <Button type="primary" danger ghost onClick={cancel}>لغو</Button>
                        </Flex>
                    ) : (
                        <Flex gap={"middle"} justify={"center"} align={"center"}>
                            {
                                onEdit !== undefined
                                    ?
                                    <Tooltip title={"ویرایش"}>
                                        <Button type="primary" icon={<EditOutlined/>} onClick={() => edit(record)}/>
                                    </Tooltip>
                                    :
                                    null
                            }

                            <Popconfirm title="برای حذف مطمئن هستید؟"
                                        icon={<CloseCircleTwoTone twoToneColor="#ff4d4f"/>}
                                        onConfirm={() => onDelete(record.key)}>
                                <Tooltip title={"حذف"}>
                                    <Button type="primary" danger ghost icon={<DeleteOutlined/>}/>
                                </Tooltip>
                            </Popconfirm>
                        </Flex>
                    );
                }
            });

            return temp;
        });

    }, [editingKey, refresher]);

    const cancel = () => {
        setEditingKey('');
    };

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...formField,
            ...record,
        });
        setEditingKey(record.key);
    };

    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              inputType,
                              record,
                              index,
                              children,
                              validator,
                              required,
                              selectOption,
                              ...restProps
                          }) => {
        const inputNode = inputType === 'number' ? <InputNumber min={0}/> : inputType === 'bool' ?
            <Checkbox/> : inputType === 'select' ? <Select options={selectOption}/> : <Input/>;
        const isRequired = required !== false;
        const rules = validator === undefined ? [{
            required: true,
            required: isRequired,
            message: `لطفا ${title} را وارد کنید!`,
        }] : [{validator: validator, required: isRequired}];
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={rules}
                        valuePropName={inputType === "bool" ? "checked" : "value"}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    return (
        <Form form={form} component={false}>
            <Table
                style={style}
                pagination={pagination}
                bordered={bordered}
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                dataSource={dataSource}
                columns={mergedColumns}
                footer={createForm}
            />
        </Form>
    );
}

export default EditableTable;