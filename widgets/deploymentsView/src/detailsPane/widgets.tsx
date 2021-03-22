import { noop } from 'lodash';
import type { FunctionComponent } from 'react';

const DetailsPaneWidgets: FunctionComponent = () => {
    const { WidgetsList } = Stage.Shared.Widgets;

    return (
        <WidgetsList
            isEditMode={false}
            onWidgetRemoved={noop}
            onWidgetUpdated={noop}
            widgets={[
                {
                    name: 'Execution Task Graph',
                    width: 12,
                    height: 24,
                    x: 0,
                    y: 0,
                    configuration: {
                        showSystemExecutions: false,
                        singleExecutionView: true
                    },
                    definition: 'executions',
                    id: 'task graph',
                    maximized: false,
                    drillDownPages: {}
                },
                {
                    name: 'Events/Logs Filter',
                    width: 12,
                    height: 5,
                    x: 0,
                    y: 24,
                    definition: 'eventsFilter',
                    id: 'filter',
                    maximized: false,
                    drillDownPages: {},
                    configuration: {}
                },
                {
                    name: 'Deployment Events/Logs',
                    width: 12,
                    height: 18,
                    x: 0,
                    y: 29,
                    definition: 'events',
                    configuration: {},
                    id: 'logs',
                    maximized: false,
                    drillDownPages: {}
                }
            ]}
        />
    );
};
export default DetailsPaneWidgets;
