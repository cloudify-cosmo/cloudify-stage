package co.cloudify.rest.client;

import java.io.IOException;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientResponseContext;
import javax.ws.rs.client.ClientResponseFilter;
import javax.ws.rs.core.Response.Status.Family;
import javax.ws.rs.core.Response.StatusType;
import javax.ws.rs.ext.Provider;

/**
 * Filter to use for all responses received from Cloudify Manager.
 * 
 * @author	Isaac Shabtay
 */
@Provider
public class ResponseProcessor implements ClientResponseFilter {
	@Override
	public void filter(ClientRequestContext requestContext, ClientResponseContext responseContext) throws IOException {
		StatusType statusInfo = responseContext.getStatusInfo();
		int statusCode = statusInfo.getStatusCode();
		if (statusInfo.getFamily() != Family.SUCCESSFUL) {
			if (responseContext.hasEntity()) {
//				InputStream is = responseContext.getEntityStream();
//				System.err.println(IOUtils.toString(is, StandardCharsets.UTF_8));
//				is = responseContext.getEntityStream();
//				System.err.println(IOUtils.toString(is, StandardCharsets.UTF_8));
			}
//			throw statusCode == HttpURLConnection.HTTP_NOT_FOUND ?
//					new CloudifyNotFoundException(requestContext.getUri().getPath(), statusInfo) :
//						new CloudifyClientException(requestContext.getUri().getPath(), statusInfo);
		}
	}
}
