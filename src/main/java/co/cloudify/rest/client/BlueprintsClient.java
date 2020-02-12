package co.cloudify.rest.client;

import java.util.Collections;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;

import org.apache.commons.lang3.Validate;

import co.cloudify.rest.model.Blueprint;
import co.cloudify.rest.model.ListResponse;

public class BlueprintsClient extends AbstractCloudifyClient {
	/**	Base API path. */
	private static final String BASE_PATH = "/api/v3.1/blueprints";
	/**	Path for specific resource. */
	private static final String ID_PATH = BASE_PATH + "/{id}";

	public BlueprintsClient(Client restClient, WebTarget base) {
		super(restClient, base);
	}
	
	protected Builder getBlueprintsBuilder(final String ... args) {
		Validate.isTrue(args.length <= 1);
		return getBuilder(getTarget(args.length == 1 ? ID_PATH : BASE_PATH, args.length == 1 ? Collections.singletonMap("id", args[0]) : Collections.emptyMap()));
	}
	
	/**
	 * Get a blueprint by ID.
	 * 
	 * @param	id	ID of blueprint to get
	 * 
	 * @return	A {@link Blueprint} instance for that blueprint.
	 */
	public Blueprint get(final String id) {
		return getBlueprintsBuilder(id).get(Blueprint.class);
	}
	
	/**
	 * Deletes a blueprint.
	 * 
	 * @param	id	ID of blueprint to delete
	 */
	public void delete(final String id) {
		getBlueprintsBuilder(id).delete();
	}
	
	/**
	 * @return	A list of all blueprints.
	 */
	public ListResponse<Blueprint> list() {
		return getBlueprintsBuilder().get(new GenericType<ListResponse<Blueprint>>() {});
	}
}
