describe('Getting started modal', () => {
    before(() => {
        cy.usePageMock().activate().login(undefined, undefined, true, false);
    });

    beforeEach(() => {
        // cy.deletePlugins();
        // cy.deleteSecrets();
        // cy.deleteDeployments('', true);
        // cy.deleteBlueprints('', true);
        cy.enableGettingStarted();
        cy.reload();
    });

    it('should provide option to disable popup', () => {
        cy.get('label').contains("Don't show next time").click();
        cy.get('button').contains('Close').click();
        cy.reload();
        cy.get('div').contains('This page is empty').click(); // the way to check if modal is not visible
    });

    it('should install selected technology', () => {
        cy.interceptSp('GET', /^\/users\/\w+/, req => {
            req.reply({
                show_getting_started: true
            });
        });

        cy.intercept(
            'GET',
            '/console/external/content?url=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fplugins.json',
            req => {
                req.reply([
                    {
                        description: 'A Cloudify Plugin that provisions resources in AWS',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-aws-plugin/releases',
                        title: 'AWS',
                        version: '2.8.0',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
                        name: 'cloudify-aws-plugin'
                    },
                    {
                        description: 'Various extension utilities, including REST API',
                        releases: 'https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases',
                        title: 'Utilities',
                        version: '1.24.4',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2019/08/pluginlogo.png',
                        name: 'cloudify-utilities-plugin'
                    },
                    {
                        description: 'Cloudify plugin for packaging Kubernetes microservices in Cloudify blueprints',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-kubernetes-plugin/releases',
                        title: 'Kubernetes',
                        version: '2.12.1',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-redhat-Maipo-py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-redhat-Maipo-py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2020/07/kube-icon.png',
                        name: 'cloudify-kubernetes-plugin'
                    }
                ]);
            }
        );

        // mocks listing: plugins, secrets and blueprints

        cy.interceptSp('GET', '/plugins?_include=distribution,package_name,package_version,visibility', req => {
            req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
        });

        cy.interceptSp('GET', '/secrets?_include=key,visibility', req => {
            req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
        });

        cy.interceptSp(
            'GET',
            '/blueprints?_include=id%2Cdescription%2Cmain_file_name%2Ctenant_name%2Ccreated_at%2Cupdated_at%2Ccreated_by%2Cprivate_resource%2Cvisibility',
            req => {
                req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
            }
        );

        // mocks plugins uploading

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=AWS&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Faws-1.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-aws-plugin%2F2.8.0%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-aws-plugin%2F2.8.0%2Fcloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: '471ba867-5188-4ecc-b4f9-0a30883ef9f6' });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Utilities&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Fpluginlogo.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fcloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: '7be1e257-1f8f-48f6-9b6b-5447a3432018' });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Kubernetes&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2020%2F07%2Fkube-icon.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fcloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: 'b3ae9933-32f3-4440-b121-5b3a44588442' });
            }
        );

        // mocks secrets creating

        cy.interceptSp('PUT', '/secrets/aws_access_key_id', req => {
            req.reply({});
        });

        cy.interceptSp('PUT', '/secrets/aws_secret_access_key', req => {
            req.reply({});
        });

        // mocks blueprints uploading

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-Basics-VM-Setup?visibility=tenant&async_upload=true&application_file_name=aws.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            req => {
                req.reply({ id: 'AWS-Basics-VM-Setup', state: 'pending' });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-VM-Setup-using-CloudFormation?visibility=tenant&async_upload=true&application_file_name=aws-cloudformation.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            req => {
                req.reply({ id: 'AWS-VM-Setup-using-CloudFormation', state: 'pending' });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/Kubernetes-AWS-EKS?visibility=tenant&async_upload=true&application_file_name=blueprint.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fkubernetes-aws-eks.zip',
            req => {
                req.reply({ id: 'Kubernetes-AWS-EKS', state: 'pending' });
            }
        );

        // mocks blueprints status

        cy.interceptSp('GET', '/blueprints/AWS-Basics-VM-Setup', req => {
            req.reply({ id: 'AWS-Basics-VM-Setup', state: 'uploaded' });
        });

        cy.interceptSp('GET', '/blueprints/AWS-VM-Setup-using-CloudFormation', req => {
            req.reply({ id: 'AWS-VM-Setup-using-CloudFormation', state: 'uploaded' });
        });

        cy.interceptSp('GET', '/blueprints/Kubernetes-AWS-EKS', req => {
            req.reply({ id: 'Kubernetes-AWS-EKS', state: 'uploaded' });
        });

        cy.get('.modal button').contains('AWS').click();
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('Summary');
        cy.get('.modal .item').contains(/cloudify-utilities-plugin.*plugin will be installed/);
        cy.get('.modal .item').contains(/cloudify-kubernetes-plugin.*plugin will be installed/);
        cy.get('.modal .item').contains(/cloudify-aws-plugin.*plugin will be installed/);
        cy.get('.modal .item').contains(/aws_access_key_id.*secret will be created/);
        cy.get('.modal .item').contains(/aws_secret_access_key.*secret will be created/);
        cy.get('.modal .item').contains(/AWS-Basics-VM-Setup.*blueprint will be uploaded/);
        cy.get('.modal .item').contains(/AWS-VM-Setup-using-CloudFormation.*blueprint will be uploaded/);
        cy.get('.modal .item').contains(/Kubernetes-AWS-EKS.*blueprint will be uploaded/);
        cy.get('.modal button').contains('Finish').click();

        cy.get('.modal .progress .progress').contains('100%');
        cy.get('.modal .progress .label').contains('Installation done!');
        cy.get('button:not([disabled])').contains('Close').click();
    });

    it('should omit uploaded plugins and blueprints updating existing secrets', () => {
        cy.interceptSp('GET', /^\/users\/\w+/, req => {
            req.reply({
                show_getting_started: true
            });
        });

        cy.intercept(
            'GET',
            '/console/external/content?url=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fplugins.json',
            req => {
                req.reply([
                    {
                        description: 'A Cloudify Plugin that provisions resources in AWS',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-aws-plugin/releases',
                        title: 'AWS',
                        version: '2.8.0',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
                        name: 'cloudify-aws-plugin'
                    },
                    {
                        description: 'Various extension utilities, including REST API',
                        releases: 'https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases',
                        title: 'Utilities',
                        version: '1.24.4',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2019/08/pluginlogo.png',
                        name: 'cloudify-utilities-plugin'
                    },
                    {
                        description: 'Cloudify plugin for packaging Kubernetes microservices in Cloudify blueprints',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-kubernetes-plugin/releases',
                        title: 'Kubernetes',
                        version: '2.12.1',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-redhat-Maipo-py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-redhat-Maipo-py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2020/07/kube-icon.png',
                        name: 'cloudify-kubernetes-plugin'
                    }
                ]);
            }
        );

        // mocks listing: currently used plugins, secrets and blueprints

        cy.interceptSp('GET', '/plugins?_include=distribution,package_name,package_version,visibility', req => {
            req.reply({
                metadata: { pagination: { total: 3, size: 1000, offset: 0 }, filtered: null },
                items: [
                    {
                        visibility: 'tenant',
                        distribution: 'centos',
                        package_name: 'cloudify-kubernetes-plugin',
                        package_version: '2.12.1'
                    },
                    {
                        visibility: 'tenant',
                        distribution: 'centos',
                        package_name: 'cloudify-utilities-plugin',
                        package_version: '1.24.4'
                    },
                    {
                        visibility: 'tenant',
                        distribution: 'centos',
                        package_name: 'cloudify-aws-plugin',
                        package_version: '2.8.0'
                    }
                ]
            });
        });

        cy.interceptSp('GET', '/secrets?_include=key,visibility', req => {
            req.reply({
                metadata: { pagination: { total: 2, size: 1000, offset: 0 }, filtered: null },
                items: [
                    { key: 'aws_access_key_id', visibility: 'tenant' },
                    { key: 'aws_secret_access_key', visibility: 'tenant' }
                ]
            });
        });

        cy.interceptSp(
            'GET',
            '/blueprints?_include=id%2Cdescription%2Cmain_file_name%2Ctenant_name%2Ccreated_at%2Cupdated_at%2Ccreated_by%2Cprivate_resource%2Cvisibility',
            req => {
                req.reply({
                    metadata: { pagination: { total: 3, size: 50, offset: 0 }, filtered: null },
                    items: [
                        {
                            id: 'AWS-VM-Setup-using-CloudFormation',
                            visibility: 'tenant',
                            created_at: '2021-05-07T10:06:31.799Z',
                            main_file_name: 'aws-cloudformation.yaml',
                            updated_at: '2021-05-07T10:07:56.697Z',
                            description: null,
                            tenant_name: 'default_tenant',
                            created_by: 'admin',
                            private_resource: false
                        },
                        {
                            id: 'AWS-Basics-VM-Setup',
                            visibility: 'tenant',
                            created_at: '2021-05-07T10:06:31.792Z',
                            main_file_name: 'aws.yaml',
                            updated_at: '2021-05-07T10:07:54.715Z',
                            description: 'This blueprint creates an AWS infrastructure environment.\n',
                            tenant_name: 'default_tenant',
                            created_by: 'admin',
                            private_resource: false
                        },
                        {
                            id: 'Kubernetes-AWS-EKS',
                            visibility: 'tenant',
                            created_at: '2021-05-07T10:06:31.785Z',
                            main_file_name: 'blueprint.yaml',
                            updated_at: '2021-05-07T10:08:04.632Z',
                            description: null,
                            tenant_name: 'default_tenant',
                            created_by: 'admin',
                            private_resource: false
                        }
                    ]
                });
            }
        );

        // mocks plugins uploading

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=AWS&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Faws-1.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-aws-plugin%2F2.8.0%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-aws-plugin%2F2.8.0%2Fcloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Utilities&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Fpluginlogo.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fcloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Kubernetes&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2020%2F07%2Fkube-icon.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fcloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        // mocks secrets creating

        cy.interceptSp('PATCH', '/secrets/aws_access_key_id', req => {
            req.reply({});
        });

        cy.interceptSp('PATCH', '/secrets/aws_secret_access_key', req => {
            req.reply({});
        });

        // mocks blueprints uploading

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-Basics-VM-Setup?visibility=tenant&async_upload=true&application_file_name=aws.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-VM-Setup-using-CloudFormation?visibility=tenant&async_upload=true&application_file_name=aws-cloudformation.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/Kubernetes-AWS-EKS?visibility=tenant&async_upload=true&application_file_name=blueprint.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fkubernetes-aws-eks.zip',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        // mocks blueprints status

        cy.interceptSp('GET', '/blueprints/AWS-Basics-VM-Setup', () => {
            throw new Error('This case should not occur.');
        });

        cy.interceptSp('GET', '/blueprints/AWS-VM-Setup-using-CloudFormation', () => {
            throw new Error('This case should not occur.');
        });

        cy.interceptSp('GET', '/blueprints/Kubernetes-AWS-EKS', () => {
            throw new Error('This case should not occur.');
        });

        cy.get('.modal button').contains('AWS').click();
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('Summary');
        cy.get('.modal .item').contains(/cloudify-utilities-plugin.*plugin is already installed/);
        cy.get('.modal .item').contains(/cloudify-kubernetes-plugin.*plugin is already installed/);
        cy.get('.modal .item').contains(/cloudify-aws-plugin.*plugin is already installed/);
        cy.get('.modal .item').contains(/aws_access_key_id.*secret will be updated/);
        cy.get('.modal .item').contains(/aws_secret_access_key.*secret will be updated/);
        cy.get('.modal .item').contains(/AWS-Basics-VM-Setup.*blueprint is already uploaded/);
        cy.get('.modal .item').contains(/AWS-VM-Setup-using-CloudFormation.*blueprint is already uploaded/);
        cy.get('.modal .item').contains(/Kubernetes-AWS-EKS.*blueprint is already uploaded/);
        cy.get('.modal button').contains('Finish').click();

        cy.get('.modal .progress .progress').contains('100%');
        cy.get('.modal .progress .label').contains('Installation done!');
        cy.get('button:not([disabled])').contains('Close').click();
    });

    it('should group common plugins and secrets', () => {
        cy.interceptSp('GET', /^\/users\/\w+/, req => {
            req.reply({
                show_getting_started: true
            });
        });

        cy.intercept(
            'GET',
            '/console/external/content?url=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fplugins.json',
            req => {
                req.reply([
                    {
                        description: 'A Cloudify Plugin that provisions resources in AWS',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-aws-plugin/releases',
                        title: 'AWS',
                        version: '2.8.0',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
                        name: 'cloudify-aws-plugin'
                    },
                    {
                        description: 'Various extension utilities, including REST API',
                        releases: 'https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases',
                        title: 'Utilities',
                        version: '1.24.4',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2019/08/pluginlogo.png',
                        name: 'cloudify-utilities-plugin'
                    },
                    {
                        description: 'Cloudify plugin for packaging Kubernetes microservices in Cloudify blueprints',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-kubernetes-plugin/releases',
                        title: 'Kubernetes',
                        version: '2.12.1',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-redhat-Maipo-py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-redhat-Maipo-py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2020/07/kube-icon.png',
                        name: 'cloudify-kubernetes-plugin'
                    },
                    {
                        description: 'Deploy and manage Cloud resources with Terraform.',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-terraform-plugin/releases',
                        title: 'Terraform',
                        version: '0.16.0',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2020/07/terraform-icon.png',
                        name: 'cloudify-terraform-plugin'
                    },
                    {
                        description: 'A Cloudify Plugin that provisions resources in Google Cloud Platform',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-gcp-plugin/releases',
                        title: 'GCP',
                        version: '1.7.0',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-centos-Core-py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-centos-Core-py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-redhat-Maipo-py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-redhat-Maipo-py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2019/08/gcplogo.png',
                        name: 'cloudify-gcp-plugin'
                    },
                    {
                        description: 'The Ansible plugin can be used to run Ansible Playbooks',
                        releases: 'https://github.com/cloudify-cosmo/cloudify-ansible-plugin/releases',
                        title: 'Ansible',
                        version: '2.10.1',
                        link:
                            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/plugin.yaml',
                        wagons: [
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-centos-Core-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Centos Core'
                            },
                            {
                                url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
                                md5url:
                                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
                                name: 'Redhat Maipo'
                            }
                        ],
                        icon: 'https://cloudify.co/wp-content/uploads/2020/07/ansible-icon.png',
                        name: 'cloudify-ansible-plugin'
                    }
                ]);
            }
        );

        // mocks listing: current plugins, secrets and blueprints

        cy.interceptSp('GET', '/plugins?_include=distribution,package_name,package_version,visibility', req => {
            req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
        });

        cy.interceptSp('GET', '/secrets?_include=key,visibility', req => {
            req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
        });

        cy.interceptSp(
            'GET',
            '/blueprints?_include=id%2Cdescription%2Cmain_file_name%2Ctenant_name%2Ccreated_at%2Cupdated_at%2Ccreated_by%2Cprivate_resource%2Cvisibility',
            req => {
                req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
            }
        );

        // mocks plugins uploading

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=AWS&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Faws-1.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-aws-plugin%2F2.8.0%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-aws-plugin%2F2.8.0%2Fcloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: '471ba867-5188-4ecc-b4f9-0a30883ef9f6' });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Utilities&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Fpluginlogo.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fcloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: '7be1e257-1f8f-48f6-9b6b-5447a3432018' });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Kubernetes&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2020%2F07%2Fkube-icon.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fcloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: 'b3ae9933-32f3-4440-b121-5b3a44588442' });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Terraform&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2020%2F07%2Fterraform-icon.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-terraform-plugin%2F0.16.0%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-terraform-plugin%2F0.16.0%2Fcloudify_terraform_plugin-0.16.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: '44d6e242-35d1-4e44-850f-6b2a922fd220' });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=GCP&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Fgcplogo.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-gcp-plugin%2F1.7.0%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-gcp-plugin%2F1.7.0%2Fcloudify_gcp_plugin-1.7.0-centos-Core-py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: 'b96b35be-77e4-4ff6-b66b-b342f11565fb' });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Ansible&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2020%2F07%2Fansible-icon.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-ansible-plugin%2F2.10.1%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-ansible-plugin%2F2.10.1%2Fcloudify_ansible_plugin-2.10.1-centos-Core-py27.py36-none-linux_x86_64.wgn',
            req => {
                req.reply({ id: '07790312-9e3b-4072-84a6-5898a2e8d9b0' });
            }
        );

        // mocks secrets creating

        cy.interceptSp('PUT', '/secrets/aws_access_key_id', req => req.reply({}));
        cy.interceptSp('PUT', '/secrets/aws_secret_access_key', req => req.reply({}));
        cy.interceptSp('PUT', '/secrets/gpc_client_x509_cert_url', req => req.reply({}));
        cy.interceptSp('PUT', '/secrets/gpc_client_email', req => req.reply({}));
        cy.interceptSp('PUT', '/secrets/gpc_client_id', req => req.reply({}));
        cy.interceptSp('PUT', '/secrets/gpc_project_id', req => req.reply({}));
        cy.interceptSp('PUT', '/secrets/gpc_private_key_id', req => req.reply({}));
        cy.interceptSp('PUT', '/secrets/gpc_private_key', req => req.reply({}));
        cy.interceptSp('PUT', '/secrets/gpc_zone', req => req.reply({}));

        // mocks blueprints uploading

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-Basics-VM-Setup?visibility=tenant&async_upload=true&application_file_name=aws.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            req => {
                req.reply({ id: 'AWS-Basics-VM-Setup', state: 'pending' });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-VM-Setup-using-CloudFormation?visibility=tenant&async_upload=true&application_file_name=aws-cloudformation.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            req => {
                req.reply({ id: 'AWS-VM-Setup-using-CloudFormation', state: 'pending' });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/Kubernetes-AWS-EKS?visibility=tenant&async_upload=true&application_file_name=blueprint.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fkubernetes-aws-eks.zip',
            req => {
                req.reply({ id: 'Kubernetes-AWS-EKS', state: 'pending' });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-VM-Setup-using-Terraform?visibility=tenant&async_upload=true&application_file_name=aws-terraform.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            req => {
                req.reply({ id: '', state: 'pending' });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/GCP-Basics-VM-Setup?visibility=tenant&async_upload=true&application_file_name=gcp.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            req => {
                req.reply({ id: '', state: 'pending' });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/GCP-Basics-Simple-Service-Setup?visibility=tenant&async_upload=true&application_file_name=gcp.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fhello-world-example.zip',
            req => {
                req.reply({ id: '', state: 'pending' });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/Kubernetes-GCP-GKE?visibility=tenant&async_upload=true&application_file_name=blueprint.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fkubernetes-gcp-gke.zip',
            req => {
                req.reply({ id: '', state: 'pending' });
            }
        );

        // mocks blueprints status

        cy.interceptSp('GET', '/blueprints/AWS-Basics-VM-Setup', req => {
            req.reply({ id: 'AWS-Basics-VM-Setup', state: 'uploaded' });
        });

        cy.interceptSp('GET', '/blueprints/AWS-VM-Setup-using-CloudFormation', req => {
            req.reply({ id: 'AWS-VM-Setup-using-CloudFormation', state: 'uploaded' });
        });

        cy.interceptSp('GET', '/blueprints/Kubernetes-AWS-EKS', req => {
            req.reply({ id: 'Kubernetes-AWS-EKS', state: 'uploaded' });
        });

        cy.interceptSp('GET', '/blueprints/AWS-VM-Setup-using-Terraform', req => {
            req.reply({ id: 'AWS-VM-Setup-using-Terraform', state: 'uploaded' });
        });

        cy.interceptSp('GET', '/blueprints/GCP-Basics-VM-Setup', req => {
            req.reply({ id: 'GCP-Basics-VM-Setup', state: 'uploaded' });
        });

        cy.interceptSp('GET', '/blueprints/GCP-Basics-Simple-Service-Setup', req => {
            req.reply({ id: 'GCP-Basics-Simple-Service-Setup', state: 'uploaded' });
        });

        cy.interceptSp('GET', '/blueprints/Kubernetes-GCP-GKE', req => {
            req.reply({ id: 'Kubernetes-GCP-GKE', state: 'uploaded' });
        });

        cy.get('.modal button').contains('AWS').click();
        cy.get('.modal button').contains('GCP').click();
        cy.get('.modal button').contains('Terraform on AWS').click();
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('AWS + Terraform on AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('GCP Secrets');
        cy.get('.modal [name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
        cy.get('.modal [name="gpc_client_email"]').type('some_gpc_client_email');
        cy.get('.modal [name="gpc_client_id"]').type('some_gpc_client_id');
        cy.get('.modal [name="gpc_project_id"]').type('some_gpc_project_id');
        cy.get('.modal [name="gpc_private_key_id"]').type('some_gpc_private_key_id');
        cy.get('.modal [name="gpc_private_key"]').type('some_gpc_private_key');
        cy.get('.modal [name="gpc_zone"]').type('some_gpc_zone');
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('Summary');

        cy.get('.modal .item').contains(/cloudify-aws-plugin.*plugin will be installed/);
        cy.get('.modal .item').contains(/cloudify-utilities-plugin.*plugin will be installed/);
        cy.get('.modal .item').contains(/cloudify-kubernetes-plugin.*plugin will be installed/);
        cy.get('.modal .item').contains(/cloudify-terraform-plugin.*plugin will be installed/);
        cy.get('.modal .item').contains(/cloudify-gcp-plugin.*plugin will be installed/);
        cy.get('.modal .item').contains(/cloudify-ansible-plugin.*plugin will be installed/);

        cy.get('.modal .item').contains(/gpc_client_x509_cert_url.*secret will be created/);
        cy.get('.modal .item').contains(/gpc_client_email.*secret will be created/);
        cy.get('.modal .item').contains(/gpc_client_id.*secret will be created/);
        cy.get('.modal .item').contains(/gpc_project_id.*secret will be created/);
        cy.get('.modal .item').contains(/gpc_private_key_id.*secret will be created/);
        cy.get('.modal .item').contains(/gpc_private_key.*secret will be created/);
        cy.get('.modal .item').contains(/gpc_zone.*secret will be created/);
        cy.get('.modal .item').contains(/aws_access_key_id.*secret will be created/);
        cy.get('.modal .item').contains(/aws_secret_access_key.*secret will be created/);

        cy.get('.modal .item').contains(/AWS-Basics-VM-Setup.*blueprint will be uploaded/);
        cy.get('.modal .item').contains(/AWS-VM-Setup-using-CloudFormation.*blueprint will be uploaded/);
        cy.get('.modal .item').contains(/Kubernetes-AWS-EKS.*blueprint will be uploaded/);
        cy.get('.modal .item').contains(/AWS-VM-Setup-using-Terraform.*blueprint will be uploaded/);
        cy.get('.modal .item').contains(/GCP-Basics-VM-Setup.*blueprint will be uploaded/);
        cy.get('.modal .item').contains(/GCP-Basics-Simple-Service-Setup.*blueprint will be uploaded/);
        cy.get('.modal .item').contains(/Kubernetes-GCP-GKE.*blueprint will be uploaded/);

        cy.get('.modal button').contains('Finish').click();

        cy.get('.modal .progress .progress').contains('100%');
        cy.get('.modal .progress .label').contains('Installation done!');
        cy.get('button:not([disabled])').contains('Close').click();
    });

    it('requires all secrets to go to next step', () => {
        cy.interceptSp('GET', /^\/users\/\w+/, req => {
            req.reply({
                show_getting_started: true
            });
        });

        cy.intercept(
            'GET',
            '/console/external/content?url=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fplugins.json',
            req => {
                req.reply([]);
            }
        );

        // mocks listing: current plugins, secrets and blueprints

        cy.interceptSp('GET', '/plugins?_include=distribution,package_name,package_version,visibility', req => {
            req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
        });

        cy.interceptSp('GET', '/secrets?_include=key,visibility', req => {
            req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
        });

        cy.interceptSp(
            'GET',
            '/blueprints?_include=id%2Cdescription%2Cmain_file_name%2Ctenant_name%2Ccreated_at%2Cupdated_at%2Ccreated_by%2Cprivate_resource%2Cvisibility',
            req => {
                req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
            }
        );

        const gotoNextStep = () => cy.get('.modal button').contains('Next').click();

        const checkErrorMessage = () => {
            gotoNextStep();
            cy.get('.modal .message').contains('All secret values need to be specified');
        };

        cy.get('.modal button').contains('AWS').click();
        cy.get('.modal button').contains('GCP').click();
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('AWS Secrets');
        checkErrorMessage();
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        checkErrorMessage();
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoNextStep();

        cy.get('.modal .header').contains('GCP Secrets');
        checkErrorMessage();
        cy.get('.modal [name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
        checkErrorMessage();
        cy.get('.modal [name="gpc_client_email"]').type('some_gpc_client_email');
        checkErrorMessage();
        cy.get('.modal [name="gpc_client_id"]').type('some_gpc_client_id');
        checkErrorMessage();
        cy.get('.modal [name="gpc_project_id"]').type('some_gpc_project_id');
        checkErrorMessage();
        cy.get('.modal [name="gpc_private_key_id"]').type('some_gpc_private_key_id');
        checkErrorMessage();
        cy.get('.modal [name="gpc_private_key"]').type('some_gpc_private_key');
        checkErrorMessage();
        cy.get('.modal [name="gpc_zone"]').type('some_gpc_zone');
        gotoNextStep();

        cy.get('.modal .header').contains('Summary');
    });

    it('should diplay information about not available plugins', () => {
        cy.interceptSp('GET', /^\/users\/\w+/, req => {
            req.reply({
                show_getting_started: true
            });
        });

        cy.intercept(
            'GET',
            '/console/external/content?url=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fplugins.json',
            req => {
                req.reply([]);
            }
        );

        // mocks listing: current plugins, secrets and blueprints

        cy.interceptSp('GET', '/plugins?_include=distribution,package_name,package_version,visibility', req => {
            req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
        });

        cy.interceptSp('GET', '/secrets?_include=key,visibility', req => {
            req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
        });

        cy.interceptSp(
            'GET',
            '/blueprints?_include=id%2Cdescription%2Cmain_file_name%2Ctenant_name%2Ccreated_at%2Cupdated_at%2Ccreated_by%2Cprivate_resource%2Cvisibility',
            req => {
                req.reply({ metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] });
            }
        );

        const gotoNextStep = () => cy.get('.modal button').contains('Next').click();

        cy.get('.modal button').contains('AWS').click();
        cy.get('.modal button').contains('Next').click();

        cy.get('.modal .header').contains('AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoNextStep();

        cy.get('.modal .header').contains('Summary');
        cy.get('.modal .item').contains(/cloudify-aws-plugin.*plugin is not found in catalog and manager/);
        cy.get('.modal .item').contains(/cloudify-utilities-plugin.*plugin is not found in catalog and manager/);
        cy.get('.modal .item').contains(/cloudify-kubernetes-plugin.*plugin is not found in catalog and manager/);
    });

    it('should keep button and field states for navigating beetwen steps', () => {
        cy.interceptSp('GET', /^\/users\/\w+/, req => {
            req.reply({
                show_getting_started: true
            });
        });

        cy.intercept(
            'GET',
            '/console/external/content?url=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fplugins.json',
            req => {
                req.reply([]);
            }
        );

        const gotoBackStep = () => cy.get('.modal button').contains('Back').click();
        const gotoNextStep = () => cy.get('.modal button').contains('Next').click();

        cy.get('.modal button').contains('AWS').click();
        cy.get('.modal button.active').contains('AWS');
        gotoNextStep();

        cy.get('.modal .header').contains('AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoBackStep();

        cy.get('.modal .header').contains('Getting Started');
        cy.get('.modal button').contains('GCP').click();
        cy.get('.modal button.active').contains('AWS');
        cy.get('.modal button.active').contains('GCP');
        gotoNextStep();

        cy.get('.modal .header').contains('AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').should('have.value', 'some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').should('have.value', 'some_aws_secret_access_key');
        gotoNextStep();

        cy.get('.modal .header').contains('GCP Secrets');
        cy.get('.modal [name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
        cy.get('.modal [name="gpc_client_email"]').type('some_gpc_client_email');
        cy.get('.modal [name="gpc_client_id"]').type('some_gpc_client_id');
        cy.get('.modal [name="gpc_project_id"]').type('some_gpc_project_id');
        cy.get('.modal [name="gpc_private_key_id"]').type('some_gpc_private_key_id');
        cy.get('.modal [name="gpc_private_key"]').type('some_gpc_private_key');
        cy.get('.modal [name="gpc_zone"]').type('some_gpc_zone');
        gotoBackStep();

        cy.get('.modal .header').contains('AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').should('have.value', 'some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').should('have.value', 'some_aws_secret_access_key');
        gotoNextStep();

        cy.get('.modal .header').contains('GCP Secrets');
        cy.get('.modal [name="gpc_client_x509_cert_url"]').should('have.value', 'some_gpc_client_x509_cert_url');
        cy.get('.modal [name="gpc_client_email"]').should('have.value', 'some_gpc_client_email');
        cy.get('.modal [name="gpc_client_id"]').should('have.value', 'some_gpc_client_id');
        cy.get('.modal [name="gpc_project_id"]').should('have.value', 'some_gpc_project_id');
        cy.get('.modal [name="gpc_private_key_id"]').should('have.value', 'some_gpc_private_key_id');
        cy.get('.modal [name="gpc_private_key"]').should('have.value', 'some_gpc_private_key');
        cy.get('.modal [name="gpc_zone"]').should('have.value', 'some_gpc_zone');
    });
});
