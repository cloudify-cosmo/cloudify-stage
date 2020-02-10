package co.cloudify.rest.client;

import java.util.Collections;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import org.apache.commons.lang3.Validate;

import co.cloudify.rest.client.params.DeploymentCreateParams;
import co.cloudify.rest.model.Blueprint;
import co.cloudify.rest.model.Deployment;
import co.cloudify.rest.model.ListResponse;

/**
 * Client for deployment-related operations.
 * 
 * @author	Isaac Shabtay
 */
public class DeploymentsClient extends AbstractCloudifyClient {
	/**	Base API path. */
	private static final String BASE_PATH = "/api/v3.1/deployments";
	/**	Path for specific resource. */
	private static final String ID_PATH = BASE_PATH + "/{id}";

	public DeploymentsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}

	protected Builder getDeploymentsBuilder(final String ... args) {
		Validate.isTrue(args.length <= 1);
		return getBuilder(getTarget(ID_PATH, args.length == 1 ? Collections.singletonMap("id", args[0]) : Collections.emptyMap()));
	}
	
	/**
	 * @return	A {@link ListResponse} of all deployments.
	 */
	public ListResponse<Deployment> list() {
		return getDeploymentsBuilder().get(new GenericType<ListResponse<Deployment>>() {});
	}
	
	/**
	 * Returns a specific deployment.
	 * 
	 * @param	id	deployment's ID
	 * 
	 * @return	A {@link Deployment} instance describing the deployment.
	 */
	public Deployment get(final String id) {
		return getDeploymentsBuilder(id).get(Deployment.class);
	}

	/**
	 * Creates a deployment.
	 * 
	 * @param	id			new deployment's ID
	 * @param	blueprint	blueprint to associate deployment with
	 * @param	inputs		deployment inputs
	 * 
	 * @return	A {@link Deployment} instance for the new deployment.
	 */
	public Deployment create(final String id, final Blueprint blueprint,
			final Map<String, Object> inputs) {
		return create(id, blueprint.getId(), inputs);
	}

	/**
	 * Creates a deployment.
	 * 
	 * @param	id			new deployment's ID
	 * @param	blueprintId	blueprint to associate deployment with
	 * @param	inputs		deployment inputs
	 * 
	 * @return	A {@link Deployment} instance for the new deployment.
	 */
	public Deployment create(final String id, final String blueprintId,
			final Map<String, Object> inputs) {
		return getDeploymentsBuilder(id).put(Entity.json(new DeploymentCreateParams(blueprintId, inputs)), Deployment.class);
	}
	
	/**
	 * Deletes a deployment.
	 * 
	 * @param	id	deployment to delete
	 */
	public void delete(final String id) {
		getDeploymentsBuilder(id).delete();
	}
}
