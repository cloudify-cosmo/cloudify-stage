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

	private static ExecutionFollowCallback DEFAULT_FOLLOW_CALLBACK = DefaultExecutionFollowCallback.getInstance();

	/**
	 * Starts an execution and optionally follow it until it is done.
	 * 
	 * @param client       a {@link CloudifyClient} pointing at Cloudify Manager
	 * @param deploymentId deployment to start execution for
	 * @param workflowId   workflow to start
	 * @param parameters   workflow parameters
	 * @param callback     an {@link ExecutionFollowCallback} instance to use for callbacks;
	 *                     may be <code>null</code>, in which case it won't be followed. For
	 *                     a no-op following (that is, just wait until execution is over),
	 *                     use {@link DefaultExecutionFollowCallback}
	 * 
	 * @return The updated {@link Execution} object.
	 * 
	 * @throws Exception May be anything thrown by Cloudify's REST client.
	 */
	public static Execution start(final CloudifyClient client,
	        final String deploymentId,
	        final String workflowId,
	        final Map<String, Object> parameters,
	        ExecutionFollowCallback callback) throws Exception {
		Execution execution = client.getExecutionsClient().start(deploymentId, workflowId, parameters);
		if (callback != null) {
			execution = followExecution(client, execution, callback);
		}
		return execution;
	}

	/**
	 * Run the "install" workflow.
	 * 
	 * @param client       a {@link CloudifyClient} pointing at Cloudify Manager
	 * @param deploymentId deployment to start execution for
	 * @param callback     an {@link ExecutionFollowCallback} instance to use for callbacks;
	 *                     may be <code>null</code>, in which case it won't be followed. For
	 *                     a no-op following (that is, just wait until execution is over),
	 *                     use {@link DefaultExecutionFollowCallback}
	 * 
	 * @return The updated {@link Execution} object.
	 * 
	 * @throws Exception May be anything thrown by Cloudify's REST client.
	 */
	public static Execution install(final CloudifyClient client, final String deploymentId,
	        ExecutionFollowCallback callback) throws Exception {
		return start(client, deploymentId, "install", null, callback);
	}

	public static Execution uninstall(final CloudifyClient client, final String deploymentId, Boolean ignoreFailure,
	        ExecutionFollowCallback callback) throws Exception {
		Map<String, Object> params = ignoreFailure != null ? Collections.singletonMap("ignore_failure", ignoreFailure)
		        : null;
		return start(client, deploymentId, "uninstall", params, callback);
	}

	/**
	 * Follows an execution until it ends.
	 * 
	 * @param client    Cloudify's REST client
	 * @param execution execution to track
	 * @param callback  a callback object to call while following
	 * 
	 * @return The most up-to-date representation of the execution.
	 */
	public static Execution followExecution(final CloudifyClient client, Execution execution,
	        ExecutionFollowCallback callback) throws Exception {
		ExecutionsClient executionsClient = client.getExecutionsClient();
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
					Thread.sleep(2000);
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

	public static void validate(final Execution execution, final String msg, final Object... args)
	        throws ExecutionNotCompletedException {
		if (execution.getStatus() != ExecutionStatus.terminated) {
			throw new ExecutionNotCompletedException(String.format(msg, args), execution);
		}
	}
}
