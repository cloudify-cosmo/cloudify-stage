package co.cloudify.rest.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "items")
public class ListResponse<T> {
	@XmlElement
	private List<T> items;
	
	@XmlElement
	private Metadata metadata;
	
	public List<T> getItems() {
		return items;
	}
}
