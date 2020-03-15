package co.cloudify.rest.client;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.model.Status;

public class ManagerClient extends AbstractCloudifyClient {
    /** Base API path. */
    private static final String BASE_PATH = "/api/v3.1/status";

    public ManagerClient(Client restClient, WebTarget base) {
        super(restClient, base);
    }

    public Status getStatus() {
        try {
            return getBuilder(getTarget(BASE_PATH)).get(Status.class);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed obtaining status", ex);
        }
    }
}
