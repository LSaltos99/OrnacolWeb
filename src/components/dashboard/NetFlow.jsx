import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import { supabaseAnon } from '../../supabaseConfig';

class NetFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xAxisData: [],
            seriesInData: [],
            seriesOutData: []
        };
    }

    async componentDidMount() {
        await this.fetchData(); // Obtener datos inicialmente al montar el componente
        this.interval = setInterval(async () => {
            await this.fetchData(); // Obtener datos cada 15 segundos
        }, 15000);
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.selectedDevice !== this.props.selectedDevice) {
            await this.fetchData(); // Obtener nuevos datos cuando cambie el dispositivo seleccionado
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval); 
    }

    async fetchData() {
        try {
            const { selectedDevice } = this.props;
            if (!selectedDevice) return; // Si no hay dispositivo seleccionado, no hacer nada
            
            const { data, error } = await supabaseAnon
                .from('lecturas')
                .select('temperatura, humedad, fecha_registro')
                .eq('dispositivo_id', selectedDevice.id)
                .order('fecha_registro', { ascending: false })
                .limit(31); 
    
            if (error) {
                throw error;
            }
    
            const xAxisData = [];
            const seriesInData = [];
            const seriesOutData = [];

            data.reverse();

            data.forEach((lectura, index) => {
                xAxisData.push(index + 1); 
                seriesInData.push(lectura.temperatura); 
                seriesOutData.push(lectura.humedad);
            });
    
            this.setState({ xAxisData, seriesInData, seriesOutData });
        } catch (error) {
            console.error('Error al obtener las últimas lecturas:', error.message);
        }
    }

    render() {
        const { xAxisData, seriesInData, seriesOutData } = this.state;

        const option = {
            title: {
                text: 'Gráfica de lecturas'
            },
            legend: {
                data: [
                    'Temperatura',
                    'Humedad'
                ],
                orient: 'horizontal',
                x: 'center',
                y: 'top'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const temperature = params[0].value;
                    const humidity = params[1].value;
                    return `Humedad: ${humidity}%<br/>Temperatura: ${temperature}°C`;
                }
            },
            calculable: true,
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            series: [
                {
                    data: seriesInData,
                    name: 'Temperatura',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8 
                }, {
                    data: seriesOutData,
                    name: 'Humedad',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle', 
                    symbolSize: 8 
                }
            ],
            xAxis: [
                {
                    boundaryGap: false,
                    data: xAxisData,
                    type: 'category'
                }
            ],
            yAxis: {}
        };                  

        return (
            <ReactEcharts
                echarts={echarts}
                option={option}
                style={{height: '300px', width: '100%'}}
                className={'react_for_echarts'}
            />
        );
    }
}

export default NetFlow;
