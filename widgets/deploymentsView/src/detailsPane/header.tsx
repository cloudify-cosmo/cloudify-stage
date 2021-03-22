import type { FunctionComponent } from 'react';

import './header.scss';

export interface DetailsPaneHeaderProps {
    deploymentName: string;
}

const DetailsPaneHeader: FunctionComponent<DetailsPaneHeaderProps> = ({ deploymentName }) => {
    const { Header } = Stage.Basic;

    return (
        <div className="detailsPaneHeader">
            <Header>{deploymentName}</Header>
        </div>
    );
};
export default DetailsPaneHeader;

DetailsPaneHeader.propTypes = {
    deploymentName: PropTypes.string.isRequired
};
