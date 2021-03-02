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
    ReadmeModal,
    ResourceVisibility,
    VisibilityField,
    VisibilityIcon
} from 'cloudify-ui-components';

import { Map, TileLayer, Marker, Popup as LeafletPopup } from 'react-leaflet';
import type { ComponentType } from 'react';

Modal.defaultProps = {
    ...Modal.defaultProps,
    closeOnDimmerClick: false
};

const Leaflet = {
    Map,
    TileLayer,
    Marker,
    Popup: LeafletPopup
};

/**
 * NOTE: buttons have limited props defined in their propTypes, making it hard to use in TypeScript.
 * TODO(RD-1563): remove assertions after adding missing prop types
 */
const ApproveButtonWithCorrectProps = (ApproveButton as unknown) as typeof Button;
const CancelButtonWithCorrectProps = (CancelButton as unknown) as typeof Button;
const ConfirmWithCorrectProps = (Confirm as unknown) as ComponentType<StrictConfirmProps>;

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
    Divider,
    Dropdown,
    EditableLabel,
    ErrorMessage,
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
    Progress,
    Radio,
    ResourceVisibility,
    ReadmeModal,
    Segment,
    Sidebar,
    Step,
    Tab,
    Table,
    VisibilityIcon,
    VisibilityField
};
