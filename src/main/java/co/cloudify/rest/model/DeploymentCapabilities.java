package co.cloudify.rest.model;

import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class DeploymentCapabilities {
	@XmlElement(name = "deployment_id")
	private String deploymentId;
	
	@XmlElement
	private Map<String, Object> capabilities;
	
	public String getDeploymentId() {
		return deploymentId;
	}
	
	public Map<String, Object> getCapabilities() {
		return capabilities;
	}
}
