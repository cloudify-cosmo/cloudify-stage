package co.cloudify.rest.model;

public enum EventLevel {
	debug(1),
	info(2),
	warning(3),
	error(4);
	
	private int numeric;
	
	private EventLevel(int numeric) {
		this.numeric = numeric;
	}
	
	public int numeric() {
		return numeric;
	}
}
