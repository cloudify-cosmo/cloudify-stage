package co.cloudify.rest.model.helpers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.client.ExecutionsClient;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.ExecutionStatus;

public class ExecutionsHelper {
	private static final Logger logger = LoggerFactory.getLogger(ExecutionsHelper.class);
	
	/**
	 * Follows an execution until it ends.
	 * 
	 * @param	client		Cloudify's REST client
	 * @param	execution	execution to track
	 * 
	 * @return	The most up-to-date representation of the execution.
	 */
	public static Execution followExecution(final CloudifyClient client,
			Execution execution) {
		ExecutionsClient executionsClient = client.getExecutionsClient();
		String executionId = execution.getId();
		while(true) {
			execution = executionsClient.get(executionId);
			if (ExecutionStatus.TERMINAL_STATUSES.contains(execution.getStatus())) {
				break;
			}
			try {
				Thread.sleep(2000);
			} catch (InterruptedException ex) {
				logger.warn("Asked to stop waiting; returning", ex);
				break;
			}
		}
		return execution;
	}
}
