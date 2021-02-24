import { mapValues, startCase } from 'lodash';
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
    name: string;
    /** Displayed in the table header */
    label: ReactNode;
    /** The name of the backend field to sort by */
    sortFieldName?: string;
    width?: string;
    tooltip?: ReactNode;
    render(deployment: any): ReactNode;
}

type WithOptionalProperties<T, OptionalProperties extends keyof T> = Omit<T, OptionalProperties> &
    Partial<Pick<T, OptionalProperties>>;

const namelessDeploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    WithOptionalProperties<DeploymentsViewColumnDefinition, 'name' | 'label'>
> = {
    status: {
        name: '',
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
        name: 'Subenvironments',
        // eslint-disable-next-line react/jsx-no-undef
        label: <Stage.Basic.Icon name="object group" />,
        width: '5%',
        tooltip: 'Sub-environments (Total)',
        render() {
            // TODO(RD-1224): display correct number of subenvironments
            return '0';
        }
    },
    subservicesCount: {
        name: 'Subservices',
        // eslint-disable-next-line react/jsx-no-undef
        label: <Stage.Basic.Icon name="cube" />,
        width: '5%',
        tooltip: 'Services (Total)',
        render() {
            // TODO(RD-1224): display correct number of subservices
            return '0';
        }
    }
};

export const deploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    DeploymentsViewColumnDefinition
> = mapValues(namelessDeploymentsViewColumnDefinitions, (columnDefinition, columnId) => {
    const name = columnDefinition.name ?? startCase(columnId);
    const label = columnDefinition.label ?? name;

    return {
        ...columnDefinition,
        name,
        label
    };
});
