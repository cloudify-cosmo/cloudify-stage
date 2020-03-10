package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
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
    private boolean isSystemWorkflow;
    @XmlElement(name = "is_dry_run")
    private boolean isDryRun;
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

    public ExecutionStatus getStatus() {
        return status;
    }

    public String getError() {
        return error;
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
