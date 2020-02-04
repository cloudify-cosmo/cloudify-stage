package co.cloudify.rest.model;

import java.util.List;
import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import co.cloudify.rest.model.helpers.BlueprintInput;

@XmlRootElement
public class BlueprintPlan {
	@XmlElement
	private	Map<String, BlueprintInput> inputs;
	@XmlElement
	private Map<Object, Object> relationships;
	@XmlElement
	private String description;
	@XmlElement(name = "deployment_plugins_to_install")
	private List<Object> deploymentPluginsToInstall;
	@XmlElement(name = "host_agent_plugins_to_install")
	private List<Object> hostAgentPluginsToInstall;
	@XmlElement(name = "workflow_plugins_to_install")
	private List<Object> workflowPluginsToInstall;
	@XmlElement(name = "policy_types")
	private Map<String, Object> policyTypes;
	@XmlElement
	private Map<String, Object> outputs;
	@XmlElement
	private Map<String, Object> capabilities;
	@XmlElement(name = "policy_triggers")
	private Object policyTriggers;
	@XmlElement(name = "version")
	private Map<String, Object> version;
	@XmlElement(name = "data_types")
	private Map<String, Object> dataTypes;
	@XmlElement
	private Object groups;
	@XmlElement
	private Map<String, Object> workflows;
	@XmlElement(name = "imported_blueprints")
	private List<Object> importedBlueprints;
	@XmlElement(name = "namespaces_mapping")
	private Map<String, Object> namespacesMapping;
	@XmlElement
	private List<Object> nodes;
	@XmlElement
	private Map<String, Object> metadata;
	@XmlElement(name = "scaling_groups")
	private Map<String, Object> scalingGroups;
	@XmlElement
	private Map<String, Object> policies;

	public Map<String, BlueprintInput> getInputs() {
		return inputs;
	}
}
