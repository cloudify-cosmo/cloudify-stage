package co.cloudify.rest.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement
public class Pagination {
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
		return new ToStringBuilder(this)
				.append("total", total)
				.append("offset", offset)
				.append("size", size)
				.toString();
	}
}
