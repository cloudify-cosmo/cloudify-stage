package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
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

    public Date getReportedTimestamp() {
        return reportedTimestamp;
    }

    public EventLevel getLevel() {
        return level;
    }

    public String getMessage() {
        return message;
    }

    public String getDeploymentId() {
        return deploymentId;
    }

    public String getNodeInstanceId() {
        return nodeInstanceId;
    }

    public String getOperation() {
        return operation;
    }

    public EventType getType() {
        return type;
    }

    public String getEventType() {
        return eventType;
    }

    public String getSourceId() {
        return sourceId;
    }

    public String getTargetId() {
        return targetId;
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
