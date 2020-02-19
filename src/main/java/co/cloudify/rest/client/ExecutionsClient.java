package co.cloudify.rest.client;

import java.util.Collections;
import java.util.Map;

import javax.ws.rs.BadRequestException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import org.apache.commons.lang3.Validate;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
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

	protected Builder getExecutionsBuilder(final String ... args) {
		Validate.isTrue(args.length <= 1);
		return getBuilder(getTarget(args.length == 1 ? ID_PATH : BASE_PATH, args.length == 1 ? Collections.singletonMap("id", args[0]) : Collections.emptyMap()));
	}
	
	/**
	 * Returns a single execution by ID.
	 * 
	 * @param	id	the execution ID
	 * 
	 * @return	A corresponding {@link Execution} instance.
	 */
	public Execution get(String id) {
		return getExecutionsBuilder(id).get(Execution.class);
	}
	
	/**
	 * Lists all executions.
	 * 
	 * @return	A list of all executions.
	 */
	public ListResponse<Execution> list() {
		return getExecutionsBuilder().get(new GenericType<ListResponse<Execution>>() {});
	}
	
	public ListResponse<Execution> list(final Deployment deployment) {
		return list(deployment.getId());
	}
	
	public ListResponse<Execution> list(final String deploymentId) {
		WebTarget target = getTarget(BASE_PATH).queryParam("deployment_id", deploymentId);
		return getBuilder(target).get(new GenericType<ListResponse<Execution>>() {});
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
		try {
			return getExecutionsBuilder().post(Entity.json(params), Execution.class);
		} catch (BadRequestException ex) {
			throw CloudifyClientException.create("Failed starting execution", ex);
		}
	}
}
