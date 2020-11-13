import _ from 'lodash';
import { useSelector } from 'react-redux';
import stageUtils from '../utils/stageUtils';

export default function useWidgetsFilter() {
    const manager = useSelector(state => state.manager);

    return widgets =>
        _.filter(
            widgets,
            widget =>
                widget.definition &&
                stageUtils.isUserAuthorized(widget.definition.permission, manager) &&
                stageUtils.isWidgetPermitted(widget.definition.supportedEditions, manager)
        );
}
