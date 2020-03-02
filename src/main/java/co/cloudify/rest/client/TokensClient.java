package co.cloudify.rest.client;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.model.Token;

public class TokensClient extends AbstractCloudifyClient {
	/** Base API path. */
	private static final String BASE_PATH = "/api/v3.1/tokens";
	
	public TokensClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}
	
	public Token getToken() {
		try {
			return getBuilder(getTarget(BASE_PATH)).get(Token.class);
		} catch (WebApplicationException ex) {
			throw CloudifyClientException.create("Failed obtaining token", ex);
		}
	}
}
