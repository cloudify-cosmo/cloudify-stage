package co.cloudify.rest.helpers;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.client.DeploymentsClient;
import co.cloudify.rest.client.ExecutionsClient;
import co.cloudify.rest.client.exceptions.DeploymentNotFoundException;
import co.cloudify.rest.model.Deployment;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ListResponse;

public class DeploymentsHelper {
    private static final Logger logger = LoggerFactory.getLogger(DeploymentsHelper.class);

    public static final long DEFAULT_POLLING_INTERVAL = 2000;

    /**
     * Creates a deployment and wait for the creation process to finish.
     * 
     * @param client          {@link CloudifyClient} instance
     * @param id              deployment ID
     * @param blueprintId     blueprint ID
     * @param inputs          deployment inputs
     * @param callback        an {@link ExecutionFollowCallback} instance containing
     *                        callback methods
     * @param pollingInterval number of milliseconds between polling iterations
     * 
     * @return The created {@link Deployment} instance.
     * 
     * @throws Exception All exceptions are percolated.
     */
    public static Deployment createDeploymentAndWait(CloudifyClient client, String id, String blueprintId,
            final Map<String, Object> inputs, final ExecutionFollowCallback callback, final long pollingInterval)
            throws Exception {
        DeploymentsClient deploymentsClient = client.getDeploymentsClient();
        Deployment deployment = deploymentsClient.create(id, blueprintId, inputs);

        // Currently, the REST call for deployment creation doesn't return
        // the execution ID of the "create_deployment_environment" execution, so
        // we need to look for it awkwardly (see
        // https://cloudifysource.atlassian.net/browse/CYBL-955).

        ExecutionsClient executionsClient = client.getExecutionsClient();
        ListResponse<Execution> executions = executionsClient.list(deployment);
        List<Execution> items = executions.getItems();
        if (items.size() != 1) {
            throw new IllegalStateException(
                    String.format("Expected to find exactly one execution for deployment %s, but found %d",
                            deployment.getId(), items.size()));
        }
        Execution depCreationExecution = items.get(0);
        depCreationExecution = ExecutionsHelper.followExecution(executionsClient, depCreationExecution, callback,
                pollingInterval);
        return deployment;
    }

    /**
     * Deletes a deployment and waits until it's deleted.
     * 
     * @param client          a {@link CloudifyClient} instance
     * @param id              ID of deployment to delete
     * @param pollingInterval number of milliseconds between polling iterations
     */
    public static void deleteDeploymentAndWait(CloudifyClient client, String id, final long pollingInterval) {
        DeploymentsClient deploymentsClient = client.getDeploymentsClient();
        deploymentsClient.delete(id);
        while (true) {
            try {
                deploymentsClient.get(id);
                // No exception thrown; the deployment still exists.
                Thread.sleep(pollingInterval);
                continue;
            } catch (DeploymentNotFoundException ex) {
                // Deleted.
            } catch (InterruptedException ex) {
                logger.warn("Asked to stop waiting", ex);
            }
            break;
        }
    }
}
