package co.cloudify.rest.client.exceptions;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
public class CloudifyClientExceptionData implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    @XmlElement
    private String message;
    @XmlElement(name = "error_code")
    private String errorCode;
    @XmlElement(name = "server_traceback")
    private String serverTraceback;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getServerTraceback() {
        return serverTraceback;
    }

    public void setServerTraceback(String serverTraceback) {
        this.serverTraceback = serverTraceback;
    }

    public static CloudifyClientExceptionData fromCloudifyClientException(final CloudifyClientException ex)
            throws IOException {
        Throwable cause = ex.getCause();
        if (cause instanceof WebApplicationException) {
            return fromWebAppException((WebApplicationException) cause);
        }
        return null;
    }

    public static CloudifyClientExceptionData fromWebAppException(final WebApplicationException ex) throws IOException {
        CloudifyClientExceptionData exceptionData = null;
        Response response = ex.getResponse();
        if (response != null) {
            exceptionData = new CloudifyClientExceptionData();
            Object entity = response.getEntity();
            if (entity instanceof InputStream) {
                InputStream is = (InputStream) entity;
                try (JsonReader reader = Json.createReader(is)) {
                    JsonObject jsonObj = reader.readObject();
                    exceptionData.setMessage(jsonObj.getString("message", "<not provided>"));
                    exceptionData.setErrorCode(jsonObj.getString("error_code", "<not provided>"));
                    exceptionData.setServerTraceback(jsonObj.getString("server_traceback", "<not provided>"));
                } finally {
                    is.close();
                }
            }
        }
        return exceptionData;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("message", message)
                .append("errorCode", errorCode)
                .append("serverTraceback", serverTraceback)
                .toString();
    }
}
