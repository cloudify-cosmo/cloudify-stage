/**
 * Created by kinneretzin on 08/01/2017.
 */
import BlueprintsViewPropTypes from './props/BlueprintsViewPropTypes';
import BlueprintsViewDefaultProps from './props/BlueprintsViewDefaultProps';

export default class BlueprintsCatalog extends React.Component {
    static propTypes = BlueprintsViewPropTypes;

    static defaultProps = BlueprintsViewDefaultProps;

    render() {
        const {
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
        const { toolbox } = this.props;
        const manager = toolbox.getManager();

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
                                        allowedSettingTo={['tenant', 'global']}
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
                            <div style={{ height: '80px' }} />
                        </Grid.Column>
                    </DataSegment.Item>

                    <div className="actionButtons">
                        <Button
                            icon="trash"
                            content="Delete"
                            basic
                            labelPosition="left"
                            onClick={event => {
                                event.stopPropagation();
                                onDeleteBlueprint(item);
                            }}
                        />

                        <Button
                            icon="rocket"
                            content="Deploy"
                            labelPosition="left"
                            onClick={event => {
                                event.stopPropagation();
                                onCreateDeployment(item);
                            }}
                        />

                        {!manager.isCommunityEdition() && (
                            <Button
                                icon="external share"
                                content="Edit a copy in Composer"
                                labelPosition="left"
                                onClick={event => {
                                    event.stopPropagation();
                                    new Stage.Common.BlueprintActions(toolbox).doEditInComposer(
                                        item.id,
                                        item.main_file_name
                                    );
                                }}
                            />
                        )}
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
