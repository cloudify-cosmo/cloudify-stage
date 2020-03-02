package co.cloudify.rest.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@XmlRootElement
public class Pagination implements Serializable {
	/**	Serialization UID. */
	private static final long serialVersionUID = 1L;

	@XmlElement
	private long total;
	@XmlElement
	private long offset;
	@XmlElement
	private long size;
	
	public long getTotal() {
		return total;
	}
	
	public long getOffset() {
		return offset;
	}
	
	public long getSize() {
		return size;
	}
	
	@Override
	public String toString() {
		return new ToStringBuilder(this, ToStringStyle.JSON_STYLE)
				.append("total", total)
				.append("offset", offset)
				.append("size", size)
				.toString();
	}
}
