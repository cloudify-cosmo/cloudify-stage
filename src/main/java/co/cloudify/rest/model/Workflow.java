package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Workflow implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private String name;
    private String operation;
    private String plugin;

    @XmlElement(name = "created_at")
    private Date createdAt;
    @XmlElement
    private Map<String, ParameterDefinition> parameters;

    public String getName() {
        return name;
    }

    public String getOperation() {
        return operation;
    }

    public String getPlugin() {
        return plugin;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Map<String, ParameterDefinition> getParameters() {
        return parameters;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("name", name)
                .append("operation", operation)
                .append("plugin", plugin)
                .append("createdAt", createdAt)
                .append("parameters", parameters)
                .toString();
    }
}
