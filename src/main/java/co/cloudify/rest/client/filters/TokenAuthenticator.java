package co.cloudify.rest.client.filters;

import java.io.IOException;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.ext.Provider;

/**
 * A {@link ClientRequestFilter} implementation for token-based authentication.
 * 
 * @author	Isaac Shabtay
 */
@Provider
public class TokenAuthenticator implements ClientRequestFilter {
	private static final String	AUTH_TOKEN_HEADER = "Authentication-Token";
	
    private final String token;

    public TokenAuthenticator(final String token) {
        this.token = token;
    }

    @Override
    public void filter(ClientRequestContext requestContext) throws IOException {
        requestContext.getHeaders().putSingle(AUTH_TOKEN_HEADER, token);
    }
}