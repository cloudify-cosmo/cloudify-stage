/* eslint-disable */
export const deploymentsPageListSnapshot = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        type: 'page',
        icon: 'dashboard',
        description: '',
        layout: [
            { type: 'widgets', content: [] },
            {
                type: 'widgets',
                content: [
                    {
                        id: 'd099a40b-69f9-4951-967a-fafd179965ed',
                        x: 0,
                        y: 3,
                        width: 3,
                        height: 8,
                        definition: 'cloudNum',
                        configuration: {},
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: '15a4cac8-c454-4c27-93f2-2301836f985d',
                        x: 3,
                        y: 3,
                        width: 3,
                        height: 8,
                        definition: 'deploymentNum',
                        configuration: {
                            pollingTime: 10,
                            label: 'Services',
                            icon: 'cube',
                            imageSrc: null,
                            filterId: 'csys-service-filter',
                            page: 'services'
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: '03ce048c-79a1-47fc-ac9c-ea03ea8907fa',
                        x: 6,
                        y: 3,
                        width: 3,
                        height: 8,
                        definition: 'deploymentNum',
                        configuration: {
                            pollingTime: 10,
                            label: 'Kubernetes clusters',
                            icon: '',
                            imageSrc: '/console/static/images/k8s_logo.png',
                            filterId: 'csys-k8s-filter',
                            page: 'services'
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: 'f38e5a30-b58b-49a3-9e0f-585d612d82c9',
                        x: 9,
                        y: 3,
                        width: 3,
                        height: 8,
                        definition: 'deploymentNum',
                        configuration: {
                            pollingTime: 10,
                            label: 'Terraform modules',
                            icon: '',
                            imageSrc: '/console/static/images/terraform_logo-dark.png',
                            filterId: 'csys-terraform-filter',
                            page: 'services'
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: 'fa5958dd-b99f-4f5a-96ae-a001bf9ddb22',
                        x: 0,
                        y: 0,
                        width: 3,
                        height: 3,
                        definition: 'buttonLink',
                        configuration: {
                            url: '?cloudSetup=true',
                            label: 'Setup cloud account',
                            color: 'blue',
                            icon: 'wizard',
                            basic: false,
                            fullHeight: false
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: '7163c662-47e3-4944-abd2-2bba798ae9dc',
                        x: 3,
                        y: 0,
                        width: 3,
                        height: 3,
                        definition: 'serviceButton',
                        configuration: {
                            color: 'blue',
                            label: 'Create a service',
                            icon: 'add',
                            basic: false,
                            marketplaceTabs: [
                                {
                                    name: 'AWS',
                                    url:
                                        'https://repository.cloudifysource.org/cloudify/blueprints/6.3/aws_services.json'
                                },
                                {
                                    name: 'Azure',
                                    url:
                                        'https://repository.cloudifysource.org/cloudify/blueprints/6.3/azure_services.json'
                                },
                                {
                                    name: 'GCP',
                                    url:
                                        'https://repository.cloudifysource.org/cloudify/blueprints/6.3/gcp_services.json'
                                },
                                {
                                    name: 'Terraform',
                                    url:
                                        'https://repository.cloudifysource.org/cloudify/blueprints/6.3/terraform_services.json'
                                },
                                {
                                    name: 'Helm',
                                    url:
                                        'https://repository.cloudifysource.org/cloudify/blueprints/6.3/helm_services.json'
                                },
                                {
                                    name: 'Other',
                                    url:
                                        'https://repository.cloudifysource.org/cloudify/blueprints/6.3/other_services.json'
                                }
                            ]
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: 'a5742336-f65a-4f4d-a911-41987a7f09a0',
                        x: 6,
                        y: 0,
                        width: 3,
                        height: 3,
                        definition: 'serviceButton',
                        configuration: {
                            color: 'blue',
                            label: 'Create Kubernetes cluster',
                            icon: 'add',
                            basic: false,
                            marketplaceTabs: [
                                {
                                    name: 'Clusters',
                                    url:
                                        'https://repository.cloudifysource.org/cloudify/blueprints/6.3/k8s-examples.json'
                                }
                            ]
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: '008a95e7-dda1-4706-b4fa-e474c72dd771',
                        x: 9,
                        y: 0,
                        width: 3,
                        height: 3,
                        definition: 'serviceButton',
                        configuration: {
                            color: 'blue',
                            label: 'Run Terraform module',
                            icon: 'add',
                            basic: false,
                            marketplaceTabs: [
                                {
                                    name: 'Terraform',
                                    url:
                                        'https://repository.cloudifysource.org/cloudify/blueprints/6.3/terraform_services.json'
                                }
                            ]
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: '48d107ec-0203-41b6-81c9-0d3f4959f443',
                        x: 0,
                        y: 11,
                        width: 12,
                        height: 3,
                        definition: 'filter',
                        configuration: {
                            pollingTime: 10,
                            filterByBlueprints: true,
                            filterByDeployments: false,
                            filterByExecutions: false,
                            filterByNodes: false,
                            filterByNodeInstances: false,
                            filterByExecutionsStatus: false,
                            filterBySiteName: false,
                            allowMultipleSelection: true
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: '2ad36240-5f5a-4e24-9f92-27453c2c9ce9',
                        name: 'Deployments',
                        x: 0,
                        y: 14,
                        width: 12,
                        height: 42,
                        definition: 'deployments',
                        configuration: {
                            pollingTime: 10,
                            pageSize: 5,
                            clickToDrillDown: true,
                            showExecutionStatusLabel: false,
                            showFirstUserJourneyButtons: true,
                            blueprintIdFilter: null,
                            displayStyle: 'list',
                            sortColumn: 'created_at',
                            sortAscending: null
                        },
                        drillDownPages: { Deployment: 'console_deployment' },
                        maximized: false
                    }
                ]
            }
        ],
        isDrillDown: false,
        children: ['console_deployment'],
        context: {}
    },
    {
        id: 'console_deployment',
        name: 'deployments_test_hw_dep_name',
        type: 'page',
        description: '',
        layout: [
            {
                type: 'widgets',
                content: [
                    {
                        id: '0ffb2614-d243-4dd8-b337-7a1e837a96ed',
                        name: 'Deployment Info',
                        x: 0,
                        y: 0,
                        width: 12,
                        height: 7,
                        definition: 'deploymentInfo',
                        configuration: {
                            pollingTime: 10,
                            showBlueprint: true,
                            showSite: true,
                            showCreated: true,
                            showUpdated: true,
                            showCreator: true,
                            showNodeInstances: true
                        },
                        drillDownPages: {},
                        maximized: false
                    },
                    {
                        id: 'fac8da4f-b33b-4698-b7ef-dbfcd340261f',
                        name: 'Deployment Action Buttons',
                        x: 0,
                        y: 7,
                        width: 12,
                        height: 2,
                        definition: 'deploymentActionButtons',
                        configuration: { preventRedirectToParentPageAfterDelete: false },
                        drillDownPages: {},
                        maximized: false
                    }
                ]
            },
            {
                type: 'tabs',
                content: [
                    {
                        name: 'Last Execution',
                        widgets: [
                            {
                                id: 'b1091483-1dfb-4454-b844-d088faca2236',
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
                                id: 'c946d29e-dd85-4066-995f-d233df2cfd16',
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
                                id: '42637670-1fc7-44b3-82ef-1a0c8d254767',
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
                                id: '65c71f75-8a16-4fd3-bef4-a15d10983d3b',
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
                                id: '872b9d85-98c1-4bdc-94dd-b1b939492c5d',
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
                                id: 'e009ee24-9f42-43f4-b71b-ac18df5ecb14',
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
                                id: 'ad4872ff-c5af-4501-84cf-8e8b4d4a1b36',
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
                                id: '60879d7a-a619-4238-b1b0-b1948a4bfdff',
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
                                id: 'd37baa00-c884-4d22-be81-4ec41a8ae47c',
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
                                id: '00686f7a-3409-4f7d-9bfd-ca1d7a13d3f6',
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
                                id: '721e1135-9672-4cc7-9298-3adbaef26745',
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
                                id: '10b9fd33-faba-4d74-b2d9-038e513dd358',
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
        ],
        isDrillDown: true,
        parent: 'dashboard',
        context: { deploymentId: 'deployments_test_hw_dep' }
    }
].reverse();
