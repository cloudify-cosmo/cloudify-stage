package co.cloudify.rest.model;

import java.io.Serializable;
import java.util.Iterator;
import java.util.List;
import java.util.Spliterator;
import java.util.stream.Stream;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Encapsulates a list-style response from Cloudify Manager.
 * This class implements {@link Iterable}, to make it easier for callers
 * to obtain all list elements.
 * 
 * @author	Isaac Shabtay
 *
 * @param	<T>	type of contained items
 */
@XmlRootElement(name = "items")
public class ListResponse<T> implements Iterable<T>, Serializable {
	/**	Serialization UID. */
	private static final long serialVersionUID = 1L;

	@XmlElement
	private List<T> items;
	
	@XmlElement
	private Metadata metadata;
	
	/**
	 * @return	A {@link List} of all items.
	 */
	public List<T> getItems() {
		return items;
	}
	
	/**
	 * @return	The {@link Metadata} information.
	 */
	public Metadata getMetadata() {
		return metadata;
	}
	
	@Override
	public Iterator<T> iterator() {
		return items.iterator();
	}
	
	public Stream<T> stream() {
		return items.stream();
	}
	
	@Override
	public Spliterator<T> spliterator() {
		throw new UnsupportedOperationException();
	}
}
