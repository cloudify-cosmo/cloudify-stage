package co.cloudify.rest.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Token implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    @XmlElement
    private String username;
    @XmlElement
    private String value;
    @XmlElement
    private String role;

    public String getValue() {
        return value;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("username", username)
                .append("value", value)
                .append("role", role)
                .toString();
    }
}
