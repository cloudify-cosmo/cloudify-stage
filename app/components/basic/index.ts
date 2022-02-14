/**
 * Components exposed from here are available for all widgets (built-in and custom through Stage.Basic global).
 *
 * Remember to update `widgets-components.md` file in https://github.com/cloudify-cosmo/docs.getcloudify.org
 * whenever you change list of exported components in this file.
 */

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
    StrictConfirmProps,
    Tab,
    Table
} from 'semantic-ui-react';

import {
    Alert,
    ApproveButton,
    CancelButton,
    Checkmark,
    CopyToClipboardButton,
    Confirm,
    DateInput,
    DateRangeInput,
    DataSegment,
    DataTable,
    Dropdown,
    EditableLabel,
    ErrorMessage,
    Form,
    FullScreenSegment,
    GenericField,
    HighlightText,
    KeyIndicator,
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
import MarkerClusterGroup from 'react-leaflet-markercluster';

import { Map, TileLayer, Marker, Popup as LeafletPopup, Tooltip, FeatureGroup, CircleMarker } from 'react-leaflet';
import type { ComponentType } from 'react';
import type { InferProps } from 'prop-types';

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

/**
 * NOTE: buttons have limited props defined in their propTypes, making it hard to use in TypeScript.
 * TODO(RD-1563): remove assertions after adding missing prop types
 */
const ApproveButtonWithCorrectProps = (ApproveButton as unknown) as typeof Button;
const CancelButtonWithCorrectProps = (CancelButton as unknown) as typeof Button;
const ConfirmWithCorrectProps = (Confirm as unknown) as ComponentType<StrictConfirmProps>;
const ErrorMessageWithCorrectReturnType = (ErrorMessage as unknown) as ComponentType<
    InferProps<typeof ErrorMessage['propTypes']>
>;

// DEPRECIATED
// NOTE: It can be safely removed with the major version change
const UnsafelyTypedFormField = Form.Field;
const UnsafelyTypedFormGroup = Form.Group;

export {
    Accordion,
    Alert,
    ApproveButtonWithCorrectProps as ApproveButton,
    Breadcrumb,
    Button,
    CancelButtonWithCorrectProps as CancelButton,
    Card,
    Checkbox,
    Checkmark,
    ConfirmWithCorrectProps as Confirm,
    Container,
    CopyToClipboardButton,
    DateInput,
    DateRangeInput,
    DataSegment,
    DataTable,
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
    UnsafelyTypedFormField,
    UnsafelyTypedFormGroup,
    VisibilityIcon,
    VisibilityField
};
