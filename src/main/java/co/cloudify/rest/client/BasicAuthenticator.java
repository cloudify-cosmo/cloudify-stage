package co.cloudify.rest.client;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.MultivaluedMap;
import javax.xml.bind.DatatypeConverter;

public class BasicAuthenticator implements ClientRequestFilter {
    private final String username;
    private final String password;
    private final String tenant;

    public BasicAuthenticator(String username, String password, String tenant) {
        this.username = username;
        this.password = password;
        this.tenant = tenant;
    }

    public void filter(ClientRequestContext requestContext) throws IOException {
        MultivaluedMap<String, Object> headers = requestContext.getHeaders();
        final String basicAuthentication = getBasicAuthentication();
        headers.add("Authorization", basicAuthentication);
        headers.add("Tenant", tenant);
    }

    private String getBasicAuthentication() {
        String token = String.format("%s:%s",  this.username, this.password);
        try {
            return "BASIC " + DatatypeConverter.printBase64Binary(token.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException ex) {
            throw new IllegalStateException("Failed encoding basic authentication token", ex);
        }
    }
}