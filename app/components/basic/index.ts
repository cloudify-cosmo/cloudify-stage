/**
 * Components exposed from here are available for all widgets (built-in and custom through Stage.Basic global).
 *
 * Remember to update `widgets-components.md` file in https://github.com/cloudify-cosmo/docs.getcloudify.org
 * whenever you change list of exported components in this file.
 */

import {
    Alert,
    ApproveButton,
    CancelButton,
    Checkmark,
    Confirm,
    CopyToClipboardButton,
    DataSegment,
    DataTable,
    DateInput,
    DateRangeInput,
    Dropdown,
    EditableLabel,
    ErrorMessage,
    Form,
    FullScreenSegment,
    GenericField,
    HighlightText,
    KeyIndicator,
    LabelsList,
    Loading,
    LoadingOverlay,
    Logo,
    Menu,
    MessageContainer,
    Modal,
    NodesTree,
    Popup,
    PopupConfirm,
    PopupHelp,
    PopupMenu,
    ProductVersion,
    ReadmeModal,
    ResourceVisibility,
    VisibilityField,
    VisibilityIcon
} from 'cloudify-ui-components';
import type { InferProps } from 'prop-types';
import type { ComponentType } from 'react';

import { CircleMarker, FeatureGroup, Map, Marker, Popup as LeafletPopup, TileLayer, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import type { StrictConfirmProps } from 'semantic-ui-react';
import {
    Accordion,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    Container,
    Dimmer,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Input,
    Item,
    Label,
    List,
    Loader,
    Message,
    Portal,
    Progress,
    Radio,
    Ref,
    Segment,
    Sidebar,
    Step,
    Tab,
    Table
} from 'semantic-ui-react';

Modal.defaultProps = {
    ...Modal.defaultProps,
    closeOnDimmerClick: false
};

const Leaflet = {
    Map,
    TileLayer,
    Marker,
    Popup: LeafletPopup,
    Tooltip,
    FeatureGroup,
    CircleMarker,
    MarkerClusterGroup
};

// TODO(RD-5712) Remove once Confirm component is fully migrated to TypeScript
const ConfirmWithCorrectProps = Confirm as unknown as ComponentType<StrictConfirmProps>;

// TODO(RD-5716) Remove once ErrorMessage component is fully migrated to TypeScript
const ErrorMessageWithCorrectReturnType = ErrorMessage as unknown as ComponentType<
    InferProps<typeof ErrorMessage['propTypes']>
>;

type AnyProps = Record<string, any>;

// TODO(RD-5720) Remove once DataInput component is fully migrated to TypeScript
const DateInputWithTemporaryProps = DateInput as unknown as ComponentType<AnyProps>;

// TODO(RD-5719) Remove once DataTable component is fully migrated to TypeScript
const DataTableWithTemporaryProps = DataTable as unknown as ComponentType<AnyProps> & {
    Row: React.FC<AnyProps>;
    Column: React.FC<AnyProps>;
    Data: React.FC<AnyProps>;
    Action: React.FC<AnyProps>;
    Filter: React.FC<AnyProps>;
    RowExpandable: React.FC<AnyProps>;
    DataExpandable: React.FC<AnyProps>;
};

// TODO(RD-5718) Remove once DataSegment component is fully migrated to TypeScript
const DataSegmentWithTemporaryProps = DataSegment as unknown as ComponentType<AnyProps> & {
    Item: React.FC<AnyProps>;
    Action: React.FC<AnyProps>;
};

export {
    Accordion,
    Alert,
    ApproveButton,
    Breadcrumb,
    Button,
    CancelButton,
    Card,
    Checkbox,
    Checkmark,
    ConfirmWithCorrectProps as Confirm,
    Container,
    CopyToClipboardButton,
    DateInputWithTemporaryProps as DateInput,
    DateRangeInput,
    DataSegmentWithTemporaryProps as DataSegment,
    DataTableWithTemporaryProps as DataTable,
    Dimmer,
    Divider,
    Dropdown,
    EditableLabel,
    ErrorMessageWithCorrectReturnType as ErrorMessage,
    Form,
    FullScreenSegment,
    GenericField,
    Grid,
    Header,
    HighlightText,
    Icon,
    Image,
    Input,
    Item,
    KeyIndicator,
    Label,
    LabelsList,
    Leaflet,
    List,
    Loader,
    Loading,
    LoadingOverlay,
    Logo,
    Menu,
    Message,
    MessageContainer,
    Modal,
    NodesTree,
    Popup,
    PopupConfirm,
    PopupHelp,
    PopupMenu,
    Portal,
    ProductVersion,
    Progress,
    Radio,
    ResourceVisibility,
    ReadmeModal,
    Ref,
    Segment,
    Sidebar,
    Step,
    Tab,
    Table,
    VisibilityIcon,
    VisibilityField
};
