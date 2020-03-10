package co.cloudify.rest.client.exceptions;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response.StatusType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Generic exception thrown when receiving a bad response code from
 * Cloudify Manager.
 * 
 * @author Isaac Shabtay
 */
public class CloudifyClientException extends RuntimeException {
    /** Logger. */
    private static final Logger logger = LoggerFactory.getLogger(CloudifyClientException.class);

    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    /** Bad status, if such encountered. */
    private StatusType status;

    /** The request path. */
    private String requestPath;

    /** Internal exception data. */
    private CloudifyClientExceptionData exceptionData;

    public CloudifyClientException() {
        super();
    }

    public CloudifyClientException(final String msg) {
        super(msg);
    }

    public static CloudifyClientException create(final String msg, final Throwable root) {
        CloudifyClientExceptionData exceptionData = null;
        String exceptionDataText;
        if (root instanceof WebApplicationException) {
            try {
                exceptionData = CloudifyClientExceptionData.fromWebAppException((WebApplicationException) root);
                exceptionDataText = String.format("internal exception data=%s", exceptionData.toString());
            } catch (Exception ex) {
                exceptionDataText = String.format("<failed parsing: %s>", ex);
                logger.error("Failed extracting underlying data from exception", ex);
            }
        } else {
            exceptionDataText = null;
        }

        String finalMessage;

        if (exceptionData != null) {
            finalMessage = String.format("%s [%s]", msg != null ? msg : "<no message>", exceptionDataText);
        } else {
            finalMessage = msg;
        }

        return new CloudifyClientException(finalMessage, root);
    }

    protected CloudifyClientException(final String msg, final Throwable root) {
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

    public CloudifyClientExceptionData getExceptionData() {
        return exceptionData;
    }
}
