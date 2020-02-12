package co.cloudify.rest.client;

import java.io.IOException;
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
        String token = String.format("%s:%s",  username, password);
        //	TODO: Check why this doesn't work.
//        String authHeader = String.format("BASIC %s", Base64.getEncoder().encodeToString(
//        		StandardCharsets.UTF_8.encode(token).array()));
        String authHeader = String.format("BASIC %s", Base64.getEncoder().encodeToString(
        		token.getBytes("UTF-8")));
        MultivaluedMap<String, Object> headers = requestContext.getHeaders();
        headers.putSingle(HttpHeaders.AUTHORIZATION, authHeader);
        headers.putSingle(TENANT_HEADER, tenant);
    }
}