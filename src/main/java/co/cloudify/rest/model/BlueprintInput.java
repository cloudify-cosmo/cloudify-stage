package co.cloudify.rest.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
public class BlueprintInput {
	@XmlElement
	private String type;
	@XmlElement(name = "default")
	private Object defaultValue;
	@XmlElement
	private String description;
	@XmlElement
	private List<InputConstraint> constraints;

	@Override
	public String toString() {
		return new ToStringBuilder(this)
				.append("type", type)
				.append("defaultValue", defaultValue)
				.append("description", description)
				.append("constraints", constraints)
				.toString();
	}
}
