package co.cloudify.rest.model;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
@XmlJavaTypeAdapter(value = InputConstraintAdapter.class)
public class InputConstraint {
	private ConstraintType type;
	private Object value;
	
	public ConstraintType getType() {
		return type;
	}
	
	public void setType(ConstraintType type) {
		this.type = type;
	}
	
	public Object getValue() {
		return value;
	}
	
	public void setValue(Object value) {
		this.value = value;
	}
	
	@Override
	public String toString() {
		return new ToStringBuilder(this)
				.append("type", type)
				.append("value", value)
				.toString();
	}
}
