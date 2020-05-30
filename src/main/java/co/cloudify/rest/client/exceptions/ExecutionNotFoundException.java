package co.cloudify.rest.client.exceptions;

import javax.ws.rs.WebApplicationException;

public class ExecutionNotFoundException extends CloudifyClientException {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private String executionId;

    public ExecutionNotFoundException(final String executionId, WebApplicationException cause) {
        super(String.format("Execution not found: %s", executionId), cause);
        this.executionId = executionId;
    }

    public String getExecutionId() {
        return executionId;
    }
}
