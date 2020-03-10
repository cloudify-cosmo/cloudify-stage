package co.cloudify.rest.client.params;

import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ExecutionStartParams {
    @XmlElement(name = "workflow_id")
    private String workflowId;
    @XmlElement(name = "deployment_id")
    private String deploymentId;
    @XmlElement
    private Map<String, Object> parameters;

    public ExecutionStartParams() {
        super();
    }

    public ExecutionStartParams(String workflowId, String deploymentId, Map<String, Object> parameters) {
        this();
        this.workflowId = workflowId;
        this.deploymentId = deploymentId;
        this.parameters = parameters;
    }
}
