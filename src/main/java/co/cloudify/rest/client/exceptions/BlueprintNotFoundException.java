package co.cloudify.rest.client.exceptions;

import javax.ws.rs.WebApplicationException;

public class BlueprintNotFoundException extends CloudifyClientException {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private String blueprintId;

    public BlueprintNotFoundException(final String blueprintId, WebApplicationException cause) {
        super(String.format("Blueprint not found: %s", blueprintId), cause);
        this.blueprintId = blueprintId;
    }

    public String getBlueprintId() {
        return blueprintId;
    }
}
