package co.cloudify.rest.helpers;

import co.cloudify.rest.model.Execution;

public interface ExecutionFollowCallback {
	public void start(final Execution execution);
	public void callback(final Execution execution);
	public void end(final Execution execution);
	
}
