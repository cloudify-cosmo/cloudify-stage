/**
 * Created by pposel on 06/02/2017.
 */
import Consts from './consts';
import RepositoryViewPropTypes from './props/RepositoryViewPropTypes';
import RepositoryViewDefaultProps from './props/RepositoryViewDefaultProps';

export default function RepositoryCatalog({
    data,
    fetchData,
    noDataMessage,
    onReadme,
    onSelect,
    onUpload,
    readmeLoading,
    widget
}) {
    const { DataSegment, Grid, Image, Button, Header } = Stage.Basic;

    const catalogItems = data.items.map(item => {
        return (
            <Grid.Column key={item.id}>
                <DataSegment.Item
                    selected={item.isSelected}
                    onClick={event => {
                        event.stopPropagation();
                        onSelect(item);
                    }}
                    className="fullHeight"
                >
                    <Grid className="contentBlock">
                        <Grid.Row className="bottomDivider">
                            <Grid.Column width="16">
                                <Image src={Stage.Utils.Url.url(item.image_url)} />
                                <Header>
                                    <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                                        {item.name}
                                    </a>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Column width="16">{item.description}</Grid.Column>

                        <Grid.Row className="noPadded">
                            <Grid.Column width="4">
                                <h5 className="ui icon header">Created</h5>
                            </Grid.Column>
                            <Grid.Column width="12">{item.created_at}</Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="noPadded">
                            <Grid.Column width="4">
                                <h5 className="ui icon header">Updated</h5>
                            </Grid.Column>
                            <Grid.Column width="12">{item.updated_at}</Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <div>
                        <Button
                            circular
                            icon="info"
                            loading={readmeLoading === item.name}
                            className="readmeButton icon"
                            onClick={event => {
                                event.stopPropagation();
                                onReadme(item.name, item.readme_url);
                            }}
                        />
                        <Button
                            icon="upload"
                            content="Upload"
                            className="uploadButton labeled icon"
                            onClick={event => {
                                event.stopPropagation();
                                onUpload(item.name, item.zip_url, item.image_url, item.main_blueprint);
                            }}
                        />
                    </div>
                </DataSegment.Item>
            </Grid.Column>
        );
    });

    const catalogRows = [];
    let row = [];
    _.each(catalogItems, (catalogItem, index) => {
        row.push(catalogItem);
        if ((index + 1) % 3 === 0) {
            catalogRows.push(
                <Grid.Row key={catalogRows.length + 1} columns="3">
                    {row}
                </Grid.Row>
            );
            row = [];
        }
    });
    if (row.length > 0) {
        catalogRows.push(
            <Grid.Row key={catalogRows.length + 1} columns="3">
                {row}
            </Grid.Row>
        );
    }

    // Show pagination only in case when data is provided from GitHub
    const pageSize = data.source === Consts.GITHUB_DATA_SOURCE ? widget.configuration.pageSize : data.total;
    const totalSize = data.source === Consts.GITHUB_DATA_SOURCE ? data.total : -1;

    return (
        <div>
            <DataSegment
                totalSize={totalSize}
                pageSize={pageSize}
                fetchData={fetchData}
                className="repositoryCatalog"
                noDataMessage={noDataMessage}
            >
                <Grid>{catalogRows}</Grid>
            </DataSegment>
        </div>
    );
}

RepositoryCatalog.propTypes = RepositoryViewPropTypes;
RepositoryCatalog.defaultProps = RepositoryViewDefaultProps;
