package co.cloudify.rest.model.helpers;

import java.text.SimpleDateFormat;

import org.apache.commons.lang3.StringUtils;

import co.cloudify.rest.model.Event;

public class EventsHelper {
	private static final String DATETIME_FORMAT = "dd-MM-yyyy hh:mm:ss";
	
	public static String formatEvent (final Event event) {
		StringBuilder formatted = new StringBuilder();
		if (event.getLevel() != null) {
			formatted.append(String.format(" [%-5s]", event.getLevel()));
		} else {
			formatted.append(String.format(" %7s", StringUtils.EMPTY));
		}
		if (event.getDeploymentId() != null) {
			formatted.append(String.format(" <%s>", event.getDeploymentId()));
		}
		if (event.getNodeInstanceId() != null) {
			StringBuilder s = new StringBuilder(event.getNodeInstanceId());
			if (event.getOperation() != null) {
				s.append(".");
				s.append(StringUtils.substringAfterLast(event.getOperation(), "."));
			}
			formatted.append(String.format(" [%s]", s));
		}
		return String.format("%s%s %s", new SimpleDateFormat(DATETIME_FORMAT).format(event.getReportedTimestamp()), formatted, event.getMessage());
	}
}
