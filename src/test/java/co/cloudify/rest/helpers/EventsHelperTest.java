package co.cloudify.rest.helpers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Calendar;
import java.util.GregorianCalendar;

import org.junit.jupiter.api.Test;

import co.cloudify.rest.model.Event;
import co.cloudify.rest.model.EventLevel;

public class EventsHelperTest {
    @Test
    public void testFormatEventNodeInstance() throws Exception {
        Event event = new Event();
        event.setLevel(EventLevel.error);
        event.setDeploymentId("deployment-id");
        event.setNodeInstanceId("node-inst");
        event.setOperation("cloudify.interfaces.lifecycle.create");
        event.setMessage("test message");
        Calendar reported = GregorianCalendar.getInstance();
        reported.set(2020, 4, 30, 2, 0, 0);
        event.setReportedTimestamp(reported.getTime());
        String output = EventsHelper.formatEvent(event);
        assertEquals("2020-05-30 02:00:00 [error] <deployment-id> [node-inst.create] test message", output);
    }

    @Test
    public void testFormatEventRelationship() throws Exception {
        Event event = new Event();
        event.setLevel(EventLevel.error);
        event.setDeploymentId("deployment-id");
        event.setSourceId("source-id");
        event.setTargetId("target-id");
        event.setOperation("cloudify.interfaces.relationship_lifecycle.establish");
        event.setMessage("test message");
        Calendar reported = GregorianCalendar.getInstance();
        reported.set(2020, 4, 30, 2, 0, 0);
        event.setReportedTimestamp(reported.getTime());
        String output = EventsHelper.formatEvent(event);
        assertEquals("2020-05-30 02:00:00 [error] <deployment-id> [source-id->target-id.establish] test message",
                output);
    }
}
