import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Card, Row, Col, DatePicker, Select, Button, Table, Spin } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { supabaseAnon } from '../../supabaseConfig';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Reportes = () => {
    const [loading, setLoading] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [historialData, setHistorialData] = useState([]);

    useEffect(() => {
        fetchNodes();
    }, []);

    const fetchNodes = async () => {
        try {
            const { data, error } = await supabaseAnon
                .from('dispositivos')
                .select('*');
            if (error) throw error;
            setNodes(data);
        } catch (error) {
            console.error('Error al obtener los nodos:', error.message);
        }
    };

    const handleNodeChange = (value) => {
        setSelectedNode(value);
    };

    const handleDateChange = (dates) => {
        setStartDate(dates[0]);
        setEndDate(dates[1]);
    };

    const fetchData = async () => {
        if (!selectedNode || !startDate || !endDate) {
            console.error('Debes seleccionar un nodo y un rango de fechas.');
            return;
        }

        try {
            setLoading(true);
            // Convertir las fechas al formato ISO 8601
            const startDateISO = startDate.toISOString();
            const endDateISO = endDate.toISOString();

            const { data, error } = await supabaseAnon
                .from('lecturas')
                .select('id, dispositivo_id, fecha_registro, temperatura, humedad, caudal')
                .eq('dispositivo_id', selectedNode)
                .gte('fecha_registro', startDateISO)
                .lte('fecha_registro', endDateISO);
            if (error) throw error;
            setHistorialData(data);
        } catch (error) {
            console.error('Error al obtener el historial de lecturas:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'ID del Dispositivo', dataIndex: 'dispositivo_id', key: 'dispositivo_id' },
        { title: 'Fecha de Registro', dataIndex: 'fecha_registro', key: 'fecha_registro' },
        { title: 'Temperatura', dataIndex: 'temperatura', key: 'temperatura' },
        { title: 'Humedad', dataIndex: 'humedad', key: 'humedad' },
        { title: 'Caudal', dataIndex: 'caudal', key: 'caudal' },
    ];

    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="Reportes" />
            <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Row gutter={16} style={{ marginBottom: '16px' }}>
                                <Col span={6}>
                                    <Select
                                        placeholder="Seleccionar nodo"
                                        style={{ width: '100%' }}
                                        onChange={handleNodeChange}
                                        value={selectedNode}
                                    >
                                        {nodes.map((node) => (
                                            <Option key={node.id} value={node.id}>
                                                {node.nombre}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={6}>
                                    <RangePicker
                                        style={{ width: '100%' }}
                                        onChange={handleDateChange}
                                        value={[startDate, endDate]}
                                        placeholder={['Fecha inicial', 'Fecha final']}
                                        locale={{ lang: { placeholder: 'Seleccionar fecha' }, calendar: { lang: { locale: 'es_ES' } } }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Button type="primary" onClick={fetchData} disabled={loading}>
                                        {loading ? 'Cargando...' : 'Obtener Historial'}
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                dataSource={historialData}
                                columns={columns}
                                loading={loading}
                                bordered
                                scroll={{ x: true }}
                                rowKey="id"
                                locale={{ emptyText: 'No hay datos disponibles' }}
                            />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default observer(Reportes);
