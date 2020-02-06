package co.cloudify.rest.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@XmlRootElement
public class BlueprintInput {
	@XmlElement
	private String type;
	@XmlElement(name = "default")
	private Object defaultValue;
	@XmlElement
	private String description;
	@XmlElement
	private List<Object> constraints;

	public BlueprintInput() {
		super();
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Object getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(Object defaultValue) {
		this.defaultValue = defaultValue;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	@Override
	public String toString() {
		return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
				.append("type", type)
				.append("defaultValue", defaultValue)
				.append("description", description)
				.toString();
	}
}
