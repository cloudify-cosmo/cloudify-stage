package co.cloudify.rest.client;

import java.io.IOException;
import java.net.HttpURLConnection;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientResponseContext;
import javax.ws.rs.client.ClientResponseFilter;
import javax.ws.rs.core.Response.Status.Family;
import javax.ws.rs.core.Response.StatusType;
import javax.ws.rs.ext.Provider;

import co.cloudify.rest.client.exceptions.CloudifyClientException;
import co.cloudify.rest.client.exceptions.CloudifyNotFoundException;

/**
 * Filter to use for all responses received from Cloudify Manager.
 * 
 * @author	Isaac Shabtay
 */
@Provider
public class ResponseProcessor implements ClientResponseFilter {
	@Override
	public void filter(ClientRequestContext requestContext, ClientResponseContext responseContext) throws IOException {
		//	Current implementation is very naive: anything that is not 2xx, will
		//	be treated similarly, throwing an exception with the status info.
		StatusType statusInfo = responseContext.getStatusInfo();
		int statusCode = statusInfo.getStatusCode();
		if (statusInfo.getFamily() != Family.SUCCESSFUL) {
			throw statusCode == HttpURLConnection.HTTP_NOT_FOUND ?
					new CloudifyNotFoundException(requestContext.getUri().getPath(), statusInfo) :
						new CloudifyClientException(requestContext.getUri().getPath(), statusInfo);
		}
	}
}
