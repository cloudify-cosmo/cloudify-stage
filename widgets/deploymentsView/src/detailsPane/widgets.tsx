import { noop } from 'lodash';
import type { FunctionComponent } from 'react';

const DetailsPaneWidgets: FunctionComponent = () => {
    const { PageContent } = Stage.Shared.Widgets;

    return (
        <div className="detailsPaneWidgets">
            <PageContent
                isEditMode={false}
                page={page as any}
                // NOTE: No need to handle the events below since edit mode is always off
                onWidgetRemoved={noop}
                onWidgetUpdated={noop}
                onTabAdded={noop}
                onTabRemoved={noop}
                onTabUpdated={noop}
                onTabMoved={noop}
                onWidgetAdded={noop}
                onLayoutSectionAdded={noop}
                onLayoutSectionRemoved={noop}
            />
        </div>
    );
};
export default DetailsPaneWidgets;

const page = {
    name: 'details-pane-widgets',
    layout: [
        {
            type: 'tabs',
            content: [
                {
                    name: 'Last Execution',
                    widgets: [
                        {
                            id: '97494895-722a-4f35-b116-9333db9d16c2',
                            name: 'Execution Task Graph',
                            x: 0,
                            y: 0,
                            width: 12,
                            height: 24,
                            definition: 'executions',
                            configuration: {
                                pollingTime: 5,
                                pageSize: 5,
                                fieldsToShow: [
                                    'Blueprint',
                                    'Deployment',
                                    'Workflow',
                                    'Created',
                                    'Ended',
                                    'Creator',
                                    'Attributes',
                                    'Actions',
                                    'Status'
                                ],
                                showSystemExecutions: false,
                                sortColumn: 'created_at',
                                sortAscending: null,
                                singleExecutionView: true
                            },
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: 'd76caa9b-cd29-4165-a15d-4541af9586ce',
                            name: 'Events/Logs Filter',
                            x: 0,
                            y: 24,
                            width: 12,
                            height: 5,
                            definition: 'eventsFilter',
                            configuration: {},
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: 'e30874d3-38e4-4a1f-b09c-f5e7be42d0cd',
                            name: 'Deployment Events/Logs',
                            x: 0,
                            y: 29,
                            width: 12,
                            height: 18,
                            definition: 'events',
                            configuration: {
                                pollingTime: 2,
                                pageSize: 5,
                                sortColumn: 'timestamp',
                                sortAscending: null,
                                fieldsToShow: [
                                    'Icon',
                                    'Timestamp',
                                    'Blueprint',
                                    'Deployment',
                                    'Workflow',
                                    'Operation',
                                    'Node Id',
                                    'Node Instance Id',
                                    'Message'
                                ],
                                colorLogs: true,
                                maxMessageLength: 200
                            },
                            drillDownPages: {},
                            maximized: false
                        }
                    ],
                    isDefault: true
                },
                {
                    name: 'Deployment Info',
                    widgets: [
                        {
                            id: 'ae8b83aa-421a-4c0b-8e44-87b247f1176b',
                            name: 'Deployment Topology',
                            x: 0,
                            y: 0,
                            width: 12,
                            height: 21,
                            definition: 'topology',
                            configuration: {
                                pollingTime: 10,
                                enableNodeClick: true,
                                enableGroupClick: true,
                                enableZoom: true,
                                enableDrag: true,
                                showToolbar: true
                            },
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: 'c99e6c34-21f0-4f4c-9e50-b3225352f707',
                            name: 'Deployment Outputs/Capabilities',
                            x: 0,
                            y: 21,
                            width: 12,
                            height: 20,
                            definition: 'outputs',
                            configuration: { pollingTime: 10, showCapabilities: true },
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: '65b1e44e-89e8-4405-b6d5-688385aef2b0',
                            name: 'Labels',
                            x: 0,
                            y: 41,
                            width: 12,
                            height: 20,
                            definition: 'labels',
                            configuration: { pollingTime: 30 },
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: '2300094d-954e-4dc2-9af1-f50fdafacb3e',
                            name: 'Deployment Inputs',
                            x: 0,
                            y: 61,
                            width: 12,
                            height: 20,
                            definition: 'inputs',
                            configuration: { pollingTime: 30 },
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: 'cb314fae-2013-4e8e-8ed8-1429171dda6a',
                            name: 'Deployment Sources',
                            x: 0,
                            y: 105,
                            width: 12,
                            height: 24,
                            definition: 'blueprintSources',
                            configuration: { contentPaneWidth: 65 },
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: '6579a2f8-bbb3-4d75-9d88-cb201ac076d3',
                            name: 'Deployment Nodes',
                            x: 0,
                            y: 81,
                            width: 12,
                            height: 24,
                            definition: 'nodes',
                            configuration: {
                                pollingTime: 10,
                                pageSize: 5,
                                fieldsToShow: [
                                    'Name',
                                    'Type',
                                    'Blueprint',
                                    'Deployment',
                                    'Contained in',
                                    'Connected to',
                                    'Host',
                                    'Creator',
                                    '# Instances',
                                    'Groups'
                                ]
                            },
                            drillDownPages: {},
                            maximized: false
                        }
                    ],
                    isDefault: false
                },
                {
                    name: 'History',
                    widgets: [
                        {
                            id: 'cc864398-d34f-40fa-a533-f1230ff78fdf',
                            name: 'Deployment Executions',
                            x: 0,
                            y: 0,
                            width: 12,
                            height: 24,
                            definition: 'executions',
                            configuration: {
                                pollingTime: 5,
                                pageSize: 5,
                                fieldsToShow: [
                                    'Blueprint',
                                    'Deployment',
                                    'Workflow',
                                    'Created',
                                    'Ended',
                                    'Creator',
                                    'Attributes',
                                    'Actions',
                                    'Status'
                                ],
                                showSystemExecutions: true,
                                sortColumn: 'created_at',
                                sortAscending: null,
                                singleExecutionView: false
                            },
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: 'd6f37015-a342-4897-aeeb-15f1e21e6332',
                            name: 'Events/Logs Filter',
                            x: 0,
                            y: 24,
                            width: 12,
                            height: 5,
                            definition: 'eventsFilter',
                            configuration: {},
                            drillDownPages: {},
                            maximized: false
                        },
                        {
                            id: '11071b42-68a3-43bb-ba62-def7bb4de4c7',
                            name: 'Deployment Events/Logs',
                            x: 0,
                            y: 29,
                            width: 12,
                            height: 23,
                            definition: 'events',
                            configuration: {
                                pollingTime: 2,
                                pageSize: 5,
                                sortColumn: 'timestamp',
                                sortAscending: null,
                                fieldsToShow: [
                                    'Icon',
                                    'Timestamp',
                                    'Blueprint',
                                    'Deployment',
                                    'Workflow',
                                    'Operation',
                                    'Node Id',
                                    'Node Instance Id',
                                    'Message'
                                ],
                                colorLogs: true,
                                maxMessageLength: 200
                            },
                            drillDownPages: {},
                            maximized: false
                        }
                    ],
                    isDefault: false
                }
            ]
        }
    ]
};
