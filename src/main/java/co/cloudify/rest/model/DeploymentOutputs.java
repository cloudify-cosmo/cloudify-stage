package co.cloudify.rest.model;

import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class DeploymentOutputs {
	@XmlElement(name = "deployment_id")
	private String deploymentId;
	
	@XmlElement
	private Map<String, Object> outputs;
	
	public String getDeploymentId() {
		return deploymentId;
	}
	
	public Map<String, Object> getOutputs() {
		return outputs;
	}
}
