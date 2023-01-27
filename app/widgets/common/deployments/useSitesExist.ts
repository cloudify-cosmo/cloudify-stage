import { useEffect, useState } from "react";


function useSitesExist(toolbox: Stage.Types.Toolbox) {
    const [sitesExist, setSitesExist] = useState(false);

    useEffect(() => {
        toolbox.getManager().doGet('/sites?_size=1').then((response: any) => {
            const sites = response.items;
            if (sites.length > 0) {
                setSitesExist(true);
            }
            setSitesExist(false);
        });
    }, []);

    return [sitesExist];
}

export default useSitesExist;