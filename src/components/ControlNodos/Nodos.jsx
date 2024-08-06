import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Table, Button, Modal, Form, Input, Spin } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { supabaseAnon } from '../../supabaseConfig';

const { Item: FormItem } = Form;

const Nodos = () => {
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [visibleModifyModal, setVisibleModifyModal] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [loading, setLoading] = useState(true);

    const formRef = useRef(null);
    const formCreateRef = useRef(null);

    useEffect(() => {
        fetchNodes();
    }, []);

    const fetchNodes = async () => {
        try {
            const { data, error } = await supabaseAnon
                .from('dispositivos')
                .select('*');
            if (error) {
                throw error;
            }
            setNodes(data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los nodos:', error.message);
        }
    };

    const handleCreate = () => {
        setVisibleCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setVisibleCreateModal(false);
    };

    const handleModify = (node) => {
        console.log('Modificar nodo:', node);
        setSelectedNode(node);
        setVisibleModifyModal(true);
    };

    const handleCloseModifyModal = () => {
        setVisibleModifyModal(false);
    };

    const handleSaveChanges = async () => {
        try {
            const { mac, nombre, latitud, longitud } = formRef.current.getFieldsValue();
            const { data, error } = await supabaseAnon
                .from('dispositivos')
                .update({ mac, nombre, latitud, longitud })
                .eq('id', selectedNode.id);
            if (error) {
                throw error;
            }
            console.log('Datos actualizados:', data);
            setVisibleModifyModal(false);
            fetchNodes();
        } catch (error) {
            console.error('Error al guardar los cambios:', error.message);
        }
    };

    const handleConfirmSaveChanges = () => {
        Modal.confirm({
            title: 'Confirmación',
            content: '¿Estás seguro de que deseas guardar los cambios?',
            okText: 'Guardar',
            cancelText: 'Cancelar',
            onOk: handleSaveChanges,
        });
    };

    const handleCreateNode = async () => {
        try {
            const { mac, nombre, latitud, longitud } = formCreateRef.current.getFieldsValue();
            const { data, error } = await supabaseAnon
                .from('dispositivos')
                .insert([{ mac, nombre, latitud, longitud }]);
            if (error) {
                throw error;
            }
            console.log('Nuevo nodo creado:', data);
            setVisibleCreateModal(false);
            fetchNodes();
        } catch (error) {
            console.error('Error al crear el nodo:', error.message);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'MAC', dataIndex: 'mac', key: 'mac' },
        { title: 'Latitud', dataIndex: 'latitud', key: 'latitud' },
        { title: 'Longitud', dataIndex: 'longitud', key: 'longitud' },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <Button type="primary" onClick={() => handleModify(record)}>Modificar</Button>
            ),
        },
    ];

    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="Control de Nodos" />
            <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Button type="primary" onClick={handleCreate}>Crear Nodo</Button>
                            {loading ? (
                                <Spin tip="Cargando datos...">
                                    <Table dataSource={nodes} columns={columns} />
                                </Spin>
                            ) : (
                                <Table dataSource={nodes} columns={columns} rowKey="id" />
                            )}
                        </Card>
                    </div>
                </Col>
            </Row>
            <Modal
                title="Modificar Nodo"
                visible={visibleModifyModal}
                onCancel={handleCloseModifyModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseModifyModal}>Cancelar</Button>,
                    <Button key="save" type="primary" onClick={handleConfirmSaveChanges}>Guardar</Button>,
                ]}
            >
                {selectedNode && (
                    <Form ref={formRef} initialValues={{ mac: selectedNode.mac, nombre: selectedNode.nombre, latitud: selectedNode.latitud, longitud: selectedNode.longitud }}>
                        <FormItem label="MAC" name="mac">
                            <Input />
                        </FormItem>
                        <FormItem label="Nombre" name="nombre">
                            <Input />
                        </FormItem>
                        <FormItem label="Latitud" name="latitud">
                            <Input />
                        </FormItem>
                        <FormItem label="Longitud" name="longitud">
                            <Input />
                        </FormItem>
                    </Form>
                )}
            </Modal>
            <Modal
                title="Crear Nodo"
                visible={visibleCreateModal}
                onCancel={handleCloseCreateModal}
                okText="Guardar"
                cancelText="Cancelar"
                onOk={handleCreateNode}
            >
                <Form ref={formCreateRef}>
                    <FormItem label="MAC" name="mac">
                        <Input />
                    </FormItem>
                    <FormItem label="Nombre" name="nombre">
                        <Input />
                    </FormItem>
                    <FormItem label="Latitud" name="latitud">
                        <Input />
                    </FormItem>
                    <FormItem label="Longitud" name="longitud">
                        <Input />
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
};

export default Nodos;
