describe('Getting started modal', () => {
    before(() => {
        cy.usePageMock().activate().login(undefined, undefined, true, false);
    });

    beforeEach(() => {
        cy.deletePlugins();
        cy.deleteSecrets();
        cy.deleteDeployments('', true);
        cy.deleteBlueprints('', true);
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
                req.reply({
                    id: '471ba867-5188-4ecc-b4f9-0a30883ef9f6',
                    visibility: 'tenant',
                    archive_name: 'cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
                    distribution: 'centos',
                    distribution_release: 'core',
                    distribution_version: '7.9.2009',
                    excluded_wheels: null,
                    package_name: 'cloudify-aws-plugin',
                    package_source: '.',
                    package_version: '2.8.0',
                    supported_platform: 'linux_x86_64',
                    supported_py_versions: ['py27', 'py36'],
                    uploaded_at: '2021-05-06T10:22:55.590Z',
                    wheels: [
                        'six-1.15.0-py2.py3-none-any.whl',
                        'monotonic-1.6-py2.py3-none-any.whl',
                        'idna-2.10-py2.py3-none-any.whl',
                        'pycryptodome-3.9.7-cp27-cp27mu-linux_x86_64.whl',
                        'wheel-0.36.2-py2.py3-none-any.whl',
                        'retrying-1.3.3-py2-none-any.whl',
                        'futures-3.3.0-py2-none-any.whl',
                        'cloudify_common-5.2.0-py3-none-any.whl',
                        'retrying-1.3.3-py3-none-any.whl',
                        'fasteners-0.13.0-py2.py3-none-any.whl',
                        'pycryptodome-3.9.7-cp36-cp36m-manylinux1_x86_64.whl',
                        'certifi-2020.12.5-py2.py3-none-any.whl',
                        'cloudify_common-5.2.0-py2-none-any.whl',
                        'pika-1.1.0-py2.py3-none-any.whl',
                        'MarkupSafe-1.1.1-cp36-cp36m-manylinux2010_x86_64.whl',
                        'pika-0.11.2-py2.py3-none-any.whl',
                        'bottle-0.12.18-py2-none-any.whl',
                        'python_dateutil-2.8.1-py2.py3-none-any.whl',
                        'proxy_tools-0.1.0-py2-none-any.whl',
                        'proxy_tools-0.1.0-py3-none-any.whl',
                        'requests-2.25.1-py2.py3-none-any.whl',
                        'cloudify_aws_plugin-2.8.0-py3-none-any.whl',
                        'cloudify_aws_plugin-2.8.0-py2-none-any.whl',
                        'jmespath-0.10.0-py2.py3-none-any.whl',
                        'botocore-1.20.49-py2.py3-none-any.whl',
                        'bottle-0.12.18-py3-none-any.whl',
                        'boto3-1.12.13-py2.py3-none-any.whl',
                        's3transfer-0.3.6-py2.py3-none-any.whl',
                        'Jinja2-2.10.3-py2.py3-none-any.whl',
                        'MarkupSafe-1.1.1-cp27-cp27mu-linux_x86_64.whl',
                        'requests_toolbelt-0.8.0-py2.py3-none-any.whl',
                        'chardet-4.0.0-py2.py3-none-any.whl',
                        'wagon-0.11.0-py2.py3-none-any.whl',
                        'urllib3-1.26.4-py2.py3-none-any.whl'
                    ],
                    title: 'AWS',
                    tenant_name: 'default_tenant',
                    created_by: 'admin',
                    resource_availability: 'tenant',
                    private_resource: false,
                    installation_state: [],
                    file_server_path: '',
                    yaml_url_path: 'plugin:cloudify-aws-plugin?version=2.8.0&distribution=centos'
                });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Utilities&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Fpluginlogo.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fcloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
            req => {
                req.reply({
                    id: '7be1e257-1f8f-48f6-9b6b-5447a3432018',
                    visibility: 'tenant',
                    archive_name: 'cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
                    distribution: 'centos',
                    distribution_release: 'core',
                    distribution_version: '7.9.2009',
                    excluded_wheels: null,
                    package_name: 'cloudify-utilities-plugin',
                    package_source: '.',
                    package_version: '1.24.4',
                    supported_platform: 'linux_x86_64',
                    supported_py_versions: ['py27', 'py36'],
                    uploaded_at: '2021-05-06T10:22:49.068Z',
                    wheels: [
                        'ipaddress-1.0.23-py2.py3-none-any.whl',
                        'six-1.15.0-py2.py3-none-any.whl',
                        'decorator-4.4.2-py2.py3-none-any.whl',
                        'cffi-1.14.5-cp27-cp27mu-linux_x86_64.whl',
                        'monotonic-1.6-py2.py3-none-any.whl',
                        'bcrypt-3.1.7-cp27-cp27mu-linux_x86_64.whl',
                        'pycparser-2.20-py2.py3-none-any.whl',
                        'idna-2.10-py2.py3-none-any.whl',
                        'PyNaCl-1.4.0-cp35-abi3-manylinux1_x86_64.whl',
                        'PyYAML-5.4.1-cp36-cp36m-manylinux1_x86_64.whl',
                        'xmltodict-0.12.0-py2.py3-none-any.whl',
                        'wheel-0.36.2-py2.py3-none-any.whl',
                        'retrying-1.3.3-py2-none-any.whl',
                        'ruamel.yaml-0.16.13-py2.py3-none-any.whl',
                        'cloudify_utilities_plugins_sdk-0.0.35-py2-none-any.whl',
                        'cloudify_common-5.2.0-py3-none-any.whl',
                        'ruamel.yaml.clib-0.2.2-cp27-cp27mu-linux_x86_64.whl',
                        'retrying-1.3.3-py3-none-any.whl',
                        'fasteners-0.13.0-py2.py3-none-any.whl',
                        'cloudify_utilities_plugin-1.24.4-py3-none-any.whl',
                        'certifi-2020.12.5-py2.py3-none-any.whl',
                        'cloudify_common-5.2.0-py2-none-any.whl',
                        'pika-1.1.0-py2.py3-none-any.whl',
                        'MarkupSafe-1.1.1-cp36-cp36m-manylinux2010_x86_64.whl',
                        'pika-0.11.2-py2.py3-none-any.whl',
                        'bottle-0.12.18-py2-none-any.whl',
                        'cryptography-3.2.1-cp35-abi3-manylinux2010_x86_64.whl',
                        'proxy_tools-0.1.0-py2-none-any.whl',
                        'proxy_tools-0.1.0-py3-none-any.whl',
                        'GitPython-2.1.15-py2.py3-none-any.whl',
                        'requests-2.25.1-py2.py3-none-any.whl',
                        'bcrypt-3.2.0-cp36-abi3-manylinux2010_x86_64.whl',
                        'cffi-1.14.5-cp36-cp36m-manylinux1_x86_64.whl',
                        'gitdb-0.6.4-cp27-cp27mu-linux_x86_64.whl',
                        'smmap2-3.0.1-py2-none-any.whl',
                        'networkx-1.9.1-py2.py3-none-any.whl',
                        'ruamel.yaml.clib-0.2.2-cp36-cp36m-manylinux1_x86_64.whl',
                        'cloudify_utilities_plugins_sdk-0.0.35-py3-none-any.whl',
                        'enum34-1.1.10-py2-none-any.whl',
                        'paramiko-2.7.2-py2.py3-none-any.whl',
                        'bottle-0.12.18-py3-none-any.whl',
                        'PyYAML-5.4.1-cp27-cp27mu-linux_x86_64.whl',
                        'smmap-3.0.5-py2.py3-none-any.whl',
                        'cloudify_utilities_plugin-1.24.4-py2-none-any.whl',
                        'Jinja2-2.10.3-py2.py3-none-any.whl',
                        'MarkupSafe-1.1.1-cp27-cp27mu-linux_x86_64.whl',
                        'requests_toolbelt-0.8.0-py2.py3-none-any.whl',
                        'pycdlib-1.11.0-py2.py3-none-any.whl',
                        'chardet-4.0.0-py2.py3-none-any.whl',
                        'urllib3-1.24.3-py2.py3-none-any.whl',
                        'GitPython-3.1.14-py3-none-any.whl',
                        'PyNaCl-1.4.0-cp27-cp27mu-linux_x86_64.whl',
                        'cryptography-3.2.1-cp27-cp27mu-linux_x86_64.whl',
                        'wagon-0.11.0-py2.py3-none-any.whl',
                        'decorator-5.0.6-py3-none-any.whl',
                        'gitdb-4.0.7-py3-none-any.whl',
                        'ruamel.ordereddict-0.4.15-cp27-cp27mu-linux_x86_64.whl',
                        'gitdb2-2.0.6-py2.py3-none-any.whl'
                    ],
                    title: 'Utilities',
                    tenant_name: 'default_tenant',
                    created_by: 'admin',
                    resource_availability: 'tenant',
                    private_resource: false,
                    installation_state: [],
                    file_server_path: '',
                    yaml_url_path: 'plugin:cloudify-utilities-plugin?version=1.24.4&distribution=centos'
                });
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Kubernetes&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2020%2F07%2Fkube-icon.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fcloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
            req => {
                req.reply({
                    id: 'b3ae9933-32f3-4440-b121-5b3a44588442',
                    visibility: 'tenant',
                    archive_name: 'cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
                    distribution: 'centos',
                    distribution_release: 'core',
                    distribution_version: '7.9.2009',
                    excluded_wheels: null,
                    package_name: 'cloudify-kubernetes-plugin',
                    package_source: '.',
                    package_version: '2.12.1',
                    supported_platform: 'linux_x86_64',
                    supported_py_versions: ['py36'],
                    uploaded_at: '2021-05-06T10:22:45.687Z',
                    wheels: [
                        'pyparsing-2.4.7-py2.py3-none-any.whl',
                        'websocket_client-0.58.0-py2.py3-none-any.whl',
                        'six-1.15.0-py2.py3-none-any.whl',
                        'oauthlib-3.1.0-py2.py3-none-any.whl',
                        'monotonic-1.6-py2.py3-none-any.whl',
                        'cloudify_python_importer-0.2-py3-none-any.whl',
                        'idna-2.10-py2.py3-none-any.whl',
                        'PyYAML-5.4.1-cp36-cp36m-manylinux1_x86_64.whl',
                        'pyasn1_modules-0.1.5-py2.py3-none-any.whl',
                        'pyasn1-0.1.7-py3-none-any.whl',
                        'wheel-0.36.2-py2.py3-none-any.whl',
                        'kubernetes-12.0.1-py2.py3-none-any.whl',
                        'cloudify_kubernetes_plugin-2.12.1-py3-none-any.whl',
                        'pyasn1_modules-0.0.5-py3-none-any.whl',
                        'httplib2-0.19.1-py3-none-any.whl',
                        'cloudify_common-5.2.0-py3-none-any.whl',
                        'retrying-1.3.3-py3-none-any.whl',
                        'fasteners-0.13.0-py2.py3-none-any.whl',
                        'rsa-4.7.2-py3-none-any.whl',
                        'decorator-5.0.7-py3-none-any.whl',
                        'certifi-2020.12.5-py2.py3-none-any.whl',
                        'pika-1.1.0-py2.py3-none-any.whl',
                        'MarkupSafe-1.1.1-cp36-cp36m-manylinux2010_x86_64.whl',
                        'python_dateutil-2.8.1-py2.py3-none-any.whl',
                        'pyasn1-0.4.8-py2.py3-none-any.whl',
                        'proxy_tools-0.1.0-py3-none-any.whl',
                        'requests-2.25.1-py2.py3-none-any.whl',
                        'setuptools-56.0.0-py3-none-any.whl',
                        'oauth2client-4.1.3-py2.py3-none-any.whl',
                        'networkx-1.9.1-py2.py3-none-any.whl',
                        'cachetools-4.2.2-py3-none-any.whl',
                        'google_auth-1.27.0-py2.py3-none-any.whl',
                        'bottle-0.12.18-py3-none-any.whl',
                        'Jinja2-2.10.3-py2.py3-none-any.whl',
                        'requests_toolbelt-0.8.0-py2.py3-none-any.whl',
                        'chardet-4.0.0-py2.py3-none-any.whl',
                        'requests_oauthlib-1.3.0-py2.py3-none-any.whl',
                        'wagon-0.11.0-py2.py3-none-any.whl',
                        'urllib3-1.26.4-py2.py3-none-any.whl'
                    ],
                    title: 'Kubernetes',
                    tenant_name: 'default_tenant',
                    created_by: 'admin',
                    resource_availability: 'tenant',
                    private_resource: false,
                    installation_state: [],
                    file_server_path: '',
                    yaml_url_path: 'plugin:cloudify-kubernetes-plugin?version=2.12.1&distribution=centos'
                });
            }
        );

        // mocks secrets creating

        cy.interceptSp('PUT', '/secrets/aws_access_key_id', req => {
            // {"value":"test","visibility":"tenant","is_hidden_value":true}
            req.reply({
                visibility: 'tenant',
                created_at: '2021-05-06T10:22:42.191Z',
                value:
                    'gAAAAABgk8Ny-KBKEoSZ6e6wtvb-1aBwsucOLRVmxqueP0ZNej-Ok4H1Xem70qGL6bZJs9awwxYRWKb_NDT_1UOBlql7_pUYTg==',
                updated_at: '2021-05-06T10:22:42.191Z',
                is_hidden_value: true,
                key: 'aws_access_key_id',
                tenant_name: 'default_tenant',
                created_by: 'admin',
                resource_availability: 'tenant',
                private_resource: false
            });
        });

        cy.interceptSp('PUT', '/secrets/aws_secret_access_key', req => {
            // {"value":"test","visibility":"tenant","is_hidden_value":true}
            req.reply({
                visibility: 'tenant',
                created_at: '2021-05-06T10:22:42.193Z',
                value:
                    'gAAAAABgk8NyStgN2GSidjwc-ROpzZ5QPGCFK-LEWZKE5B0OL0eWEieWHkUctw86l2KdEIobfxuwAhKu7zQ0p8iQYpIjl5sNVg==',
                updated_at: '2021-05-06T10:22:42.193Z',
                is_hidden_value: true,
                key: 'aws_secret_access_key',
                tenant_name: 'default_tenant',
                created_by: 'admin',
                resource_availability: 'tenant',
                private_resource: false
            });
        });

        // mocks blueprints uploading

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-Basics-VM-Setup?visibility=tenant&async_upload=true&application_file_name=aws.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            req => {
                req.reply({
                    id: 'AWS-Basics-VM-Setup',
                    visibility: 'tenant',
                    created_at: '2021-05-06T10:22:55.897Z',
                    main_file_name: null,
                    plan: null,
                    updated_at: '2021-05-06T10:22:55.897Z',
                    description: null,
                    is_hidden: false,
                    state: 'pending',
                    error: null,
                    error_traceback: null,
                    tenant_name: 'default_tenant',
                    created_by: 'admin',
                    resource_availability: 'tenant',
                    private_resource: false,
                    labels: []
                });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-VM-Setup-using-CloudFormation?visibility=tenant&async_upload=true&application_file_name=aws-cloudformation.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            req => {
                req.reply({
                    id: 'AWS-VM-Setup-using-CloudFormation',
                    visibility: 'tenant',
                    created_at: '2021-05-06T10:22:55.906Z',
                    main_file_name: null,
                    plan: null,
                    updated_at: '2021-05-06T10:22:55.906Z',
                    description: null,
                    is_hidden: false,
                    state: 'pending',
                    error: null,
                    error_traceback: null,
                    tenant_name: 'default_tenant',
                    created_by: 'admin',
                    resource_availability: 'tenant',
                    private_resource: false,
                    labels: []
                });
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/Kubernetes-AWS-EKS?visibility=tenant&async_upload=true&application_file_name=blueprint.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fkubernetes-aws-eks.zip',
            req => {
                req.reply({
                    id: 'Kubernetes-AWS-EKS',
                    visibility: 'tenant',
                    created_at: '2021-05-06T10:22:55.900Z',
                    main_file_name: null,
                    plan: null,
                    updated_at: '2021-05-06T10:22:55.900Z',
                    description: null,
                    is_hidden: false,
                    state: 'pending',
                    error: null,
                    error_traceback: null,
                    tenant_name: 'default_tenant',
                    created_by: 'admin',
                    resource_availability: 'tenant',
                    private_resource: false,
                    labels: []
                });
            }
        );

        // mocks blueprints status

        cy.interceptSp('GET', '/blueprints/AWS-Basics-VM-Setup', req => {
            req.reply({
                state: 'uploaded'
            });
        });

        cy.interceptSp('GET', '/blueprints/AWS-VM-Setup-using-CloudFormation', req => {
            req.reply({
                state: 'uploaded'
            });
        });

        cy.interceptSp('GET', '/blueprints/Kubernetes-AWS-EKS', req => {
            req.reply({
                state: 'uploaded'
            });
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
