package co.cloudify.rest.client;

import java.util.List;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import co.cloudify.rest.model.Blueprint;
import co.cloudify.rest.model.ListResponse;

public class BlueprintsClient extends AbstractCloudifyClient {
	public BlueprintsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}
	
	public List<Blueprint> list() {
		ListResponse<Blueprint> response = jsonGet("/api/v3.1/blueprints").invoke(new GenericType<ListResponse<Blueprint>>() {});
		return response.getItems();
	}
}
