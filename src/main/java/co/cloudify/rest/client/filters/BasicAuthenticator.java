package co.cloudify.rest.client.filters;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.ext.Provider;

import org.apache.commons.lang3.Validate;

/**
 * A {@link ClientRequestFilter} implementation for HTTP basic authentication.
 * 
 * @author Isaac Shabtay
 */
@Provider
public class BasicAuthenticator implements ClientRequestFilter {
    private final String username;
    private final String password;

    public BasicAuthenticator(String username, String password) {
        Validate.notBlank(username);
        Validate.notBlank(password);
        this.username = username;
        this.password = password;
    }

    @Override
    public void filter(ClientRequestContext requestContext) throws IOException {
        String token = String.format("%s:%s", username, password);
        // TODO: Check why this doesn't work.
        // byte[] asBytes = StandardCharsets.UTF_8.encode(token).array();
        byte[] asBytes = token.getBytes(StandardCharsets.UTF_8.name());
        String authHeader = String.format(
                "BASIC %s",
                Base64.getEncoder().encodeToString(asBytes));
        requestContext.getHeaders().putSingle(HttpHeaders.AUTHORIZATION, authHeader);
    }
}
