package co.cloudify.rest.client.exceptions;

import javax.ws.rs.WebApplicationException;

public class DeploymentNotFoundException extends CloudifyClientException {
	/**	Serialization UID.	*/
	private static final long serialVersionUID = 1L;
	private String deploymentId;
	
	public DeploymentNotFoundException(final String deploymentId, WebApplicationException cause) {
		super(String.format("Deployment not found: %s", deploymentId), cause);
		this.deploymentId = deploymentId;
	}
	
	@Override
	public String getMessage() {
		return super.getMessage();
	}
	
	public String getDeploymentId() {
		return deploymentId;
	}
}
