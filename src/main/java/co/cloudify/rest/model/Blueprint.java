package co.cloudify.rest.model;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

/**
 * Note: this class will probably be auto-generated soon, so please
 * don't add any methods to it. It should only contain model fields,
 * getters and setters.
 * 
 * @author	Isaac Shabtay
 */
@XmlRootElement
public class Blueprint {
	private String id;
	@XmlElement(name = "created_at")
	private Date createdAt;
	@XmlElement(name = "created_by")
	private String createdBy;
	@XmlElement(name = "updated_at")
	private Date updatedAt;
	@XmlElement(name = "main_file_name")
	private String mainFileName;
	@XmlElement(name = "tenant_name")
	private String tenantName;
	@XmlElement
	private BlueprintPlan plan;
	private String description;
	@XmlElement(name = "private_resource")
	private boolean privateResource;
	@XmlElement(name = "resource_availability")
	private String resourceAvailability;
	@XmlElement
	private String visibility;
	@XmlElement(name = "is_hidden")
	private boolean hidden;

	public Blueprint() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getMainFileName() {
		return mainFileName;
	}

	public void setMainFileName(String mainFileName) {
		this.mainFileName = mainFileName;
	}

	public BlueprintPlan getPlan() {
		return plan;
	}

	public void setPlan(BlueprintPlan plan) {
		this.plan = plan;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	@Override
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", id)
				.toString();
	}
}
