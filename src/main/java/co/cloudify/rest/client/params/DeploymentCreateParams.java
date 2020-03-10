package co.cloudify.rest.client.params;

import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class DeploymentCreateParams {
    @XmlElement
    private Map<String, Object> inputs;

    @XmlElement(name = "blueprint_id")
    private String blueprintId;

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
}
