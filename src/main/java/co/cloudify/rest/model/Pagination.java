package co.cloudify.rest.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Pagination {
	@XmlElement
	private long total;
	@XmlElement
	private long offset;
	@XmlElement
	private long size;
}
