package co.cloudify.rest.client;

import java.util.Collections;
import java.util.Map;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import org.apache.commons.lang3.Validate;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.client.exceptions.DeploymentNotFoundException;
import co.cloudify.rest.client.params.DeploymentCreateParams;
import co.cloudify.rest.model.Blueprint;
import co.cloudify.rest.model.Deployment;
import co.cloudify.rest.model.DeploymentCapabilities;
import co.cloudify.rest.model.DeploymentOutputs;
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
	/**	Path for outputs. */
	private static final String OUTPUTS_PATH = BASE_PATH + "/{id}/outputs";
	/**	Path for capabilities. */
	private static final String CAPABILITIES_PATH = BASE_PATH + "/{id}/capabilities";

	public DeploymentsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}

	protected Builder getDeploymentsBuilder(final String ... args) {
		Validate.isTrue(args.length <= 1);
		//	TODO singleton externalize
		return getBuilder(getTarget(args.length == 1 ? ID_PATH : BASE_PATH, args.length == 1 ? Collections.singletonMap("id", args[0]) : Collections.emptyMap()));
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
		try {
			return getDeploymentsBuilder(id).get(Deployment.class);
		} catch (NotFoundException ex) {
			throw new DeploymentNotFoundException(id, ex);
		} catch (WebApplicationException ex) {
			throw CloudifyClientException.create("Failed retrieving deployment", ex);
		}
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
		try {
			return getDeploymentsBuilder(id).put(Entity.json(new DeploymentCreateParams(blueprintId, inputs)), Deployment.class);
		} catch (WebApplicationException ex) {
			throw CloudifyClientException.create("Failed creating deployment", ex);
		}
	}
	
	public Map<String, Object> getOutputs(final Deployment deployment) {
		try {
			return getBuilder(getTarget(OUTPUTS_PATH, Collections.singletonMap("id", deployment.getId()))).get(DeploymentOutputs.class).getOutputs();
		} catch (NotFoundException ex) {
			throw new DeploymentNotFoundException(deployment.getId(), ex);
		} catch (WebApplicationException ex) {
			throw CloudifyClientException.create("Failed retrieving outputs", ex);
		}
	}
	
	public Map<String, Object> getCapabilities(final Deployment deployment) {
		try {
			return getBuilder(getTarget(CAPABILITIES_PATH, Collections.singletonMap("id", deployment.getId()))).get(DeploymentCapabilities.class).getCapabilities();
		} catch (NotFoundException ex) {
			throw new DeploymentNotFoundException(deployment.getId(), ex);
		} catch (WebApplicationException ex) {
			throw CloudifyClientException.create("Failed retrieving capabilities", ex);
		}
	}
	
	/**
	 * Deletes a deployment.
	 * 
	 * @param	id	deployment to delete
	 */
	public void delete(final String id) {
		try {
			getDeploymentsBuilder(id).delete();
		} catch (NotFoundException ex) {
			throw new DeploymentNotFoundException(id, ex);
		} catch (WebApplicationException ex) {
			throw CloudifyClientException.create("Failed deleting deployment", ex);
		}
	}
}
