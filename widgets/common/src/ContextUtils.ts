import { castArray, isEmpty } from 'lodash';

type StringOrArrayContextParameters = 'blueprintId' | 'deploymentId' | 'nodeId' | 'nodeInstanceId' | 'executionId';
type AllContextParamaters = StringOrArrayContextParameters | 'eventFilter';

export default class ContextUtils {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    public getValue(resourceName: AllContextParamaters) {
        return this.toolbox.getContext().getValue(resourceName);
    }

    public getFirstValue(resourceName: StringOrArrayContextParameters) {
        const resourceIds = this.toolbox.getContext().getValue(resourceName);
        return castArray(resourceIds)[0];
    }

    public getArrayValue(resourceName: StringOrArrayContextParameters) {
        const resourceIds = this.toolbox.getContext().getValue(resourceName);
        return isEmpty(resourceIds) ? [] : castArray(resourceIds);
    }
}

// NOTE: alias name to avoid name shadowing inside the namespace
const ContextUtilsAlias = ContextUtils;
declare global {
    namespace Stage.Common {
        const ContextUtils: typeof ContextUtilsAlias;
    }
}

Stage.defineCommon({
    name: 'ContextUtils',
    common: ContextUtils
});
