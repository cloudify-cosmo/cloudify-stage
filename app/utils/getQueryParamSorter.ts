const getQueryParamSorter = (params: Record<string, any> = {}) => {
    const order = Object.keys(params);

    return (a: string, b: string) => {
        return order.indexOf(a) >= order.indexOf(b);
    };
};

export default getQueryParamSorter;
