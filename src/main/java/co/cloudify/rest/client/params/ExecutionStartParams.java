package co.cloudify.rest.client.params;

import java.io.Serializable;
import java.util.Map;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class ExecutionStartParams implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    @XmlElement(name = "deployment_id")
    private String deploymentId;
    @XmlElement(name = "workflow_id")
    private String workflowId;
    @XmlElement
    private Map<String, Object> parameters;

    public ExecutionStartParams() {
        super();
    }

    public ExecutionStartParams(String deploymentId, String workflowId, Map<String, Object> parameters) {
        this();
        this.deploymentId = deploymentId;
        this.workflowId = workflowId;
        this.parameters = parameters;
    }

    public String getDeploymentId() {
        return deploymentId;
    }

    public String getWorkflowId() {
        return workflowId;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("deploymentId", deploymentId)
                .append("workflowId", workflowId)
                .append("parameters", parameters)
                .toString();
    }
}
