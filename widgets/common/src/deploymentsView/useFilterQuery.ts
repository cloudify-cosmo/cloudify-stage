import { useQuery } from 'react-query';

export default function useFilterQuery(toolbox: Stage.Types.Toolbox, filterId?: string) {
    const result = useQuery<Stage.Common.Filters.Rule[]>(
        `/filters/deployments/${filterId}`,
        ({ queryKey: url }) =>
            filterId
                ? toolbox
                      .getManager()
                      .doGet(url)
                      .then(filtersResponse => filtersResponse.value)
                : [],
        { refetchOnWindowFocus: false, keepPreviousData: true }
    );

    if (result.isIdle) {
        /**
         * NOTE: handling the `isIdle` state is necessary for TypeScript's type-narrowing to exclude `undefined` from
         * the possible values of `result.data`.
         *
         * Such a case should not happen naturally, unless an `enabled` option is added to `useQuery`. If it is added,
         * it should be here.
         */
        throw new Error('Idle state for fetching filter rules is not implemented.');
    }

    return result;
}
