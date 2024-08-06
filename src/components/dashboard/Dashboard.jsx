import React from 'react';
import { Row, Col, Card, Select } from 'antd';
import { CloudOutlined, CloudSyncOutlined, CloudUploadOutlined } from '@ant-design/icons';
import NetFlow from './NetFlow';
import { cardResponsive } from '../../utils/layout';
import { supabaseAnon } from '../../supabaseConfig';

import BreadcrumbCustom from '../BreadcrumbCustom';
import HeaderCustom from '../HeaderCustomm';

const { Option } = Select;

const MapComponent = () => {
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2170.376143640846!2d-103.80104129482672!3d19.225673469500265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84254fe0c4ce949d%3A0x90e047be7dbdc5f4!2sVivero%20Ornacol!5e0!3m2!1ses!2smx!4v1718117403691!5m2!1ses!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
};

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lectura: null,
            dispositivos: [],
            selectedDevice: null,
            eventos: [],
        };
    }

    async componentDidMount() {
        await this.fetchDispositivos();
        this.intervalLectura = setInterval(async () => {
            await this.fetchLectura();
        }, 15000);
        this.intervalEventos = setInterval(async () => {
            await this.fetchEventos();
        }, 30000);
    }

    async componentWillUnmount() {
        clearInterval(this.intervalLectura);
        clearInterval(this.intervalEventos);
    }

    async fetchLectura() {
        try {
            const { selectedDevice } = this.state;
            if (!selectedDevice) return;

            const { data, error } = await supabaseAnon
                .from('lecturas')
                .select('temperatura, humedad, caudal')
                .eq('dispositivo_id', selectedDevice.id)
                .order('fecha_registro', { ascending: false })
                .limit(1);

            if (error) {
                throw error;
            }

            this.setState({ lectura: data[0] });
        } catch (error) {
            console.error('Error al obtener la última lectura:', error.message);
        }
    }

    async fetchDispositivos() {
        try {
            const { data, error } = await supabaseAnon
                .from('dispositivos')
                .select('id, nombre');

            if (error) {
                throw error;
            }

            this.setState({ dispositivos: data });
        } catch (error) {
            console.error('Error al obtener los dispositivos:', error.message);
        }
    }

    async fetchEventos() {
        try {
            const { selectedDevice } = this.state;
            if (!selectedDevice) return;

            const { data, error } = await supabaseAnon
                .from('eventos_valvula')
                .select('fecha_activacion')
                .eq('dispositivo_id', selectedDevice.id)
                .order('fecha_activacion', { ascending: false })
                .limit(5);

            if (error) {
                throw error;
            }

            this.setState({ eventos: data });
        } catch (error) {
            console.error('Error al obtener los eventos:', error.message);
        }
    }

    handleDeviceChange = async (value) => {
        const selectedDevice = this.state.dispositivos.find(
            (device) => device.nombre === value
        );
        await this.setState({ selectedDevice });
        await this.fetchLectura();
        await this.fetchEventos();
    };

    render() {
        const { lectura, dispositivos, selectedDevice, eventos } = this.state;

        return (
            
            
            <div className="gutter-example button-demo">
                
                <BreadcrumbCustom />
                <Row
                    gutter={10}
                    style={{ justifyContent: 'center', marginBottom: '20px' }}
                >
                    <Col className="gutter-row" span={24}>
                        <div
                            className="gutter-box"
                            style={{ textAlign: 'center' }}
                        >
                            <Card bordered={false}>
                                <Select
                                    value={
                                        selectedDevice
                                            ? selectedDevice.nombre
                                            : 'placeholder'
                                    }
                                    style={{ width: 200 }}
                                    onChange={this.handleDeviceChange}
                                >
                                    <Option
                                        key="placeholder"
                                        value="placeholder"
                                        disabled
                                    >
                                        Selecciona un nodo...
                                    </Option>
                                    {dispositivos.map((device) => (
                                        <Option
                                            key={device.id}
                                            value={device.nombre}
                                        >
                                            {device.nombre}
                                        </Option>
                                    ))}
                                </Select>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {selectedDevice ? (
                    <Row gutter={10}>
                        <Col className="gutter-row" {...cardResponsive}>
                            <div className="gutter-box">
                                <Card bordered={false}>
                                    <div className="clear y-center">
                                        <div className="pull-left mr-m">
                                            <CloudOutlined
                                                style={{
                                                    fontSize: 30,
                                                    color: '#ffd700',
                                                }}
                                            />
                                        </div>
                                        <div className="clear">
                                            <div className="text-muted">
                                                Temperatura
                                            </div>
                                            <h2>
                                                {lectura
                                                    ? `${Number(lectura.temperatura).toFixed(2)} °C`
                                                    : '-'}
                                            </h2>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col className="gutter-row" {...cardResponsive}>
                            <div className="gutter-box">
                                <Card bordered={false}>
                                    <div className="clear y-center">
                                        <div className="pull-left mr-m">
                                            <CloudSyncOutlined
                                                style={{
                                                    fontSize: 30,
                                                    color: 'red',
                                                }}
                                            />
                                        </div>
                                        <div className="clear">
                                            <div className="text-muted">
                                                Húmedad
                                            </div>
                                            <h2>
                                                {lectura
                                                    ? `${Number(lectura.humedad).toFixed(2)} %`
                                                    : '-'}
                                            </h2>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col className="gutter-row" {...cardResponsive}>
                            <div className="gutter-box">
                                <Card bordered={false}>
                                    <div className="clear y-center">
                                        <div className="pull-left mr-m">
                                            <CloudUploadOutlined
                                                style={{
                                                    fontSize: 30,
                                                    color: 'gray',
                                                }}
                                            />
                                        </div>
                                        <div className="clear">
                                            <div className="text-muted">
                                                Flujo de agua
                                            </div>
                                            <h2>
                                                {lectura
                                                    ? `${Number(lectura.caudal).toFixed(2)} Q`
                                                    : '-'}
                                            </h2>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        AQUI VAN LAS INDICACIONES PARA EL USO DE LA PAGINA
                    </div>
                )}

                {selectedDevice && (
                    <Row>
                        <Col className="gutter-row" span={24}>
                            <div className="gutter-box">
                                <Card bordered={false} className={'no-padding'}>
                                    <NetFlow selectedDevice={selectedDevice} />
                                </Card>
                            </div>
                        </Col>
                    </Row>
                )}

                {selectedDevice && (
                    <Row gutter={10} style={{ marginBottom: '10px' }}>
                        <Col className="gutter-row" span={24}>
                            <div className="gutter-box">
                                <Card
                                    bordered={false}
                                    style={{ height: '150px' }}
                                >
                                    <div style={styles.timelineContainer}>
                                        {eventos.map((evento, index) => (
                                            <div
                                                key={index}
                                                style={styles.timelineItem}
                                            >
                                                <div
                                                    style={styles.timelineDot}
                                                />
                                                <div
                                                    style={styles.timelineContent}
                                                >
                                                    Riego activado
                                                    <br />
                                                    {evento.fecha_activacion}
                                                </div>
                                                {index < eventos.length - 1 && (
                                                    <div
                                                        style={styles.timelineLine}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                )}

                {selectedDevice && (
                    <Row gutter={10}>
                        <Col className="gutter-row" span={24}>
                            <div className="gutter-box">
                                <Card
                                    bordered={false}
                                    style={{ height: '300px' }}
                                >
                                    Mapa de Nodos
                                    <MapComponent />
                                </Card>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        );
    }
}

const styles = {
    timelineContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        overflowX: 'auto',
        padding: '20px',
    },
    timelineItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: '95px',
        position: 'relative',
    },
    timelineDot: {
        width: '10px',
        height: '10px',
        backgroundColor: 'green',
        borderRadius: '50%',
        position: 'absolute',
        top: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    timelineContent: {
        marginTop: '10px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
    },
    timelineLine: {
        content: '',
        position: 'absolute',
        top: '-2px',
        left: '100%',
        width: '100px',
        height: '2px',
        backgroundColor: 'green',
    },
};

export default Dashboard;
