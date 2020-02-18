package co.cloudify.rest.client.exceptions;

public class DeploymentNotFoundException extends CloudifyClientException {
	/**	Serialization UID.	*/
	private static final long serialVersionUID = 1L;
	private String deploymentId;
	
	public DeploymentNotFoundException(final String deploymentId, Throwable cause) {
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
