package co.cloudify.rest.client;

import java.security.NoSuchAlgorithmException;

import javax.net.ssl.SSLContext;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

import co.cloudify.rest.client.filters.BasicAuthenticator;
import co.cloudify.rest.client.filters.TenantFilter;
import co.cloudify.rest.client.filters.TokenAuthenticator;
import co.cloudify.rest.model.Token;

/**
 * <p>Focal point for all Cloudify REST operations.</p>
 * <p>Use {@link #create(String, String, String, boolean, String)} to create a
 * {@link CloudifyClient} instance.</p>
 * 
 * @author	Isaac Shabtay
 */
public class CloudifyClient extends AbstractCloudifyClient {
	protected BlueprintsClient blueprintsClient;
	protected DeploymentsClient deploymentsClient;
	protected ExecutionsClient executionsClient;
	protected EventsClient eventsClient;
	protected PluginsClient pluginsClient;
	protected TokensClient tokensClient;
	
	protected CloudifyClient(Client restClient, WebTarget base) {
		super(restClient, base);
		blueprintsClient = new BlueprintsClient(api, base);
		deploymentsClient = new DeploymentsClient(api, base);
		executionsClient = new ExecutionsClient(api, base);
		eventsClient = new EventsClient(api, base);
		pluginsClient = new PluginsClient(api, base);
		tokensClient = new TokensClient(api, base);
	}

	public static CloudifyClient create(
			String host, String username, String password,
			boolean secure, String tenant) {
		return create(host, username, password, null, secure, tenant);
	}
	
	public static CloudifyClient create(
			final String host, final String token,
			final boolean secure, final String tenant) {
		return create(host, null, null, token, secure, tenant);
	}
	
	public static CloudifyClient create(
			final String host, final String username,
			final String password, final String token,
			final boolean secure, final String tenant) {
		//	TODO: Add support for specifying certs.
		SSLContext sslContext;
		try {
			sslContext = SSLContext.getInstance("SSL");
		} catch (NoSuchAlgorithmException ex) {
			throw new IllegalStateException("Failed obtaining SSL context", ex);
		}
		Client client = ClientBuilder
				.newBuilder()
				.sslContext(sslContext)
				.build();
		if (username != null && password != null) {
			client.register(new BasicAuthenticator(username, password));
		}
		client.register(new TenantFilter(tenant));
		if (token != null) {
			client.register(new TokenAuthenticator(token));
		}
		String endpoint = String.format("%s://%s", secure ? "https" : "http", host);
		WebTarget baseTarget = client.target(endpoint);
		return new CloudifyClient(client, baseTarget);
	}
	
	public CloudifyClient withToken() {
		Token token = tokensClient.getToken();
		api.register(new TokenAuthenticator(token.getValue()));
		return this;
	}

	public BlueprintsClient getBlueprintsClient() {
		return blueprintsClient;
	}
	
	public DeploymentsClient getDeploymentsClient() {
		return deploymentsClient;
	}
	
	public ExecutionsClient getExecutionsClient() {
		return executionsClient;
	}
	
	public EventsClient getEventsClient() {
		return eventsClient;
	}
	
	public PluginsClient getPluginsClient() {
		return pluginsClient;
	}
	
	public TokensClient getTokensClient() {
		return tokensClient;
	}
}
