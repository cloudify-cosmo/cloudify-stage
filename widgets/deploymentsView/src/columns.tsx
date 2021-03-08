import { mapValues } from 'lodash';
import type { ReactNode } from 'react';
import type { SemanticICONS } from 'semantic-ui-react';

// NOTE: the order in the array determines the order in the UI
export const deploymentsViewColumnIds = [
    'status',
    'name',
    'blueprintName',
    'environmentType',
    'location',
    'subenvironmentsCount',
    'subservicesCount'
] as const;

export type DeploymentsViewColumnId = typeof deploymentsViewColumnIds[number];

export interface DeploymentsViewColumnDefinition {
    /** Displayed in the configuration */
    name: string;
    /** Displayed in the table header */
    label: ReactNode;
    /** The name of the backend field to sort by */
    sortFieldName?: string;
    width?: string;
    tooltip?: ReactNode;
    render(deployment: any): ReactNode;
}

const partialDeploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    Omit<Stage.Types.WithOptionalProperties<DeploymentsViewColumnDefinition, 'label'>, 'name' | 'tooltip'>
> = {
    status: {
        width: '20px',
        render() {
            const { Icon } = Stage.Basic;
            // TODO(RD-1222): render icon based on status
            const iconNames: SemanticICONS[] = ['exclamation', 'pause', 'checkmark', 'spinner'];

            return <Icon name={iconNames[Math.floor(Math.random() * iconNames.length)]} />;
        }
    },
    name: {
        sortFieldName: 'id',
        render(deployment) {
            return deployment.id;
        }
    },
    blueprintName: {
        sortFieldName: 'blueprint_id',
        render(deployment) {
            return deployment.blueprint_id;
        }
    },
    environmentType: {
        render(_deployment) {
            // TODO(RD-1224): add rendering correct environment type
            return 'Environment Type';
        }
    },
    location: {
        sortFieldName: 'site_name',
        render(deployment) {
            return deployment.site_name;
        }
    },
    subenvironmentsCount: {
        label: <Stage.Basic.Icon name="object group" />,
        width: '1em',
        render() {
            // TODO(RD-1224): display correct number of subenvironments
            return '0';
        }
    },
    subservicesCount: {
        label: <Stage.Basic.Icon name="cube" />,
        width: '1em',
        render() {
            // TODO(RD-1224): display correct number of subservices
            return '0';
        }
    }
};

const i18nPrefix = 'widgets.deploymentsView.columns';

export const deploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    DeploymentsViewColumnDefinition
> = mapValues(
    partialDeploymentsViewColumnDefinitions,
    (columnDefinition, columnId): DeploymentsViewColumnDefinition => {
        const name = Stage.i18n.t(`${i18nPrefix}.${columnId}.name`);
        const label = columnDefinition.label ?? name;
        const tooltip: string | null = Stage.i18n.t(`${i18nPrefix}.${columnId}.tooltip`, { defaultValue: null });

        return {
            ...columnDefinition,
            name,
            label,
            tooltip
        };
    }
);
