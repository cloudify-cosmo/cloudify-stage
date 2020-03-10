package co.cloudify.rest.client.exceptions;

import org.apache.commons.lang3.StringUtils;

import co.cloudify.rest.model.Execution;

public class ExecutionNotCompletedException extends Exception {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private Execution execution;

    public ExecutionNotCompletedException(final String message, final Execution execution) {
        super(constructMessage(message, execution));
        this.execution = execution;
    }

    public static String constructMessage(final String message, final Execution execution) {
        String executionText = null;
        if (execution != null) {
            executionText = String.format("id=%s, status=%s, error=%s", execution.getId(), execution.getStatus(),
                    execution.getError());
        }

        String msg;
        if (StringUtils.isNotBlank(message)) {
            if (executionText != null) {
                msg = String.format("%s (%s)", message, executionText);
            } else {
                msg = message;
            }
        } else {
            msg = executionText;
        }
        return msg;
    }

    public Execution getExecution() {
        return execution;
    }
}
