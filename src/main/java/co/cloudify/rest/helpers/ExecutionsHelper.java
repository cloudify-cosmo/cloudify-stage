package co.cloudify.rest.helpers;

import java.util.Collections;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.client.ExecutionsClient;
import co.cloudify.rest.client.exceptions.ExecutionNotCompletedException;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ExecutionStatus;

public class ExecutionsHelper {
    private static final Logger logger = LoggerFactory.getLogger(ExecutionsHelper.class);

    public static final long DEFAULT_POLLING_INTERVAL = 2000;

    private static ExecutionFollowCallback DEFAULT_FOLLOW_CALLBACK = DefaultExecutionFollowCallback.getInstance();

    /**
     * Starts an execution and optionally follow it until it is done.
     * 
     * @param client          a {@link CloudifyClient} pointing at Cloudify Manager
     * @param deploymentId    deployment to start execution for
     * @param workflowId      workflow to start
     * @param parameters      workflow parameters
     * @param callback        an {@link ExecutionFollowCallback} instance to use for
     *                        callbacks; may be <code>null</code>, in which case it
     *                        won't be followed. For a no-op following (that is,
     *                        just wait until execution is over), use
     *                        {@link DefaultExecutionFollowCallback}
     * @param pollingInterval number of milliseconds between polling iterations
     * 
     * @return The updated {@link Execution} object.
     * 
     * @throws Exception May be anything thrown by Cloudify's REST client.
     */
    public static Execution start(final CloudifyClient client, final String deploymentId, final String workflowId,
            final Map<String, Object> parameters, ExecutionFollowCallback callback, final long pollingInterval)
            throws Exception {
        ExecutionsClient executionsClient = client.getExecutionsClient();
        Execution execution = executionsClient.start(deploymentId, workflowId, parameters);
        if (callback != null) {
            execution = followExecution(executionsClient, execution, callback, pollingInterval);
        }
        return execution;
    }

    /**
     * Run the "install" workflow.
     * 
     * @param client          a {@link CloudifyClient} pointing at Cloudify Manager
     * @param deploymentId    deployment to start execution for
     * @param callback        an {@link ExecutionFollowCallback} instance to use for
     *                        callbacks; may be <code>null</code>, in which case it
     *                        won't be followed. For a no-op following (that is,
     *                        just wait until execution is over), use
     *                        {@link DefaultExecutionFollowCallback}
     * @param pollingInterval number of milliseconds between polling iterations
     * 
     * @return The updated {@link Execution} object.
     * 
     * @throws Exception May be anything thrown by Cloudify's REST client.
     */
    public static Execution install(final CloudifyClient client, final String deploymentId,
            ExecutionFollowCallback callback, final long pollingInterval) throws Exception {
        return start(client, deploymentId, "install", null, callback, pollingInterval);
    }

    /**
     * Run the "uninstall" workflow.
     * 
     * @param client          a {@link CloudifyClient} pointing at Cloudify Manager
     * @param deploymentId    deployment to start execution for
     * @param ignoreFailure   whether to ignore failures during uninstall
     * @param callback        an {@link ExecutionFollowCallback} instance to use for
     *                        callbacks; may be <code>null</code>, in which case it
     *                        won't be followed. For a no-op following (that is,
     *                        just wait until execution is over), use
     *                        {@link DefaultExecutionFollowCallback}
     * @param pollingInterval number of milliseconds between polling iterations
     * 
     * @return The updated {@link Execution} object.
     * 
     * @throws Exception May be anything thrown by Cloudify's REST client.
     */
    public static Execution uninstall(final CloudifyClient client, final String deploymentId, Boolean ignoreFailure,
            ExecutionFollowCallback callback, final long pollingInterval) throws Exception {
        Map<String, Object> params = ignoreFailure != null ? Collections.singletonMap("ignore_failure", ignoreFailure)
                : null;
        return start(client, deploymentId, "uninstall", params, callback, pollingInterval);
    }

    /**
     * Follows an execution until it ends.
     * 
     * @param executionsClient Cloudify's Executions REST client
     * @param execution        execution to track
     * @param callback         a callback object to call while following
     * @param pollingInterval  number of milliseconds to wait between pollings
     * 
     * @return The most up-to-date representation of the execution.
     * 
     * @throws Exception Thrown if an exception occurred while following the
     *                   execution.
     */
    public static Execution followExecution(final ExecutionsClient executionsClient, Execution execution,
            ExecutionFollowCallback callback, long pollingInterval) throws Exception {
        String executionId = execution.getId();
        ExecutionFollowCallback effectiveCallback = ObjectUtils.defaultIfNull(callback, DEFAULT_FOLLOW_CALLBACK);
        effectiveCallback.start(execution);
        try {
            while (true) {
                execution = executionsClient.get(executionId);
                effectiveCallback.callback(execution);
                if (ExecutionStatus.TERMINAL_STATUSES.contains(execution.getStatus())) {
                    break;
                }
                try {
                    Thread.sleep(pollingInterval);
                } catch (InterruptedException ex) {
                    logger.warn("Asked to stop waiting; returning", ex);
                    throw ex;
                }
            }
            effectiveCallback.last(execution);
            effectiveCallback.end(execution);
        } catch (Exception ex) {
            effectiveCallback.exception(execution, ex);
            throw ex;
        }
        return execution;
    }

    /**
     * Validates an execution: if its status is not
     * {@link ExecutionStatus#terminated}, an exception is raised.
     * 
     * @param execution execution to validate
     * @param msg       message exception message, in case validation failed
     * @param args      parameters for the exception message
     * 
     * @throws ExecutionNotCompletedException Thrown when the execution fails
     *                                        validation.
     */
    public static void validateCompleted(final Execution execution, final String msg, final Object... args)
            throws ExecutionNotCompletedException {
        if (execution.getStatus() != ExecutionStatus.terminated) {
            throw new ExecutionNotCompletedException(String.format(msg, args), execution);
        }
    }
}
