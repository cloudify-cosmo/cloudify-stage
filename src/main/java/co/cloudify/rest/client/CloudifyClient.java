package co.cloudify.rest.client;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

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
			String username, String password, String host,
			boolean secure, String tenant) {
		Client client = ClientBuilder
				.newClient()
				.register(new BasicAuthenticator(username, password, tenant));
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
