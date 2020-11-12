/**
 * Created by pposel on 11/08/2017.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import CreatePageModal from './CreatePageModal';
import TemplateList from './TemplateList';
import { Segment, Header, DataTable, Icon, PopupConfirm, Label } from '../basic';
import StageUtils from '../../utils/stageUtils';

export default function Pages({
    onCanDeletePage,
    onCreatePage,
    onDeletePage,
    onEditPage,
    onPreviewPage,
    onSelectPage,
    pages
}) {
    return (
        <Segment color="red">
            <Header dividing as="h5">
                {i18n.t('templates.pageManagement.header', 'Pages')}
            </Header>

            <DataTable>
                <DataTable.Column label={i18n.t('templates.pageManagement.table.pageID', 'Page id')} width="25%" />
                <DataTable.Column label={i18n.t('templates.pageManagement.table.pageName', 'Page name')} width="25%" />
                <DataTable.Column label={i18n.t('templates.pageManagement.table.templates', 'Templates')} width="10%" />
                <DataTable.Column
                    label={i18n.t('templates.pageManagement.table.updatedAt', 'Updated at')}
                    width="15%"
                />
                <DataTable.Column
                    label={i18n.t('templates.pageManagement.table.updatedBy', 'Updated by')}
                    width="15%"
                />
                <DataTable.Column width="10%" />

                {pages.map(item => {
                    return (
                        <DataTable.RowExpandable key={item.id} expanded={item.selected}>
                            <DataTable.Row key={item.id} selected={item.selected} onClick={() => onSelectPage(item)}>
                                <DataTable.Data>
                                    <Header as="a" size="small">
                                        {item.id}
                                    </Header>
                                </DataTable.Data>
                                <DataTable.Data>{item.name}</DataTable.Data>
                                <DataTable.Data>
                                    <Label color="blue" horizontal>
                                        {_.size(item.templates)}
                                    </Label>
                                </DataTable.Data>
                                <DataTable.Data>
                                    {item.updatedAt && StageUtils.Time.formatLocalTimestamp(item.updatedAt)}
                                </DataTable.Data>
                                <DataTable.Data>{item.updatedBy}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    {item.custom ? (
                                        <div>
                                            <PopupConfirm
                                                trigger={<Icon name="remove" link onClick={e => e.stopPropagation()} />}
                                                content={i18n.t(
                                                    'templates.pageManagement.removeConfirm',
                                                    'Are you sure to remove this page?'
                                                )}
                                                onConfirm={() => onDeletePage(item)}
                                                onCanConfirm={() => onCanDeletePage(item)}
                                            />
                                            <Icon
                                                name="edit"
                                                link
                                                className="updatePageIcon"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    onEditPage(item);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <Icon
                                                name="search"
                                                link
                                                className="updatePageIcon"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    onPreviewPage(item);
                                                }}
                                            />
                                        </div>
                                    )}
                                </DataTable.Data>
                            </DataTable.Row>

                            <DataTable.DataExpandable key={item.id}>
                                <TemplateList templates={item.templates} />
                            </DataTable.DataExpandable>
                        </DataTable.RowExpandable>
                    );
                })}

                <DataTable.Action>
                    <CreatePageModal onCreatePage={onCreatePage} />
                </DataTable.Action>
            </DataTable>
        </Segment>
    );
}

Pages.propTypes = {
    onCanDeletePage: PropTypes.func,
    onCreatePage: PropTypes.func,
    onDeletePage: PropTypes.func,
    onEditPage: PropTypes.func,
    onPreviewPage: PropTypes.func,
    onSelectPage: PropTypes.func,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            custom: PropTypes.bool,
            id: PropTypes.string,
            name: PropTypes.string,
            selected: PropTypes.bool,
            templates: PropTypes.arrayOf(PropTypes.string),
            updatedAt: PropTypes.string,
            updatedBy: PropTypes.string
        })
    )
};

Pages.defaultProps = {
    onCanDeletePage: _.noop,
    onCreatePage: _.noop,
    onDeletePage: _.noop,
    onEditPage: _.noop,
    onPreviewPage: _.noop,
    onSelectPage: _.noop,
    pages: []
};
