const { Button } = Stage.Basic;

const t = Stage.Utils.getT('widgets.secretProviders.table');

const SecretProvidersTableHeader = () => {
    return <Button labelPosition="left" icon="add" content={t('buttons.create')} />;
};

export default SecretProvidersTableHeader;
