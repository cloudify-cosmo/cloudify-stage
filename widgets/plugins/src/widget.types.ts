import type { DataTableConfiguration } from 'app/utils/GenericConfig';
import type { Visibility } from 'app/widgets/common/types';

// TODO Norbert: Evaluate if this typing is accurate
export interface FetchedPluginItem {
    /* eslint-disable camelcase */
    created_by: string;
    distribution: string;
    distribution_release: string;
    icon: string;
    id: string;
    title: string;
    package_name: string;
    package_version: string;
    supported_platform: string;
    visibility: Visibility;
    uploaded_at: string;
    /* eslint-enable camelcase */
}

export namespace PluginsWidget {
    export type Data = Stage.Types.PaginatedResponse<FetchedPluginItem>;
    export type Configuration = DataTableConfiguration;
    export type Parameters = Stage.Types.ManagerGridParams;
}
