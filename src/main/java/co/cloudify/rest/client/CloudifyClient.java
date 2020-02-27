package co.cloudify.rest.client;

import java.security.NoSuchAlgorithmException;

import javax.net.ssl.SSLContext;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

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
	
	protected CloudifyClient(Client restClient, WebTarget base) {
		super(restClient, base);
		blueprintsClient = new BlueprintsClient(api, base);
		deploymentsClient = new DeploymentsClient(api, base);
		executionsClient = new ExecutionsClient(api, base);
		eventsClient = new EventsClient(api, base);
		pluginsClient = new PluginsClient(api, base);
	}

	public static CloudifyClient create(
			String host, String username, String password,
			boolean secure, String tenant) {
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
		client.register(new BasicAuthenticator(username, password, tenant));
		String endpoint = String.format("%s://%s", secure ? "https" : "http", host);
		WebTarget baseTarget = client.target(endpoint);
		return new CloudifyClient(client, baseTarget);
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
}
