package co.cloudify.rest.client.params;

import java.io.Serializable;
import java.util.Map;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class DeploymentCreateParams implements Serializable {
    /** Serialization UID. */
    private static final long serialVersionUID = 1L;

    @XmlElement(name = "blueprint_id")
    private String blueprintId;
    @XmlElement
    private Map<String, Object> inputs;

    public DeploymentCreateParams(final String blueprintId, final Map<String, Object> inputs) {
        super();
        setBlueprintId(blueprintId);
        setInputs(inputs);
    }

    public void setInputs(Map<String, Object> inputs) {
        this.inputs = inputs;
    }

    public void setBlueprintId(String blueprintId) {
        this.blueprintId = blueprintId;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("blueprintId", blueprintId)
                .append("inputs", inputs)
                .toString();
    }
}
