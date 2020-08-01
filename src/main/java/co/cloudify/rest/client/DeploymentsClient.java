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
 * @author Isaac Shabtay
 */
public class DeploymentsClient extends AbstractCloudifyClient {
    /** Base API path. */
    private static final String BASE_PATH = "/api/v3.1/deployments";
    /** Path for specific resource. */
    private static final String ID_PATH = BASE_PATH + "/{id}";
    /** Path for outputs. */
    private static final String OUTPUTS_PATH = ID_PATH + "/outputs";
    /** Path for capabilities. */
    private static final String CAPABILITIES_PATH = ID_PATH + "/capabilities";

    public DeploymentsClient(Client restClient, WebTarget base) {
        super(restClient, base);
    }

    protected Builder getDeploymentsBuilder() {
        return getBuilder(getTarget(BASE_PATH));
    }

    protected Builder getDeploymentBuilder(String path, String id) {
        return getBuilder(getTarget(path, Collections.singletonMap("id", id)));
    }

    protected Builder getDeploymentIdBuilder(String id) {
        return getDeploymentBuilder(ID_PATH, id);
    }

    /**
     * @return A {@link ListResponse} of all deployments.
     */
    public ListResponse<Deployment> list() {
        try {
            return list((String) null, null, null, false);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed listing deployments", ex);
        }
    }

    public ListResponse<Deployment> list(final String blueprintId, final String searchString, final String sortKey,
            final boolean descending) {
        WebTarget target = getTarget(BASE_PATH);
        if (blueprintId != null) {
            target = target.queryParam("blueprint_id", blueprintId);
        }
        target = commonListParams(target, searchString, sortKey, descending);
        try {
            return getBuilder(target).get(new GenericType<ListResponse<Deployment>>() {});
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed listing deployments", ex);
        }
    }

    /**
     * Returns a specific deployment.
     * 
     * @param id deployment's ID
     * 
     * @return A {@link Deployment} instance describing the deployment.
     */
    public Deployment get(final String id) {
        try {
            return getDeploymentIdBuilder(id).get(Deployment.class);
        } catch (NotFoundException ex) {
            throw new DeploymentNotFoundException(id, ex);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed retrieving deployment", ex);
        }
    }

    /**
     * Creates a deployment.
     * 
     * @param id        new deployment's ID
     * @param blueprint blueprint to associate deployment with
     * @param inputs    deployment inputs
     * 
     * @return A {@link Deployment} instance for the new deployment.
     */
    public Deployment create(final String id, final Blueprint blueprint, final Map<String, Object> inputs) {
        return create(id, blueprint.getId(), inputs);
    }

    /**
     * Creates a deployment. Note: this is an asynchronous operation.
     * 
     * @param id          new deployment's ID
     * @param blueprintId blueprint to associate deployment with
     * @param inputs      deployment inputs
     * 
     * @return A {@link Deployment} instance for the new deployment.
     */
    public Deployment create(final String id, final String blueprintId, final Map<String, Object> inputs) {
        try {
            return getDeploymentIdBuilder(id).put(
                    Entity.json(
                            new DeploymentCreateParams(blueprintId, inputs)),
                    Deployment.class);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed creating deployment", ex);
        }
    }

    public Map<String, Object> getOutputs(final Deployment deployment) {
        String id = deployment.getId();
        try {
            return getDeploymentBuilder(OUTPUTS_PATH, id)
                    .get(DeploymentOutputs.class).getOutputs();
        } catch (NotFoundException ex) {
            throw new DeploymentNotFoundException(id, ex);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed retrieving outputs", ex);
        }
    }

    public Map<String, Object> getCapabilities(final Deployment deployment) {
        String id = deployment.getId();
        try {
            return getDeploymentBuilder(CAPABILITIES_PATH, id)
                    .get(DeploymentCapabilities.class).getCapabilities();
        } catch (NotFoundException ex) {
            throw new DeploymentNotFoundException(id, ex);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed retrieving capabilities", ex);
        }
    }

    /**
     * Deletes a deployment. Note: this operation is asynchronous.
     * 
     * @param id deployment to delete
     * 
     * @return The deleted deployment.
     */
    public Deployment delete(final String id) {
        try {
            return getDeploymentIdBuilder(id).delete(Deployment.class);
        } catch (NotFoundException ex) {
            throw new DeploymentNotFoundException(id, ex);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed deleting deployment", ex);
        }
    }
}
