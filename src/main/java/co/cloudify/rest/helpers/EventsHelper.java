package co.cloudify.rest.helpers;

import java.text.SimpleDateFormat;

import org.apache.commons.lang3.StringUtils;

import co.cloudify.rest.model.Event;

public class EventsHelper {
    private static final String DATETIME_FORMAT = "yyyy-MM-dd hh:mm:ss";

    public static String formatEvent(final Event event) {
        return formatEvent(event, true);
    }

    /**
     * Returns the string representation of an event/log record.
     * 
     * @param event        event/log record
     * @param includeLevel if <code>true</code>, then the event's logging level will
     *                     be included
     * 
     * @return String representation.
     */
    public static String formatEvent(final Event event, final boolean includeLevel) {
        StringBuilder formatted = new StringBuilder();
        if (includeLevel) {
            if (event.getLevel() != null) {
                formatted.append(String.format(" [%-5s]", event.getLevel()));
            } else {
                formatted.append(String.format(" %7s", StringUtils.EMPTY));
            }
        }
        if (event.getDeploymentId() != null) {
            formatted.append(String.format(" <%s>", event.getDeploymentId()));
        }
        String nodeInstanceId = event.getNodeInstanceId();
        String sourceId = event.getSourceId();
        String targetId = event.getTargetId();

        if (nodeInstanceId != null || (sourceId != null && targetId != null)) {
            StringBuilder s = new StringBuilder(StringUtils.defaultString(sourceId, nodeInstanceId));
            if (targetId != null) {
                s.append("->");
                s.append(targetId);
            }

            if (event.getOperation() != null) {
                s.append(".");
                s.append(StringUtils.substringAfterLast(event.getOperation(), "."));
            }
            formatted.append(String.format(" [%s]", s));
        }
        return String.format("%s%s %s",
                new SimpleDateFormat(DATETIME_FORMAT).format(
                        event.getReportedTimestamp()),
                formatted,
                event.getMessage());
    }
}
