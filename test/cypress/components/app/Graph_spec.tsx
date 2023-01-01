import React from 'react';
import { mount } from 'cypress/react';

import '../initAppContext';
import { Graph } from 'app/components/shared';

describe('Graph', () => {
    function verifyChart(chartLabel: string) {
        cy.get(`path[name="${chartLabel}"]`).should('be.visible');
    }

    it('renders bar chart', () => {
        const charts = [{ name: 'value', label: 'Number of fruits', axisLabel: '' }];
        const data = [
            { time: '10:00', value: 300 },
            { time: '11:00', value: 100 },
            { time: '12:00', value: 80 },
            { time: '13:00', value: 40 },
            { time: '14:00', value: 30 }
        ];

        mount(<Graph charts={charts} data={data} type={Graph.BAR_CHART_TYPE} />);

        verifyChart('Number of fruits');
    });
    it('renders line chart', () => {
        const charts = [{ name: 'value', label: 'CPU load', axisLabel: '' }];
        const data = [
            { time: '17:30', value: 1 },
            { time: '17:40', value: 2 },
            { time: '17:50', value: 1 },
            { time: '18:00', value: 3 },
            { time: '18:10', value: 5 },
            { time: '18:20', value: 8 },
            { time: '18:30', value: 5 }
        ];

        mount(<Graph charts={charts} data={data} type={Graph.LINE_CHART_TYPE} />);

        verifyChart('CPU load');
    });

    it('renders area chart', () => {
        const charts = [{ name: 'value', label: 'CPU load', axisLabel: '' }];
        const data = [
            { time: '17:30', value: 1 },
            { time: '17:40', value: 2 },
            { time: '17:50', value: 1 },
            { time: '18:00', value: 3 },
            { time: '18:10', value: 5 },
            { time: '18:20', value: 8 },
            { time: '18:30', value: 5 }
        ];

        mount(<Graph charts={charts} data={data} type={Graph.AREA_CHART_TYPE} />);

        verifyChart('CPU load');
    });

    it('renders multi-charts with one Y-axis per chart', () => {
        const charts = [
            { name: 'cpu_total_system', label: 'CPU - System [%]', axisLabel: '' },
            { name: 'memory_MemFree', label: 'Memory - Free [Bytes]', axisLabel: '' },
            { name: 'loadavg_processes_running', label: 'Load [%]', axisLabel: '' }
        ];
        const data = [
            {
                cpu_total_system: 3.5,
                loadavg_processes_running: 3.071428571428572,
                memory_MemFree: 146003090.2857143,
                time: '2017-09-26 11:00:00'
            },
            {
                cpu_total_system: 3.5,
                loadavg_processes_running: 1.071428571428572,
                memory_MemFree: 106003090.2857143,
                time: '2017-09-26 12:00:00'
            },
            {
                cpu_total_system: 3.5,
                loadavg_processes_running: 6.071428571428572,
                memory_MemFree: 126003090.2857143,
                time: '2017-09-26 13:00:00'
            }
        ];

        mount(<Graph charts={charts} data={data} type={Graph.LINE_CHART_TYPE} />);

        verifyChart('CPU - System [%]');
        verifyChart('Memory - Free [Bytes]');
        verifyChart('Load [%]');
    });
});
