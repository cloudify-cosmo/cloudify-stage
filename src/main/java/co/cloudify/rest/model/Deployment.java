package co.cloudify.rest.model;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
public class Deployment {
	@XmlElement
	private String id;
	@XmlElement
	private Map<String, Object> inputs;
	@XmlElement
	private Map<String, Object> outputs;
	@XmlElement(name = "created_at")
	private Date createdAt;
	@XmlElement(name = "created_by")
	private String createdBy;
	@XmlElement(name = "updated_at")
	private Date updatedAt;
	@XmlElement
	private String permalink;
	@XmlElement(name = "site_name")
	private String siteName;
	@XmlElement(name = "tenant_name")
	private String tenantName;
	@XmlElement
	private String description;
	@XmlElement(name = "blueprint_id")
	private String blueprintId;
	@XmlElement(name = "policy_types")
	private Object policyTypes;
	@XmlElement
	private Visibility visibility;
	@XmlElement(name = "policy_triggers")
	private Map<String, Object> policyTriggers;
	@XmlElement(name = "private_resource")
	private boolean privateResource;
	@XmlElement(name = "resource_availability")
	private ResourceAvailability resourceAvailability;
	@XmlElement
	private Map<String, Object> capabilities;
	@XmlElement
	private Object groups;
	@XmlElement
	private List<Object> workflows;
	@XmlElement(name = "scaling_groups")
	private Map<String, Object> scalingGroups;
	
	public String getId() {
		return id;
	}
	
	public Map<String, Object> getInputs() {
		return inputs;
	}
	
	public Map<String, Object> getOutputs() {
		return outputs;
	}
	
	public Map<String, Object> getCapabilities() {
		return capabilities;
	}
	
	@Override
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", id)
				.append("blueprintId", blueprintId)
				.toString();
	}
}
