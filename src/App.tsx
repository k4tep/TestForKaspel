import { useState } from 'react';
import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Input, DatePicker, Space } from 'antd';
import './App.css';
import dayjs from 'dayjs';

interface RowData {
    id: number;
    name: string;
    date: string;
    value: number;
}

export function App() {
    const [toggleModal, setToggleModal] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; date?: string; value?: string }>({});
    const [data, setData] = useState<RowData[]>([
        { id: 1, name: 'Иван', date: '2025-08-19', value: 42 },
        { id: 2, name: 'Мария', date: '2025-08-18', value: 73 },
        { id: 3, name: 'Анна', date: '2025-08-15', value: 15 },
    ]);
    const [newData, setNewData] = useState<RowData>({
        id: data.length + 1,
        name: '',
        date: new Date().toISOString().split('T')[0],
        value: 0,
    });

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!newData.name.trim()) {
            newErrors.name = 'Имя обязательно';
        }
        if (!newData.date || isNaN(Date.parse(newData.date))) {
            newErrors.date = 'Некорректная дата';
        }
        if (newData.value <= 0) {
            newErrors.value = 'Значение должно быть больше 0';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            sorter: (a: RowData, b: RowData) => a.name.localeCompare(b.name),
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            sorter: (a: RowData, b: RowData) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: 'Значение',
            dataIndex: 'value',
            sorter: (a: RowData, b: RowData) => a.value - b.value,
        },
        {
            title: 'Действия',
            render: (_: any, record: RowData) => (
                <>
                    <Button danger onClick={() => deleteRow(record.id)} style={{ marginRight: 16 }}>
                        <DeleteOutlined />
                    </Button>
                    <Button
                        onClick={() => {
                            setToggleModal(true);
                            setNewData(record);
                        }}
                    >
                        <EditOutlined />
                    </Button>
                </>
            ),
        },
    ];

    const deleteRow = (id: number) => {
        setData(data.filter((row) => row.id !== id));
    };

    const addRow = () => {
        setData([...data, newData]);
    };

    const editRow = () => {
        setData((prevData) =>
            prevData.map((item) => (item.id === newData.id ? { ...item, ...newData } : item))
        );
    };

    return (
        <>
            <Modal
                open={toggleModal}
                onOk={() => {
                    if (!validate()) return;
                    data.find((e) => e.id === newData.id) ? editRow() : addRow();

                    setNewData({
                        id: data.length + 1,
                        name: '',
                        date: new Date().toISOString().split('T')[0],
                        value: 0,
                    });
                    setToggleModal(false);
                }}
                onCancel={() => {
                    setNewData({
                        id: data.length + 1,
                        name: '',
                        date: new Date().toISOString().split('T')[0],
                        value: 0,
                    });
                    setToggleModal(false);
                }}
                centered
                title="Введите информацию"
            >
                <div>
                    <Input
                        placeholder="Имя"
                        status={errors.name ? 'error' : ''}
                        value={newData.name}
                        onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                        allowClear
                        style={{ marginBottom: 16 }}
                    />

                    <Space direction="vertical">
                        <DatePicker
                            status={errors.date ? 'error' : ''}
                            value={newData ? dayjs(newData.date, 'YYYY-MM-DD') : null}
                            onChange={(_value, dateString) =>
                                setNewData({ ...newData, date: dateString as string })
                            }
                            format="YYYY-MM-DD"
                        />
                    </Space>

                    <Input
                        placeholder="Значение"
                        status={errors.value ? 'error' : ''}
                        type="number"
                        min={0}
                        value={newData.value}
                        onChange={(e) => setNewData({ ...newData, value: Number(e.target.value) })}
                    />
                </div>
            </Modal>
            <div className="table-container">
                <Button
                    type="primary"
                    onClick={() => setToggleModal(true)}
                    style={{ marginBottom: 16 }}
                >
                    <UserAddOutlined />
                </Button>
                <Table columns={columns} dataSource={data} />
            </div>
        </>
    );
}
export default App;
