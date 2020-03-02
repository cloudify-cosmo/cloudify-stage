package co.cloudify.rest.client.filters;

import java.io.IOException;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.ext.Provider;

/**
 * A {@link ClientRequestFilter} implementation for adding the tenant header.
 * 
 * @author	Isaac Shabtay
 */
@Provider
public class TenantFilter implements ClientRequestFilter {
	private static final String	TENANT_HEADER = "Tenant";

	private String tenant;
	
    public TenantFilter(final String tenant) {
        this.tenant = tenant;
    }

    @Override
    public void filter(ClientRequestContext requestContext) throws IOException {
        requestContext.getHeaders().putSingle(TENANT_HEADER, tenant);
    }
}