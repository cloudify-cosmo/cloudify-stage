package co.cloudify.rest;

import co.cloudify.rest.client.CloudifyClient;
import co.cloudify.rest.client.EventsClient;
import co.cloudify.rest.client.ExecutionsClient;
import co.cloudify.rest.model.Event;
import co.cloudify.rest.model.Execution;
import co.cloudify.rest.model.helpers.EventsHelper;
import co.cloudify.rest.model.helpers.ExecutionsHelper;

public class ClientTest {
	public static void main(String []args) throws Exception {
		String host = args[0];
		String username = args[1];
		String password = args[2];
		String tenant;
		if (args.length > 3) {
			tenant = args[3];
		} else {
			tenant = "default_tenant";
		}
		
		CloudifyClient client = CloudifyClient.create(username, password, host, false, tenant);
//		BlueprintsClient blueprintsClient = client.getBlueprintsClient();
//		Iterable<Blueprint> list = blueprintsClient.list();
//		Blueprint bp = list.iterator().next();
//		System.err.println(bp.getPlan().getInputs());
//		Deployment d = client.getDeploymentsClient().get("d");
//		System.out.println(d.getInputs());
//		Deployment e = client.getDeploymentsClient().create("f", "b", d.getInputs(), false);
//		System.out.println(e);
		ExecutionsClient execClient = client.getExecutionsClient();
		Execution execution = execClient.get("17264e5d-f9d1-4087-8aa2-492c4336f18e");
		ExecutionsHelper.followExecution(client, execution);
		EventsClient eventsClient = client.getEventsClient();
		Iterable<Event> events = eventsClient.list(execution.getId(), true);
		for (Event event: events) {
			System.out.println(EventsHelper.formatEvent(event));
		}
	}
}
