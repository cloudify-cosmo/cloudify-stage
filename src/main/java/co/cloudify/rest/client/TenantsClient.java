package co.cloudify.rest.client;

import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.model.ListResponse;
import co.cloudify.rest.model.Tenant;

/**
 * A REST client for tenant-related operations.
 * 
 * @author Isaac Shabtay
 */
public class TenantsClient extends AbstractCloudifyClient {
    /** Base API path. */
    private static final String BASE_PATH = "/api/v3.1/tenants";

    public TenantsClient(Client restClient, WebTarget base) {
        super(restClient, base);
    }

    /**
     * @return A {@link List} of all tenants that this user is allowed to see.
     */
    public ListResponse<Tenant> list() {
        try {
            return getBuilder(getTarget(BASE_PATH)).get(new GenericType<ListResponse<Tenant>>() {});
        } catch (WebApplicationException ex) {
            throw CloudifyClientException.create("Failed listing tenants", ex);
        }
    }
}
