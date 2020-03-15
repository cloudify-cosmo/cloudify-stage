package co.cloudify.rest.model;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.xml.bind.annotation.adapters.XmlAdapter;

/**
 * An {@link XmlAdapter} implementation that marshals/unmarshals input constraints.
 * 
 * @author Isaac Shabtay
 */
public class InputConstraintAdapter extends XmlAdapter<Map<String, Object>, InputConstraint> {
    @Override
    public Map<String, Object> marshal(InputConstraint v) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String key = v.getType().name();
        Object value;
        switch (v.getType()) {
        case valid_values:
            value = v.getValue();
            break;
        default:
            throw new IllegalArgumentException(String.format("Unexpected constraint type: %s", v.getType()));
        }
        map.put(key, value);
        return map;
    }

    @Override
    public InputConstraint unmarshal(Map<String, Object> v) throws Exception {
        Set<String> keys = v.keySet();
        if (keys.size() != 1) {
            throw new IllegalArgumentException(String.format("Expected exactly one key in map, found %s", keys.size()));
        }
        String key = keys.iterator().next();
        ConstraintType constraintType = ConstraintType.valueOf(key);
        Object constraintValue;

        switch (constraintType) {
        case valid_values:
            constraintValue = v.get(key);
            break;
        default:
            throw new IllegalArgumentException(String.format("Unexpected constraint type: %s", constraintType));
        }

        InputConstraint constraint = new InputConstraint();
        constraint.setType(constraintType);
        constraint.setValue(constraintValue);
        return constraint;
    }
}
