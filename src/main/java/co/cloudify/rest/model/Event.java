package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Event implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    @XmlElement(name = "_storage_id")
    private long storageId;
    @XmlElement(name = "deployment_id")
    private String deploymentId;
    @XmlElement(name = "execution_id")
    private String executionId;
    @XmlElement
    private EventLevel level;
    @XmlElement
    private String logger;
    @XmlElement
    private EventType type;
    @XmlElement(name = "node_instance_id")
    private String nodeInstanceId;
    @XmlElement(name = "event_type")
    private String eventType;
    @XmlElement
    private String operation;
    @XmlElement(name = "blueprint_id")
    private String blueprintId;
    @XmlElement
    private Date timestamp;
    @XmlElement
    private String message;
    @XmlElement(name = "source_id")
    private String sourceId;
    @XmlElement(name = "target_id")
    private String targetId;
    @XmlElement(name = "node_name")
    private String nodeName;
    @XmlElement(name = "workflow_id")
    private String workflowId;
    @XmlElement(name = "error_causes")
    private List<Object> errorCauses;
    @XmlElement(name = "reported_timestamp")
    private Date reportedTimestamp;

    public long getStorageId() {
        return storageId;
    }

    public void setStorageId(long storageId) {
        this.storageId = storageId;
    }

    public String getDeploymentId() {
        return deploymentId;
    }

    public void setDeploymentId(String deploymentId) {
        this.deploymentId = deploymentId;
    }

    public String getExecutionId() {
        return executionId;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public EventLevel getLevel() {
        return level;
    }

    public void setLevel(EventLevel level) {
        this.level = level;
    }

    public String getLogger() {
        return logger;
    }

    public void setLogger(String logger) {
        this.logger = logger;
    }

    public EventType getType() {
        return type;
    }

    public void setType(EventType type) {
        this.type = type;
    }

    public String getNodeInstanceId() {
        return nodeInstanceId;
    }

    public void setNodeInstanceId(String nodeInstanceId) {
        this.nodeInstanceId = nodeInstanceId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public String getBlueprintId() {
        return blueprintId;
    }

    public void setBlueprintId(String blueprintId) {
        this.blueprintId = blueprintId;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getWorkflowId() {
        return workflowId;
    }

    public void setWorkflowId(String workflowId) {
        this.workflowId = workflowId;
    }

    public List<Object> getErrorCauses() {
        return errorCauses;
    }

    public void setErrorCauses(List<Object> errorCauses) {
        this.errorCauses = errorCauses;
    }

    public Date getReportedTimestamp() {
        return reportedTimestamp;
    }

    public void setReportedTimestamp(Date reportedTimestamp) {
        this.reportedTimestamp = reportedTimestamp;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("date", reportedTimestamp)
                .append("level", level)
                .append("message", message)
                .toString();
    }
}
