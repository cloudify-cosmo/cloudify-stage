import React from 'react';

import type { PutPluginsTitleRequestQueryParams, PutPluginsTitleResponse } from 'backend/routes/Plugins.types';

const placeholders = {
    wagon: "Provide the plugin's wagon file URL or click browse to select a file",
    yaml: "Provide the plugin's YAML file URL or click browse to select a file",
    title: "Provide the plugin's title",
    icon: "Provide the plugin's icon file URL or click browse to select a file"
} as const;

const noErrors = { errors: {} };

type Error = {
    title: string;
};

export interface UploadPluginFormProps {
    errors?: Record<string, Error>;
    addRequiredMarks?: boolean;
    hidePlaceholders?: boolean;
    toolbox: Stage.Types.WidgetlessToolbox;
    onChange: (value: any) => void;
}

type UploadPluginFormPropsWithDefaults = UploadPluginFormProps &
    Required<Pick<UploadPluginFormProps, 'errors' | 'addRequiredMarks'>>;

interface UploadPluginFormState {
    title: string;
    pluginYamlUrl?: string;
    loading?: boolean;
}

class UploadPluginForm extends React.Component<UploadPluginFormPropsWithDefaults, UploadPluginFormState> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        addRequiredMarks: true,
        errors: {}
    };

    constructor(props: UploadPluginFormPropsWithDefaults) {
        super(props);
        this.state = { title: '' };
    }

    componentDidMount() {
        const { onChange: cbOnChange } = this.props;
        cbOnChange(noErrors);
    }

    onChange(fieldName: string, file: File | null, url: string) {
        const { onChange: cbOnChange } = this.props;
        cbOnChange({
            ...noErrors,
            [`${fieldName}File`]: file,
            [`${fieldName}Url`]: url
        });
    }

    createUrlOrFileFormField(
        fieldName: 'icon' | 'yaml' | 'wagon',
        required: boolean,
        onChangeUrl = _.noop,
        onChangeFile = _.noop,
        onBlurUrl = _.noop
    ) {
        const { errors, hidePlaceholders } = this.props;
        const { Form } = Stage.Basic;
        const urlProp = `${fieldName}Url`;
        return (
            <Form.Field label={`${fieldName} file`} required={required} key={fieldName} error={errors[urlProp]}>
                <Form.UrlOrFile
                    name={fieldName}
                    placeholder={hidePlaceholders ? '' : placeholders[fieldName]}
                    onChangeUrl={url => {
                        this.onChange(fieldName, null, url);
                        onChangeUrl(url);
                    }}
                    onChangeFile={file => {
                        this.onChange(fieldName, file || null, file ? file.name : '');
                        onChangeFile(file);
                    }}
                    onBlurUrl={onBlurUrl}
                />
            </Form.Field>
        );
    }

    render() {
        const { addRequiredMarks, errors, hidePlaceholders, toolbox } = this.props;
        const { loading, title } = this.state;
        const { Form, LoadingOverlay } = Stage.Basic;

        const onTitleChange = (titleChange: Record<'title', string>) => {
            const { onChange } = this.props;
            onChange({
                ...noErrors,
                ...titleChange
            });
            this.setState(titleChange);
        };

        const formFields = [
            this.createUrlOrFileFormField('wagon', addRequiredMarks),
            this.createUrlOrFileFormField(
                'yaml',
                addRequiredMarks,
                pluginYamlUrl => this.setState({ pluginYamlUrl }),
                pluginYamlFile => {
                    if (pluginYamlFile && !title) {
                        this.setState({ loading: true });
                        toolbox
                            .getInternal()
                            .doUpload<PutPluginsTitleResponse>('/plugins/title', {
                                files: { yaml_file: pluginYamlFile }
                            })
                            .then(onTitleChange)
                            .finally(() => this.setState({ loading: false }));
                    }
                },
                () => {
                    const { pluginYamlUrl } = this.state;
                    if (pluginYamlUrl && !title) {
                        this.setState({ loading: true });
                        toolbox
                            .getInternal()
                            .doPut<PutPluginsTitleResponse, never, PutPluginsTitleRequestQueryParams>(
                                '/plugins/title',
                                { params: { yamlUrl: pluginYamlUrl } }
                            )
                            .then(onTitleChange)
                            .finally(() => this.setState({ loading: false }));
                    }
                }
            ),
            <Form.Field label="Plugin title" required={addRequiredMarks} key="title" error={errors.title}>
                <Form.Input
                    name="title"
                    value={title}
                    placeholder={hidePlaceholders ? '' : placeholders.title}
                    onChange={(_e, { value }) => onTitleChange({ title: value })}
                />
            </Form.Field>,
            this.createUrlOrFileFormField('icon', false)
        ];

        return (
            <>
                {loading && <LoadingOverlay />}
                {formFields}
            </>
        );
    }
}

export default UploadPluginForm;
