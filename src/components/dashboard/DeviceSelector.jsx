import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography } from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
import NetFlow from "./NetFlow";
import DeviceSelector from "./DeviceSelector"; // Importa DeviceSelector

const { Title } = Typography;

const Dashboard = () => {
    const [lectura, setLectura] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        fetchLectura();
        fetchEventos();
    }, [selectedDevice]);

    const fetchLectura = async () => {
        if (!selectedDevice) return;

        try {
            const { data, error } = await supabaseAnon
                .from("lecturas")
                .select("temperatura, humedad, caudal")
                .eq("dispositivo_id", selectedDevice)
                .order("fecha_registro", { ascending: false })
                .limit(1);

            if (error) throw error;

            setLectura(data[0]);
        } catch (error) {
            console.error("Error al obtener la última lectura:", error.message);
        }
    };

    const fetchEventos = async () => {
        if (!selectedDevice) return;

        try {
            const { data, error } = await supabaseAnon
                .from("eventos_valvula")
                .select("fecha_activacion")
                .eq("dispositivo_id", selectedDevice)
                .order("fecha_activacion", { ascending: false })
                .limit(5);

            if (error) throw error;

            setEventos(data);
        } catch (error) {
            console.error("Error al obtener los eventos:", error.message);
        }
    };

    const handleDeviceChange = (value) => {
        setSelectedDevice(value);
    };

    return (
        <div className="gutter-example button-demo">
            <BreadcrumbCustom />
            <Row gutter={10} style={{ justifyContent: "center", marginBottom: "20px" }}>
                <Col className="gutter-row" span={24}>
                    <div className="gutter-box" style={{ textAlign: "center" }}>
                        <Card bordered={false}>
                            <DeviceSelector onChange={handleDeviceChange} />
                        </Card>
                    </div>
                </Col>
            </Row>

            {selectedDevice ? (
                <Row gutter={10}>
                    <Col className="gutter-row" span={8}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <i className="anticon anticon-cloud" style={{ fontSize: 30, color: "#ffd700" }}></i>
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">Temperatura</div>
                                        <h2>{lectura ? `${lectura.temperatura} °C` : "-"}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <i className="anticon anticon-cloud" style={{ fontSize: 30, color: "red" }}></i>
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">Húmedad</div>
                                        <h2>{lectura ? `${lectura.humedad} %` : "-"}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <i className="anticon anticon-cloud" style={{ fontSize: 30, color: "gray" }}></i>
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">Flujo de agua</div>
                                        <h2>{lectura ? `${lectura.caudal} Q` : "-"}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            ) : (
                <div style={{ textAlign: "center" }}>AQUI VAN LAS INDICACIONES PARA EL USO DE LA PAGINA</div>
            )}

            {selectedDevice && (
                <Row>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card bordered={false} className={"no-padding"}>
                                <NetFlow selectedDevice={selectedDevice} />
                            </Card>
                        </div>
                    </Col>
                </Row>
            )}

            {selectedDevice && (
                <Row gutter={10} style={{ marginBottom: "10px" }}>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{ height: "150px" }}>
                                <div style={styles.timelineContainer}>
                                    {eventos.map((evento, index) => (
                                        <div key={index} style={styles.timelineItem}>
                                            <div style={styles.timelineDot} />
                                            <div style={styles.timelineContent}>
                                                Riego activado en {new Date(evento.fecha_activacion).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
};

const styles = {
    timelineContainer: {
        position: 'relative',
        padding: '10px'
    },
    timelineItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
    },
    timelineDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#1890ff',
        marginRight: '10px'
    },
    timelineContent: {
        padding: '5px 10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px'
    }
};

export default Dashboard;
