/**
 * Created by kinneretzin on 06/10/2016.
 */

import { ApproveButton, CancelButton } from './modal/ModalButtons';
import Confirm from './modal/Confirm';
import Alert from './modal/Alert';
import ReadmeModal from './modal/ReadmeModal';
import KeyIndicator from './KeyIndicator';
import ErrorMessage from './ErrorMessage';
import HighlightText from './HighlightText';
import Checkmark from './Checkmark';
import EditableLabel from './EditableLabel';
import DataTable from './dataTable/DataTable';
import DataSegment from './dataSegment/DataSegment';
import Loading from './Loading';
import GenericField from './form/GenericField';
import TimeFilter from './TimeFilter';
import MetricFilter from './MetricFilter';
import NodeFilter from './NodeFilter';
import NodeInstancesFilter from './NodeInstancesFilter';
import Form from './form/Form';
// NOTE: When you update this list, please also update list in: doc/index.md
import { Accordion, Breadcrumb, Button, Card, Checkbox, Container, Divider, Grid, Header, Icon, Image, Input, Item,
         Label, List, Loader, Message, Modal, Portal, Radio, Segment, Sidebar, Table } from 'semantic-ui-react'
import Graphs from './graphs';
import PopupMenu from './PopupMenu';
import Dropdown from './Dropdown';
import Menu from './Menu';
import NodesTree from './NodesTree';
import SplitterLayout from 'react-splitter-layout';
import Popup from './Popup';
import VisibilityField from '../../containers/VisibilityField';
import ResourceVisibility from '../../containers/ResourceVisibility';
import PopupConfirm from './PopupConfirm';
import PopupHelp from './PopupHelp';
import PageFilter from './PageFilter';
import CopyToClipboardButton from './CopyToClipboardButton';
import MaintenanceModeActivationButton from './maintenance/MaintenanceModeActivationButton';
import MaintenanceModeModal from './maintenance/MaintenanceModeModal';
import {Link} from 'react-router-dom';

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
    Confirm,
    Container,
    CopyToClipboardButton,
    DataSegment,
    DataTable,
    Divider,
    Dropdown,
    EditableLabel,
    ErrorMessage,
    Form,
    GenericField,
    Graphs,
    Grid,
    Header,
    HighlightText,
    Icon,
    Image,
    Input,
    Item,
    KeyIndicator,
    Label,
    List,
    Link,
    Loader,
    Loading,
    MaintenanceModeActivationButton,
    MaintenanceModeModal,
    Menu,
    Message,
    MetricFilter,
    Modal,
    NodeFilter,
    NodeInstancesFilter,
    NodesTree,
    PageFilter,
    Popup,
    PopupConfirm,
    PopupHelp,
    PopupMenu,
    Portal,
    ResourceVisibility,
    Radio,
    ReadmeModal,
    Segment,
    Sidebar,
    SplitterLayout,
    Table,
    TimeFilter,
    VisibilityField
};
