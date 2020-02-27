package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class DeploymentCapabilities implements Serializable {
	/**	Serialization UID. */
	private static final long serialVersionUID = 1L;

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
