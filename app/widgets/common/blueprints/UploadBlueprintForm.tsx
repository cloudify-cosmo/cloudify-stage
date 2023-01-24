import React from 'react';
import { isEmpty, isNil, includes, noop } from 'lodash';
import type { UrlOrFileInputProps } from 'cloudify-ui-components/typings/components/form/UrlOrFileInput/UrlOrFileInput';
import Consts from '../Consts';
import BlueprintActions from './BlueprintActions';
import UploadBlueprintBasicForm from './UploadBlueprintBasicForm';
import type { UploadBlueprintBasicFormProps } from './UploadBlueprintBasicForm';
import StageUtils from '../../../utils/stageUtils';
import { Form } from '../../../components/basic';

const t = StageUtils.getT('widgets.common.blueprintUpload.inputs');

interface UploadBlueprintFormProps {
    blueprintUrl?: string;
    blueprintFile?: File | null;
    blueprintName?: string;
    blueprintYamlFile?: string;
    imageUrl?: string;
    imageFile?: File | null;
    errors?: {
        blueprintYamlFile?: string;
        blueprintName?: string;
        blueprintUrl?: string;
        imageUrl?: string;
    };
    loading?: boolean;
    showErrorsSummary?: boolean;
    onChange: (value: Record<string, any>) => void;
    toolbox: Stage.Types.WidgetlessToolbox;
    uploadState?: string;
    clearErrors?: () => void;
}

type UploadBlueprintFormPropsDefaults = Required<
    Pick<
        UploadBlueprintFormProps,
        | 'blueprintUrl'
        | 'blueprintFile'
        | 'blueprintName'
        | 'blueprintYamlFile'
        | 'imageUrl'
        | 'imageFile'
        | 'errors'
        | 'loading'
        | 'showErrorsSummary'
        | 'clearErrors'
    >
>;

type UploadBlueprintFormPropsWithDefaults = UploadBlueprintFormProps & UploadBlueprintFormPropsDefaults;

interface UploadBlueprintFormState {
    loading: boolean;
    yamlFiles: any[];
}

const defaultProps: UploadBlueprintFormPropsDefaults = {
    blueprintUrl: '',
    blueprintFile: null,
    blueprintName: '',
    blueprintYamlFile: '',
    imageUrl: '',
    imageFile: null,
    errors: {},
    loading: false,
    showErrorsSummary: true,
    clearErrors: noop
};

const initialState: UploadBlueprintFormState = {
    loading: false,
    yamlFiles: []
};

export default class UploadBlueprintForm extends React.Component<
    UploadBlueprintFormPropsWithDefaults,
    UploadBlueprintFormState
> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = defaultProps;

    static initialState = initialState;

    static DEFAULT_BLUEPRINT_YAML_FILE = Consts.defaultBlueprintYamlFileName;

    static NO_ERRORS = { errors: {} };

    actions: BlueprintActions;

    constructor(props: UploadBlueprintFormPropsWithDefaults) {
        super(props);

        this.state = UploadBlueprintForm.initialState;

        this.actions = new BlueprintActions(props.toolbox);
    }

    componentDidMount() {
        const { blueprintFile, blueprintUrl, onChange } = this.props;
        this.setState(UploadBlueprintForm.initialState);

        if ((!isEmpty(blueprintUrl) && StageUtils.Url.isUrl(blueprintUrl)) || !isNil(blueprintFile)) {
            this.setState({ loading: true });
            this.actions
                .doListYamlFiles(blueprintUrl, blueprintFile, false)
                .then(data => {
                    this.setState({ yamlFiles: data, loading: false });
                })
                .catch((error: any) => {
                    this.setState({ yamlFiles: [], loading: false });
                    onChange({ errors: { error } });
                });
        }
    }

    onBlueprintUrlBlur = () => {
        const { blueprintUrl, onChange } = this.props;
        if (isEmpty(blueprintUrl) || !StageUtils.Url.isUrl(blueprintUrl)) {
            this.setState({ yamlFiles: [] }, this.resetErrors);
            return;
        }

        this.setState({ loading: true }, () => onChange({ blueprintFile: null }));

        this.actions
            .doListYamlFiles(blueprintUrl, null, true)
            .then(data => {
                this.setState({ yamlFiles: data, loading: false }, () => {
                    const blueprintName = data.shift();
                    const blueprintYamlFile = includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                        ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                        : data[0];
                    onChange({ ...UploadBlueprintForm.NO_ERRORS, blueprintName, blueprintYamlFile });
                });
            })
            .catch((error: any) => {
                this.setState({ loading: false }, () =>
                    onChange({ errors: { error: error.message }, blueprintName: '', blueprintYamlFile: '' })
                );
            });
    };

    onBlueprintFileChange: UrlOrFileInputProps['onChangeFile'] = file => {
        const { blueprintFile, onChange } = this.props;
        if (!file) {
            this.setState({ yamlFiles: [] }, this.resetErrors);
            if (blueprintFile) {
                onChange({
                    blueprintFile: null,
                    blueprintUrl: '',
                    blueprintName: '',
                    blueprintYamlFile: ''
                });
            }
            return;
        }

        this.setState({ loading: true });
        this.actions
            .doListYamlFiles('', file, true)
            .then(data => {
                const blueprintName = data.shift();
                const blueprintYamlFile = includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                    ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                    : data[0];
                this.setState({ yamlFiles: data, loading: false }, () => {
                    onChange({
                        ...UploadBlueprintForm.NO_ERRORS,
                        blueprintFile: file,
                        blueprintUrl: file.name,
                        blueprintName,
                        blueprintYamlFile
                    });
                });
            })
            .catch((error: any) => {
                this.setState({ loading: false }, () =>
                    onChange({ errors: { error: error.message }, blueprintName: '', blueprintYamlFile: '' })
                );
            });
    };

    onBlueprintImageChange: UrlOrFileInputProps['onChangeFile'] = file => {
        if (file) {
            const { onChange } = this.props;
            onChange({ ...UploadBlueprintForm.NO_ERRORS, imageUrl: file.name, imageFile: file });
        }
    };

    onBlueprintUrlChange: UrlOrFileInputProps['onChangeUrl'] = blueprintUrl => {
        const { onChange } = this.props;
        onChange({ ...UploadBlueprintForm.NO_ERRORS, blueprintUrl, blueprintFile: null });
    };

    onBlueprintImageUrlChange: UrlOrFileInputProps['onChangeUrl'] = imageUrl => {
        const { onChange } = this.props;
        onChange({ ...UploadBlueprintForm.NO_ERRORS, imageUrl, imageFile: null });
    };

    handleInputChange: UploadBlueprintBasicFormProps['onInputChange'] = (_proxy, field) => {
        const { onChange } = this.props;
        onChange({
            ...UploadBlueprintForm.NO_ERRORS,
            ...Form.fieldNameValue(field as { name: string; value: unknown; type: string })
        });
    };

    resetErrors = () => {
        const { onChange } = this.props;
        onChange(UploadBlueprintForm.NO_ERRORS);
    };

    render() {
        const { loading: loadingState, yamlFiles } = this.state;
        const {
            blueprintYamlFile,
            blueprintName,
            errors,
            loading: loadingProp,
            showErrorsSummary,
            uploadState,
            clearErrors
        } = this.props;

        return (
            <UploadBlueprintBasicForm
                errors={showErrorsSummary ? errors : {}}
                blueprintYamlFile={blueprintYamlFile}
                blueprintName={blueprintName}
                yamlFiles={yamlFiles}
                uploadState={uploadState}
                formLoading={loadingState}
                blueprintUploading={loadingProp}
                yamlFileHelp={t('blueprintYamlFile.label')}
                onInputChange={this.handleInputChange}
                onErrorsDismiss={clearErrors}
                firstFormField={
                    <Form.Field
                        label={t('blueprintPackage.label')}
                        required
                        error={errors.blueprintUrl}
                        help={t('blueprintPackage.help')}
                    >
                        <Form.UrlOrFile
                            name="blueprint"
                            placeholder={t('blueprintPackage.placeholder')}
                            onChangeUrl={this.onBlueprintUrlChange}
                            onBlurUrl={this.onBlueprintUrlBlur}
                            onChangeFile={this.onBlueprintFileChange}
                        />
                    </Form.Field>
                }
                lastFormField={
                    <Form.Field label="Blueprint icon" error={errors.imageUrl} help={t('blueprintIcon.help')}>
                        <Form.UrlOrFile
                            name="image"
                            placeholder={t('blueprintIcon.placeholder')}
                            onChangeUrl={this.onBlueprintImageUrlChange}
                            onChangeFile={this.onBlueprintImageChange}
                            onBlurUrl={noop}
                        />
                    </Form.Field>
                }
            />
        );
    }
}
