package co.cloudify.rest.client;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import co.cloudify.rest.model.Deployment;
import co.cloudify.rest.model.ListResponse;

public class DeploymentsClient extends AbstractCloudifyClient {
	public DeploymentsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}

	protected WebTarget getDeploymentTarget(final String id) {
		return getTarget("/api/v3.1/deployments/{id}", Collections.singletonMap("id", id));
	}
	
	public List<Deployment> list() {
		ListResponse<Deployment> response = jsonGet("/api/v3.1/deployments").invoke(new GenericType<ListResponse<Deployment>>() {});
		return response.getItems();
	}
	
	public Deployment get(final String id) {
		WebTarget target = getDeploymentTarget(id);
		return getBuilder(target).get(Deployment.class);
	}
	
	public Deployment create(final String id, final String blueprintId,
			final Map<String, Object> inputs) {
		Builder builder = getBuilder(getDeploymentTarget(id));
		Map<String, Object> depCreate = new HashMap<>();
		depCreate.put("inputs", inputs);
		depCreate.put("blueprint_id", blueprintId);
		Invocation invocation = builder.buildPut(Entity.json(depCreate));
		Deployment response = invocation.invoke(Deployment.class);
		return response;
	}
	
	public void delete(final String id) {
		WebTarget target = getDeploymentTarget(id);
		getBuilder(target).delete();
	}
}
