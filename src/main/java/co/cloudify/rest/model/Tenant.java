package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
public class Tenant implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private String name;
    @XmlElement(name = "user_roles")
    private List<String> userRoles;
    private int groups;
    private int users;

    public String getName() {
        return name;
    }

    public int getGroups() {
        return groups;
    }

    public int getUsers() {
        return users;
    }

    public List<String> getUserRoles() {
        return userRoles;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("name", name)
                .append("groups", groups)
                .append("users", users)
                .append("userRoles", userRoles)
                .toString();
    }
}
