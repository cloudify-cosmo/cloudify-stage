import Picker from './RolesPicker';
import Presenter from './RolesPresenter';
import * as Utils from './utils';

const RolesCommon = {
    Picker,
    Presenter,
    Utils
};

declare global {
    namespace Stage.Common {
        const Roles: typeof RolesCommon;
    }
}

Stage.defineCommon({
    name: 'Roles',
    common: RolesCommon
});
