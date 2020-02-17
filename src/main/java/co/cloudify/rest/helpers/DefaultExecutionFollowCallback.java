package co.cloudify.rest.helpers;

import co.cloudify.rest.model.Execution;

/**
 * Skeleton for {@link ExecutionFollowCallback} that does nothing.
 * 
 * @author	Isaac Shabtay
 *
 */
public class DefaultExecutionFollowCallback implements ExecutionFollowCallback {
	@Override
	public void start(Execution execution) {
		//	Nothing.
	}

	@Override
	public void callback(Execution execution) {
		//	Nothing.
	}

	@Override
	public void end(Execution execution) {
		//	Nothing.
	}
}
