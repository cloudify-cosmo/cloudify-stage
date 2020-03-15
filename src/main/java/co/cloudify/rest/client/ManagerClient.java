package co.cloudify.rest.client;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.model.Status;
import co.cloudify.rest.model.Version;

public class ManagerClient extends AbstractCloudifyClient {
    /** Status API path. */
    private static final String STATUS_PATH = "/api/v3.1/status";
    /** Version API path. */
    private static final String VERSION_PATH = "/api/version";

    public ManagerClient(Client restClient, WebTarget base) {
        super(restClient, base);
    }

    public Version getVersion() {
        try {
            return getBuilder(getTarget(VERSION_PATH)).get(Version.class);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed obtaining version", ex);
        }
    }

    public Status getStatus() {
        try {
            return getBuilder(getTarget(STATUS_PATH)).get(Status.class);
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed obtaining status", ex);
        }
    }
}
