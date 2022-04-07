export declare namespace TokensWidget {
    export interface DataItem {
        id: string;
        description: string | null;
        expiration_date: Date | null;
        last_used: Date | null;
        username: string;
        value: string;
        role: string;
    }

    export type DataSortingKeys = 'created_at' | 'id' | 'secret_hash' | 'description' | 'last_used' | 'expiration_date';

    export interface Configuration {
        showExpiredTokens: boolean;
        pollingTime: number;
    }

    export type Data = Stage.Types.WidgetData<Stage.Types.PaginatedResponse<DataItem>>;
}
