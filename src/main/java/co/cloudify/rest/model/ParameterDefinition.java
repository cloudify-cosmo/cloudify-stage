package co.cloudify.rest.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class ParameterDefinition implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private String type;
    @XmlElement(name = "default")
    private Object defaultValue;
    private String description;

    public String getType() {
        return type;
    }

    public Object getDefaultValue() {
        return defaultValue;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("type", type)
                .append("defaultValue", defaultValue)
                .append("description", description)
                .toString();
    }
}
