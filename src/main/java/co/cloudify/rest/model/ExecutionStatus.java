package co.cloudify.rest.model;

import java.util.Arrays;
import java.util.List;

public enum ExecutionStatus {
	terminated,
	failed,
	cancelled,
	pending,
	started,
	cancelling,
	force_cancelling,
	kill_cancelling,
	queued,
	scheduled;
	
	/**	All statuses that imply that the execution is no longer running, and is not intended to run. */
	public static final List<ExecutionStatus> TERMINAL_STATUSES = Arrays.asList(terminated, failed, cancelled);
}
