package co.cloudify.rest.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
public class Metadata implements Serializable {
	/**	Serialization UID. */
	private static final long serialVersionUID = 1L;

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
