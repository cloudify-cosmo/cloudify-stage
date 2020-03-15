package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Map;

import javax.xml.bind.annotation.XmlElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class StatusService implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private ServiceStatus status;
    @XmlElement(name = "is_remote")
    private boolean remote;
    @XmlElement(name = "extra_info")
    private Map<String, Object> extraInfo;

    public ServiceStatus getStatus() {
        return status;
    }

    public boolean isRemote() {
        return remote;
    }

    public Map<String, Object> getExtraInfo() {
        return extraInfo;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("status", status)
                .append("remote", remote)
                .append("extraInfo", extraInfo)
                .toString();
    }
}
