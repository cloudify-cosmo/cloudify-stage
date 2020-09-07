--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

--
-- Data for Name: Applications; Type: TABLE DATA; Schema: public; Owner: cloudify
--

COPY "Applications" (id, name, status, "isPrivate", extras, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: Applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cloudify
--

SELECT pg_catalog.setval('"Applications_id_seq"', 1, false);


--
-- Data for Name: BlueprintAdditions; Type: TABLE DATA; Schema: public; Owner: cloudify
--

COPY "BlueprintAdditions" (id, "blueprintId", image, "imageUrl", "createdAt", "updatedAt") FROM stdin;
1	empty	\\x474946383761a0005000a50000648a64b4c6b48caa8cdce6dc749a74c4d6c4a4baa4f4f6f4d4ded484a2846c926ceceeec94b294bccebcccd6ccacc2ac6c8e6ce4eee47c9a7cacbeacfcfefcdce2dc8ca68c9cb29c648e64bccabce4eae4a4bea4fcfafcd4e2d484a684749674f4f2f4ccdaccb4cab494ae94dce6e4749a7cc4d6ccf4faf46c9674ecf2ec94b29cc4d2c47c9e7c9cb69c648e6ca4beacd4e2dc84a68cccdad40000000000000000000000000000000000000000000000000000000000000000000000000000002c00000000a00050000006fe408a70482c1a8fc8a472c96c3a9fd0a8744aad5aafd8ac76cbed7abfe0b0784c2e9bcfe8b47acd6ebbdff0b87c4eafdbeff8bc7ecfeffbff808182838485868788898a8b8c8d8e8f90771a2b220b0891871a060a1206011a1b160629481c1a08080b98740b230a0f1a461a2d0d441a0f0800baba2521ab70222e13274a0823070809bb0dbbbb19841c010c08030b1c76171fb14c032c0acd2b2818cd00a481212be4002311731509074f2410bc0543ccbb228220e9ea002b7134a88a6201c003231376a91074a09f3f5f6e422888172585836d443aec1230e55a1b0100f015805182822e146e382870602484054e090418f04824840b8a431634d8d901cafe020fbb3e189071e6c0019021430ac97542578536011218190160d4100ea88c28085004a82e034e388458b0a2acd915214094b9008ec5900aba4cd662a3e0121103068d70f8a0f6ae04220e01f46492e25be06628c9b868b6b366dcb96a107c28320080db232df4117100601bdc5d1e9c140cc922c481131a449400c0714c2e70c4ae7e23cae601582254211a09d0a2c80200fa4e7cdbd58e49885da68d38801c066f330645346e70338239856f3429bf28d2b4c501090e4d88467e82c4403431c8892792906b9b047687002889c4c16022ac95e13bd8e400e27e10b4604e19cbedd4d8101904a0cb006eb0109f10044c7644060f0ae1df70e9f446010715fe3450dc11af2dd38c0b1586319c2e9709b1dc0af674e14f5c470840db100a623444082c6427c467ba34e0c20b027ce04c120aeee2420548ed729e181234d31a05c7edb2de1667918384019a11d142023471f080007d1541d532e390a3e111ce5936c409e9e9021d192d38394493bbdc4625004f2c000388236c90410b23b084c4893d36c3420b8262b6cb7d14a4b00b066568d00c06301cc0a32e031633c2070a84d0428943a4f3844a3a128113123ae103000a303ce0c0874a24a44b6cf2ed62c603eaa89ad7120b08f00009d71cd0400209306884a84f5c60dd1329d0e3810629d0fa8443994aaa0ba46688408eaa4f26318001a70e818004cf1481ac13fe2994106e7fab7d206d141c1808eb0006324a460a2f2c9614002dbc7b047f489c30827ba102e001042eb030c1bae68e50aa1229b0000006364ef1c22e1634b0409cbbcc8806090578c8b011e52e310d7e8729f094120d38ecc402c3810aafc48cedf2261f001551f1863753104304297070008e002890298816787c440716a4a3f2161c170ac0427d688091580959a05ca24728b31d130178b0c0921cbe206448de759142032a08d02a097f5400eba3151e90e2d200fcd5df002e4020010b675f7b81bfbf2c9142ce148c4041032744c0b510008cbce1c4501ce0400b2c94f08128213c5c38132bab2844008fff7634114db9f0f91a199410ba120320bebafe1cc86ce0b9ce185c50cc0a3bcf1e060bbd1ff15d674224900146444370baef5f4c70e655a723b0da04b5e2d98c02c6322f4661ef6630ce74b80120d5101a6ca7c00a0a241080e4da6f611b65007c608206af6ba040fb7124f03a05e99813a61012b017fed4f0812551e0001f08c0023290bd21006c806b48800053d0020f3c4e08cf83601a1e90c125e049836c406003952029d981100d8ebbdd102c528e13b221061280955e421081fdb9f00c2020000434f0b00c7cc301ecbbe1f62456001564c00121c8800ae801000218508868f0d26176f100c241318a2d031c0b18c0b82b7af18b600ca318c748c6329af18c684ca31ad7c8c636baf18d701c60100100003b		2020-09-04 09:23:26.637+00	2020-09-04 09:23:26.649+00
\.


--
-- Name: BlueprintAdditions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cloudify
--

SELECT pg_catalog.setval('"BlueprintAdditions_id_seq"', 1, true);


--
-- Data for Name: ClientConfigs; Type: TABLE DATA; Schema: public; Owner: cloudify
--

COPY "ClientConfigs" (id, "managerIp", config, "createdAt", "updatedAt") FROM stdin;
1	127.0.0.1	{"canUserEdit":true}	2020-09-04 09:16:36.397+00	2020-09-04 09:16:36.397+00
\.


--
-- Name: ClientConfigs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cloudify
--

SELECT pg_catalog.setval('"ClientConfigs_id_seq"', 1, true);


--
-- Data for Name: Resources; Type: TABLE DATA; Schema: public; Owner: cloudify
--

COPY "Resources" (id, "resourceId", type, creator, "createdAt", "updatedAt", data) FROM stdin;
1	t2	template	admin	2020-09-04 09:17:11.722+00	2020-09-04 09:17:11.722+00	{"roles": ["sys_admin"], "tenants": ["*"]}
2	new_test	page	admin	2020-09-04 09:17:18.171+00	2020-09-04 09:17:18.171+00	\N
3	testWidget	widget	admin	2020-09-04 09:17:56.212+00	2020-09-04 09:17:56.212+00	\N
\.


--
-- Name: Resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cloudify
--

SELECT pg_catalog.setval('"Resources_id_seq"', 3, true);


--
-- Data for Name: UserApps; Type: TABLE DATA; Schema: public; Owner: cloudify
--

COPY "UserApps" (id, "managerIp", username, "appDataVersion", mode, "appData", "createdAt", "updatedAt", tenant) FROM stdin;
1	127.0.0.1	admin	4	main	{"pages":[{"id":"dashboard","name":"Dashboard","description":"","widgets":[{"id":"ca85e811-b581-41e1-b3b7-676f8a95f432","name":"Deployment Wizard Buttons","width":2,"height":11,"x":0,"y":0,"definition":"deploymentWizardButtons","configuration":{"showHelloWorldWizardButton":true,"helloWorldWizardButtonLabel":"Get started with the Hello World Wizard","showDeploymentWizardButton":true,"deploymentWizardButtonLabel":"Deployment Wizard"},"drillDownPages":{}},{"id":"06c59e7b-fab5-4609-a509-2359b193e13f","name":"Number of blueprints","width":2,"height":8,"x":2,"y":0,"definition":"blueprintNum","configuration":{"pollingTime":10,"page":"local_blueprints"},"drillDownPages":{}},{"id":"965e266e-f4ea-45ce-80cc-ea2adb512779","name":"Number of deployments","width":2,"height":8,"x":4,"y":0,"definition":"deploymentNum","configuration":{"pollingTime":10,"page":"deployments"},"drillDownPages":{}},{"id":"60d547d0-4173-44dc-8eda-c35836f90516","name":"Number of plugins","width":2,"height":8,"x":6,"y":0,"definition":"pluginsNum","configuration":{"pollingTime":30,"page":"system_resources"},"drillDownPages":{}},{"id":"27556a20-56f7-45f1-a271-cf8477964886","name":"Number of compute nodes","width":2,"height":8,"x":8,"y":0,"definition":"nodesComputeNum","configuration":{"pollingTime":30},"drillDownPages":{}},{"id":"c4586ebe-67a1-431b-bf32-0c80e5356a6c","name":"Number of running executions","width":2,"height":8,"x":10,"y":0,"definition":"executionNum","configuration":{"pollingTime":10},"drillDownPages":{}},{"id":"de094ae0-7e62-4247-a691-cf9b05a9d253","name":"Blueprint Upload Button","width":2,"height":3,"x":2,"y":8,"definition":"blueprintUploadButton","configuration":{},"drillDownPages":{}},{"id":"20e03184-3d80-436c-8a45-f0590cb7d4e1","name":"Deployment Button","width":2,"height":3,"x":4,"y":8,"definition":"deploymentButton","configuration":{},"drillDownPages":{}},{"id":"f52f72b3-256b-4449-9edb-c01039a6e3ec","name":"Plugin Upload Button","width":2,"height":3,"x":6,"y":8,"definition":"pluginUploadButton","configuration":{},"drillDownPages":{}},{"id":"292c8652-47fd-436d-ba44-5fed1899a0e8","name":"Filter","width":12,"height":3,"x":0,"y":11,"definition":"filter","configuration":{"pollingTime":10,"filterByBlueprints":true,"filterByDeployments":true,"filterByExecutions":false,"filterByNodes":false,"filterByNodeInstances":false,"allowMultipleSelection":false},"drillDownPages":{}},{"id":"fcb40c4d-43e3-4d1c-ab78-91a560120245","name":"Executions","width":12,"height":29,"x":0,"y":17,"definition":"executions","configuration":{"pollingTime":5,"pageSize":10,"fieldsToShow":["Blueprint","Deployment","Workflow","Created","Ended","Creator","Attributes","Actions","Status"],"showSystemExecutions":true,"sortColumn":"created_at","sortAscending":null},"drillDownPages":{}}]},{"id":"cloudify_catalog","name":"Cloudify Catalog","description":"","widgets":[{"id":"3e93fc30-95ef-43ad-b9d0-fe9e24f4130c","name":"Blueprints Catalog","width":12,"height":26,"x":0,"y":0,"definition":"blueprintCatalog","configuration":{"pageSize":3,"jsonPath":"//repository.cloudifysource.org/cloudify/blueprints/4.4/examples.json","username":"cloudify-examples","filter":"blueprint in:name NOT local","displayStyle":"catalog","sortColumn":"created_at","sortAscending":null},"drillDownPages":{}},{"id":"3fd49de8-a737-441b-b7f2-9eaaa763bf33","name":"Plugins Catalog","width":12,"height":24,"x":0,"y":0,"definition":"pluginsCatalog","configuration":{"jsonPath":"//repository.cloudifysource.org/cloudify/wagons/plugins.json"},"drillDownPages":{}},{"id":"5f838d55-1aa7-444f-80f4-8e29b40184c1","name":"Composer link","width":2,"height":5,"x":0,"y":25,"definition":"composerLink","configuration":{},"drillDownPages":{}}]},{"id":"local_blueprints","name":"Local Blueprints","description":"","widgets":[{"id":"6904d318-4cf6-4130-8e6e-5154dbd29db5","name":"Blueprints","width":12,"height":24,"x":0,"y":0,"definition":"blueprints","configuration":{"pollingTime":10,"pageSize":5,"clickToDrillDown":true,"displayStyle":"table","sortColumn":"created_at","sortAscending":null},"drillDownPages":{}},{"id":"43afc85b-deee-4fdd-b377-c54e50c8009f","name":"Composer link","width":2,"height":5,"x":0,"y":24,"definition":"composerLink","configuration":{},"drillDownPages":{}}]},{"id":"deployments","name":"Deployments","description":"","widgets":[{"id":"9c33b3e5-3316-49f8-8245-b6a091f6c95a","name":"Deployment Button","width":3,"height":3,"x":0,"y":0,"definition":"deploymentButton","configuration":{},"drillDownPages":{}},{"id":"75ed493d-cf13-4e21-873f-8120324c8769","name":"Filter","width":12,"height":3,"x":0,"y":3,"definition":"filter","configuration":{"pollingTime":10,"filterByBlueprints":true,"filterByDeployments":false,"filterByExecutions":false,"filterByNodes":false,"filterByNodeInstances":false,"allowMultipleSelection":false},"drillDownPages":{}},{"id":"9d070307-c789-418b-a842-7a80ac53687a","name":"Deployments","width":12,"height":40,"x":0,"y":7,"definition":"deployments","configuration":{"pollingTime":10,"pageSize":5,"clickToDrillDown":true,"showExecutionStatusLabel":false,"blueprintIdFilter":null,"displayStyle":"list","sortColumn":"created_at","sortAscending":null},"drillDownPages":{}}]},{"id":"tenant_management","name":"Tenant Management","description":"","widgets":[{"id":"dbadce2d-9442-46f3-9f95-59611d821a4f","name":"User Management","width":12,"height":20,"definition":"userManagement","configuration":{"pollingTime":30,"pageSize":5,"sortColumn":"username","sortAscending":true},"drillDownPages":{}},{"id":"58b76530-a29a-45bd-b034-37110d2fd1f4","name":"Tenants Management","width":12,"height":20,"definition":"tenants","configuration":{"pollingTime":30,"pageSize":5,"sortColumn":"name","sortAscending":true},"drillDownPages":{}},{"id":"6f4bfa75-302a-4233-90f6-bdbbe3c18029","name":"User Groups Management","width":12,"height":20,"definition":"userGroups","configuration":{"pollingTime":30,"pageSize":5,"sortColumn":"name","sortAscending":true},"drillDownPages":{}}]},{"id":"admin_operations","name":"Admin Operations","description":"","widgets":[{"id":"129ee990-5a7c-4b3c-a180-b5dba0336c0d","name":"Maintenance Mode Button","width":3,"height":3,"x":0,"y":0,"definition":"maintenanceModeButton","configuration":{},"drillDownPages":{}},{"id":"2c953686-f5cc-4c8a-9c7d-4e1be1b6670a","name":"Cluster management","width":12,"height":24,"x":0,"y":3,"definition":"highAvailability","configuration":{"pollingTime":30,"pageSize":5,"sortColumn":"name","sortAscending":true},"drillDownPages":{}},{"id":"d1c79607-edf4-4269-8b0b-7f1040cc7146","name":"Snapshots","width":12,"height":24,"x":0,"y":27,"definition":"snapshots","configuration":{"pollingTime":30,"pageSize":5,"sortColumn":"created_at","sortAscending":null},"drillDownPages":{}}]},{"id":"system_resources","name":"System Resources","description":"","widgets":[{"id":"6d4ea256-02f7-457b-93c2-ad6a40b42c37","name":"Plugins","width":12,"height":24,"x":0,"y":0,"definition":"plugins","configuration":{"pollingTime":30,"pageSize":5},"drillDownPages":{}},{"id":"cab7537f-c079-42c7-88d1-615ef6dd9eee","name":"Secret Store Management","width":12,"height":24,"x":0,"y":24,"definition":"secrets","configuration":{"pollingTime":30,"pageSize":5,"sortColumn":"key","sortAscending":true},"drillDownPages":{}},{"id":"8180f1ba-a30c-4927-b14a-a8b3487f107e","name":"Agents Management","width":12,"height":24,"x":0,"y":48,"definition":"agents","configuration":{"pollingTime":15,"fieldsToShow":["Id","Node","Deployment","IP","Install Method","System","Version","Actions"],"installMethods":[""]},"drillDownPages":{}}]},{"id":"statistics","name":"Statistics","description":"","widgets":[{"id":"f33cd908-9c9a-4408-8974-b0097ef6a8b1","name":"Nodes filter","width":8,"height":3,"x":0,"y":0,"definition":"filter","configuration":{"pollingTime":10,"filterByBlueprints":true,"filterByDeployments":true,"filterByExecutions":false,"filterByNodes":true,"filterByNodeInstances":true,"allowMultipleSelection":false},"drillDownPages":{}},{"id":"6749703a-8b83-4dfb-aa6d-d448b3113a62","name":"Time filter","width":4,"height":3,"x":8,"y":0,"definition":"timeFilter","configuration":{},"drillDownPages":{}},{"id":"0a1dd4e2-8b62-4078-8f67-827457bab9f4","name":"CPU Total User Graph","width":6,"height":17,"x":6,"y":7,"definition":"graph","configuration":{"pollingTime":5,"nodeFilter":{"blueprintId":"","deploymentId":"","nodeId":"","nodeInstanceId":""},"charts":{"0":{"metric":"cpu_total_user","label":"CPU Total User [%]"}},"query":null,"type":"line","timeFilter":{"range":"Last 15 Minutes","start":"now()-15m","end":"now()","resolution":1,"unit":"m"}},"drillDownPages":{}},{"id":"a0273c11-afa9-4abf-b2a6-ccc7383155ca","name":"Memory Free Graph","width":6,"height":17,"x":0,"y":7,"definition":"graph","configuration":{"pollingTime":5,"nodeFilter":{"blueprintId":"","deploymentId":"","nodeId":"","nodeInstanceId":""},"charts":{"0":{"metric":"memory_MemFree","label":"Memory [B]"}},"query":null,"type":"line","timeFilter":{"range":"Last 15 Minutes","start":"now()-15m","end":"now()","resolution":1,"unit":"m"}},"drillDownPages":{}},{"id":"47fbdeaf-3cc9-49db-bd5a-f6cdc0fe3e32","name":"CPU Total System Graph","width":6,"height":17,"x":0,"y":25,"definition":"graph","configuration":{"pollingTime":5,"nodeFilter":{"blueprintId":"","deploymentId":"","nodeId":"","nodeInstanceId":""},"charts":{"0":{"metric":"cpu_total_system","label":"CPU Total System [%]"}},"query":null,"type":"bar","timeFilter":{"range":"Last 15 Minutes","start":"now()-15m","end":"now()","resolution":1,"unit":"m"}},"drillDownPages":{}},{"id":"755bce21-3aba-4920-a2b8-570e823a36b9","name":"Load Average Graph","width":6,"height":17,"x":6,"y":25,"definition":"graph","configuration":{"pollingTime":5,"nodeFilter":{"blueprintId":"","deploymentId":"","nodeId":"","nodeInstanceId":""},"charts":{"0":{"metric":"loadavg_processes_running","label":"Running Load Average [%]"}},"query":null,"type":"line","timeFilter":{"range":"Last 15 Minutes","start":"now()-15m","end":"now()","resolution":1,"unit":"m"}},"drillDownPages":{}}]},{"id":"logs","name":"Logs","description":"","widgets":[{"id":"82b8d8dc-0403-47ad-8589-0690e7745b9e","name":"Resource Filter","width":12,"height":3,"x":0,"y":0,"definition":"filter","configuration":{"pollingTime":10,"filterByBlueprints":true,"filterByDeployments":true,"filterByExecutions":true,"filterByNodes":true,"filterByNodeInstances":true,"allowMultipleSelection":true},"drillDownPages":{}},{"id":"164ecbdf-d897-4556-aeca-4cfc3dac4a0b","name":"Events/logs filter widget","width":12,"height":5,"x":0,"y":5,"definition":"eventsFilter","configuration":{},"drillDownPages":{}},{"id":"88c2eb20-9961-4ccc-b0fd-050a2414107b","name":"Events and logs","width":12,"height":40,"x":0,"y":10,"definition":"events","configuration":{"pollingTime":2,"pageSize":15,"sortColumn":"timestamp","sortAscending":null,"fieldsToShow":["Icon","Timestamp","Blueprint","Deployment","Workflow","Operation","Node Id","Node Instance Id","Message"],"colorLogs":true,"maxMessageLength":200},"drillDownPages":{}}]},{"id":"page_0","name":"Page_0","description":"","widgets":[{"id":"ec139120-4b7e-419b-824f-95a0124d9612","name":"Test widget","width":2,"height":8,"x":0,"y":0,"definition":"testWidget","configuration":{"pollingTime":6},"drillDownPages":{}}]}]}	2020-09-04 09:16:41.851+00	2020-09-04 09:18:25.341+00	default_tenant
\.


--
-- Name: UserApps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cloudify
--

SELECT pg_catalog.setval('"UserApps_id_seq"', 1, true);


--
-- PostgreSQL database dump complete
--

