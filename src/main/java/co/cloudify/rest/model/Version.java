package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Date;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Version implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    private String version;
    private String edition;
    private String build;
    private Date date;
    private String commit;
    private String distribution;
    @XmlElement(name = "distro_release")
    private String distroRelease;

    public String getVersion() {
        return version;
    }

    public String getEdition() {
        return edition;
    }

    public String getBuild() {
        return build;
    }

    public Date getDate() {
        return date;
    }

    public String getCommit() {
        return commit;
    }

    public String getDistribution() {
        return distribution;
    }

    public String getDistroRelease() {
        return distroRelease;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("version", version)
                .append("edition", edition)
                .append("build", build)
                .append("date", date)
                .append("commit", commit)
                .append("distribution", distribution)
                .append("distroRelease", distroRelease)
                .toString();
    }
}
