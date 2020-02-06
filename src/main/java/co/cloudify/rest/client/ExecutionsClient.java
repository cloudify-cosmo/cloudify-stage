package co.cloudify.rest.client;

import java.util.Collections;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import co.cloudify.rest.client.params.ExecutionStartParams;
import co.cloudify.rest.model.Deployment;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ListResponse;

public class ExecutionsClient extends AbstractCloudifyClient {
	/**	Base API path. */
	private static final String BASE_PATH = "/api/v3.1/executions";
	/**	API path for specific resource. */
	private static final String ID_PATH = BASE_PATH + "/{id}";
	
	public ExecutionsClient(Client restClient, WebTarget baseTarget) {
		super(restClient, baseTarget);
	}

	protected WebTarget getExecutionsTarget() {
		return getTarget(BASE_PATH);
	}
	
	protected WebTarget getExecutionsTarget(String id) {
		return getTarget(ID_PATH, Collections.singletonMap("id", id));
	}
	
	/**
	 * Returns a single execution by ID.
	 * 
	 * @param	id	the execution ID
	 * 
	 * @return	A corresponding {@link Execution} instance.
	 */
	public Execution get(String id) {
		return getBuilder(getExecutionsTarget(id)).get(Execution.class);
	}
	
	/**
	 * Lists all executions.
	 * 
	 * @return	A list of all executions.
	 */
	public ListResponse<Execution> list() {
		return getBuilder(getExecutionsTarget()).get(new GenericType<ListResponse<Execution>>() {});
	}
	
	/**
	 * Starts an execution.
	 * 
	 * @param	deploymentId	deployment to start for
	 * @param	workflowId		workflow to start
	 * @param	parameters		a {@link Map} of execution parameters
	 * 
	 * @return	An {@link Execution} object, representing the created execution.
	 */
	public Execution start(Deployment deployment, String workflowId, Map<String, Object> parameters) {
		return start(deployment.getId(), workflowId, parameters);
	}
	
	/**
	 * Starts an execution.
	 * 
	 * @param	deploymentId	deployment to start for
	 * @param	workflowId		workflow to start
	 * @param	parameters		a {@link Map} of execution parameters
	 * 
	 * @return	An {@link Execution} object, representing the created execution.
	 */
	public Execution start(String deploymentId, String workflowId, Map<String, Object> parameters) {
		ExecutionStartParams params = new ExecutionStartParams(workflowId, deploymentId, parameters);
		return getBuilder(getExecutionsTarget()).buildPost(Entity.json(params)).invoke(Execution.class);
	}
}
