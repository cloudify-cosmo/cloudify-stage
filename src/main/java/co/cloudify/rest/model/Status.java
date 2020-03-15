package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Map;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Status implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private String status;

    @XmlElement(required = false)
    private Map<String, StatusService> services;

    public String getStatus() {
        return status;
    }

    public Map<String, StatusService> getServices() {
        return services;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("status", status)
                .append("services", services)
                .toString();
    }
}
