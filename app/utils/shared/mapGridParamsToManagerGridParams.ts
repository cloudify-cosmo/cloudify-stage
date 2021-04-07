/* eslint no-underscore-dangle: ["error", { "allow": ["_sort", "_search", "_size", "_offset"] }] */
declare global {
    namespace Stage.Types {
        interface GridParams {
            sortColumn?: string;
            sortAscending?: boolean;
            _search?: string;
            pageSize?: number;
            currentPage?: number;
        }

        interface ManagerGridParams {
            _sort?: string;
            _search?: string;
            _size?: number;
            _offset?: number;
        }
    }
}

export default function mapGridParamsToManagerGridParams(
    gridParams: Stage.Types.GridParams
): Stage.Types.ManagerGridParams {
    const managerGridParams: Stage.Types.ManagerGridParams = {};

    if (gridParams.sortColumn) {
        managerGridParams._sort = `${gridParams.sortAscending ? '' : '-'}${gridParams.sortColumn}`;
    }

    if (gridParams._search) {
        managerGridParams._search = gridParams._search;
    }

    if (gridParams.pageSize) {
        managerGridParams._size = gridParams.pageSize;
    }

    if (gridParams.currentPage && gridParams.pageSize) {
        managerGridParams._offset = (gridParams.currentPage - 1) * gridParams.pageSize;
    }

    return managerGridParams;
}
