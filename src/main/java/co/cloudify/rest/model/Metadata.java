package co.cloudify.rest.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Metadata {
	@XmlElement
	private Pagination pagination;
}
