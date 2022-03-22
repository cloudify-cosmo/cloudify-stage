import Actions from './PluginActions';
import Icon from './PluginIcon';
import UploadForm from './UploadPluginForm';
import UploadModal from './UploadPluginModal';

const PluginsCommon = {
    Actions,
    Icon,
    UploadForm,
    UploadModal
};

declare global {
    namespace Stage.Common {
        const Plugins: typeof PluginsCommon;
    }
}

Stage.defineCommon({
    name: 'Plugins',
    common: PluginsCommon
});
