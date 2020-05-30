package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Execution implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    @XmlElement
    private String id;
    @XmlElement
    private ExecutionStatus status;
    @XmlElement(name = "workflow_id")
    private String workflowId;
    @XmlElement(name = "deployment_id")
    private String deploymentId;
    @XmlElement(name = "status_display")
    private String statusDisplay;
    @XmlElement(name = "created_at")
    private Date createdAt;
    @XmlElement(name = "created_by")
    private String createdBy;
    @XmlElement(name = "started_at")
    private Date startedAt;
    @XmlElement(name = "ended_at")
    private Date endedAt;
    @XmlElement(name = "scheduled_for")
    private Date scheduledFor;
    @XmlElement
    private Visibility visibility;
    @XmlElement(name = "resource_availability")
    private ResourceAvailability resourceAvailability;
    @XmlElement(name = "private_resource")
    private boolean privateResource;
    @XmlElement(name = "is_system_workflow")
    private boolean systemWorkflow;
    @XmlElement(name = "is_dry_run")
    private boolean dryRun;
    @XmlElement(name = "blueprint_id")
    private String blueprintId;
    @XmlElement(name = "tenant_name")
    private String tenantName;
    @XmlElement
    private Map<String, Object> parameters;
    @XmlElement
    private String error;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ExecutionStatus getStatus() {
        return status;
    }

    public void setStatus(ExecutionStatus status) {
        this.status = status;
    }

    public String getWorkflowId() {
        return workflowId;
    }

    public void setWorkflowId(String workflowId) {
        this.workflowId = workflowId;
    }

    public String getDeploymentId() {
        return deploymentId;
    }

    public void setDeploymentId(String deploymentId) {
        this.deploymentId = deploymentId;
    }

    public String getStatusDisplay() {
        return statusDisplay;
    }

    public void setStatusDisplay(String statusDisplay) {
        this.statusDisplay = statusDisplay;
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

    public Date getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Date startedAt) {
        this.startedAt = startedAt;
    }

    public Date getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(Date endedAt) {
        this.endedAt = endedAt;
    }

    public Date getScheduledFor() {
        return scheduledFor;
    }

    public void setScheduledFor(Date scheduledFor) {
        this.scheduledFor = scheduledFor;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }

    public ResourceAvailability getResourceAvailability() {
        return resourceAvailability;
    }

    public void setResourceAvailability(ResourceAvailability resourceAvailability) {
        this.resourceAvailability = resourceAvailability;
    }

    public boolean isPrivateResource() {
        return privateResource;
    }

    public void setPrivateResource(boolean privateResource) {
        this.privateResource = privateResource;
    }

    public boolean isSystemWorkflow() {
        return systemWorkflow;
    }

    public void setSystemWorkflow(boolean systemWorkflow) {
        this.systemWorkflow = systemWorkflow;
    }

    public boolean isDryRun() {
        return dryRun;
    }

    public void setDryRun(boolean dryRun) {
        this.dryRun = dryRun;
    }

    public String getBlueprintId() {
        return blueprintId;
    }

    public void setBlueprintId(String blueprintId) {
        this.blueprintId = blueprintId;
    }

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(String tenantName) {
        this.tenantName = tenantName;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }

    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("id", id)
                .append("status", status)
                .append("error", error)
                .toString();
    }
}
