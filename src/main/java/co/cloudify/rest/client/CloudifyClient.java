package co.cloudify.rest.client;

import java.security.NoSuchAlgorithmException;

import javax.net.ssl.SSLContext;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

/**
 * Focal point for all Cloudify REST operations.
 * 
 * @author	Isaac Shabtay
 */
public class CloudifyClient extends AbstractCloudifyClient {
	protected BlueprintsClient blueprintsClient;
	protected DeploymentsClient deploymentsClient;
	protected ExecutionsClient executionsClient;
	protected EventsClient eventsClient;
	
	protected CloudifyClient(Client restClient, WebTarget base) {
		super(restClient, base);
		blueprintsClient = new BlueprintsClient(api, base);
		deploymentsClient = new DeploymentsClient(api, base);
		executionsClient = new ExecutionsClient(api, base);
		eventsClient = new EventsClient(api, base);
	}

	public static CloudifyClient create(
			String host, String username, String password,
			boolean secure, String tenant) {
		SSLContext sslContext;
		try {
			sslContext = SSLContext.getInstance("SSL");
		} catch (NoSuchAlgorithmException ex) {
			throw new IllegalStateException("Failed obtaining SSL context", ex);
		}
		//	TODO: Add certs
		
		Client client = ClientBuilder
				.newBuilder()
				.sslContext(sslContext)
				.build();
		client.register(new BasicAuthenticator(username, password, tenant));
		client.register(new ResponseProcessor());
		String endpoint = String.format("%s://%s", secure ? "https" : "http", host);
		WebTarget baseTarget = client.target(endpoint);
		CloudifyClient cClient = new CloudifyClient(client, baseTarget);
		return cClient;
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
}
