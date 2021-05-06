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

    it('should provide to install selected technology', () => {
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
});
