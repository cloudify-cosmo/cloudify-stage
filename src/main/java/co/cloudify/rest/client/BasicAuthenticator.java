package co.cloudify.rest.client;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.Provider;

/**
 * A {@link ClientRequestFilter} implementation for HTTP basic authentication.
 * 
 * @author	Isaac Shabtay
 */
@Provider
public class BasicAuthenticator implements ClientRequestFilter {
	private static final String	TENANT_HEADER = "Tenant";
	
    private final String username;
    private final String password;
    private final String tenant;

    public BasicAuthenticator(String username, String password, String tenant) {
        this.username = username;
        this.password = password;
        this.tenant = tenant;
    }

    @Override
    public void filter(ClientRequestContext requestContext) throws IOException {
        MultivaluedMap<String, Object> headers = requestContext.getHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, getBasicAuthentication());
        headers.add(TENANT_HEADER, tenant);
    }

    private String getBasicAuthentication() {
        String token = String.format("%s:%s",  username, password);
        return String.format("BASIC %s", Base64.getEncoder().encodeToString(
        		StandardCharsets.UTF_8.encode(token).array()));
    }
}