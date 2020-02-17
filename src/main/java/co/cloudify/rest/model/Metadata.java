package co.cloudify.rest.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
public class Metadata {
	@XmlElement
	private Pagination pagination;
	
	public Pagination getPagination() {
		return pagination;
	}
	
	@Override
	public String toString() {
		return new ToStringBuilder(this)
				.append("pagination", pagination)
				.toString();
	}
}
