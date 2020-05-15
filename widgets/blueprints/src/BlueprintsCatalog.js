/**
 * Created by kinneretzin on 08/01/2017.
 */

export default class BlueprintsCatalog extends React.Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectBlueprint: PropTypes.func,
        onDeleteBlueprint: PropTypes.func,
        onCreateDeployment: PropTypes.func,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        noDataMessage: PropTypes.string
    };

    static defaultProps = {
        fetchData: () => {},
        onSelectBlueprint: () => {},
        onDeleteBlueprint: () => {},
        onCreateDeployment: () => {},
        onSetVisibility: () => {},
        allowedSettingTo: ['tenant', 'global'],
        noDataMessage: ''
    };

    render() {
        const {
            allowedSettingTo,
            data,
            fetchData,
            noDataMessage,
            onCreateDeployment,
            onDeleteBlueprint,
            onSelectBlueprint,
            onSetVisibility,
            widget
        } = this.props;
        const { DataSegment, Grid, Image, Button, Label, ResourceVisibility, Header } = Stage.Basic;

        const index = 0;
        const blueprintsItems = data.items.map(item => {
            return (
                <Grid.Column key={item.id}>
                    <DataSegment.Item
                        selected={item.isSelected}
                        className={`fullHeight ${item.id}`}
                        onClick={event => {
                            event.stopPropagation();
                            onSelectBlueprint(item);
                        }}
                    >
                        <Grid>
                            <Grid.Row className="bottomDivider">
                                <Grid.Column width="16">
                                    <Image src={Stage.Utils.Url.url(`/ba/image/${item.id}`)} />
                                    <Header>
                                        <a href="javascript:void(0)" className="breakWord">
                                            {item.id}
                                        </a>
                                    </Header>
                                    <ResourceVisibility
                                        visibility={item.visibility}
                                        onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                                        allowedSettingTo={allowedSettingTo}
                                        className="rightFloated"
                                    />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Column width="16">{item.description}</Grid.Column>

                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <h5 className="ui icon header">Created</h5>
                                </Grid.Column>
                                <Grid.Column width="9">{item.created_at}</Grid.Column>
                            </Grid.Row>

                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <h5 className="ui icon header">Updated</h5>
                                </Grid.Column>
                                <Grid.Column width="9">{item.updated_at}</Grid.Column>
                            </Grid.Row>

                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <h5 className="ui icon header">Creator</h5>
                                </Grid.Column>
                                <Grid.Column width="9">{item.created_by}</Grid.Column>
                            </Grid.Row>

                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <h5 className="ui icon header">Main Blueprint File</h5>
                                </Grid.Column>
                                <Grid.Column width="9">{item.main_file_name}</Grid.Column>
                            </Grid.Row>

                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <h5 className="ui icon header"># Deployments</h5>
                                </Grid.Column>
                                <Grid.Column width="9">
                                    <Label color="green" horizontal>
                                        {item.depCount}
                                    </Label>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                        <Grid.Column width="16">
                            <div style={{ height: '50px' }} />
                        </Grid.Column>
                    </DataSegment.Item>

                    <div className="actionButtons">
                        <Button
                            icon="trash"
                            content="Delete"
                            className="icon"
                            basic
                            onClick={event => {
                                event.stopPropagation();
                                onDeleteBlueprint(item);
                            }}
                        />

                        <Button
                            icon="rocket"
                            content="Deploy"
                            className="labeled icon"
                            onClick={event => {
                                event.stopPropagation();
                                onCreateDeployment(item);
                            }}
                        />
                    </div>
                </Grid.Column>
            );
        });

        const blueprintsRows = [];
        let row = [];
        _.each(blueprintsItems, (blueprintItem, index) => {
            row.push(blueprintItem);
            if ((index + 1) % 3 === 0) {
                blueprintsRows.push(
                    <div key={blueprintsRows.length + 1} className="three column row">
                        {row}
                    </div>
                );
                row = [];
            }
        });
        if (row.length > 0) {
            blueprintsRows.push(
                <div key={blueprintsRows.length + 1} className="three column row">
                    {row}
                </div>
            );
        }

        return (
            <div>
                <DataSegment
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    fetchData={fetchData}
                    className="blueprintCatalog"
                    searchable
                    noDataMessage={noDataMessage}
                >
                    <Grid>{blueprintsRows}</Grid>
                </DataSegment>
            </div>
        );
    }
}
