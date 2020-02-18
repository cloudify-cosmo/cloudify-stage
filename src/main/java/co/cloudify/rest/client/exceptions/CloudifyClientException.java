package co.cloudify.rest.client.exceptions;

import javax.ws.rs.core.Response.StatusType;

/**
 * Generic exception thrown when receiving a bad response code from
 * Cloudify Manager.
 * 
 * @author	Isaac Shabtay
 */
public class CloudifyClientException extends RuntimeException {
	/**	Serialization UID. */
	private static final long serialVersionUID = 1L;

	/**	Bad status, if such encountered. */
	private	StatusType	status;
	
	/**	The request path. */
	private String requestPath;
	
	public CloudifyClientException() {
		super();
	}
	
	public CloudifyClientException(final String msg) {
		super(msg);
	}
	
	public CloudifyClientException(final String msg, final Throwable root) {
		super(msg, root);
	}

	public CloudifyClientException(final String requestPath, final StatusType status) {
		this(String.format("Unexpected status encountered: %d (%s)", status.getStatusCode(),
				status.getReasonPhrase()), requestPath, status);
	}
	
	public CloudifyClientException(final String message, String requestPath, final StatusType status) {
		super(message);
		this.status = status;
		this.requestPath = requestPath;
	}
	
	public StatusType getStatus() {
		return status;
	}
	
	public String getRequestPath() {
		return requestPath;
	}
}
