export default function PluginIcon({ src }) {
    const { Image, Icon } = Stage.Basic;
    return src ? <Image src={src} width="25" /> : <Icon name="plug" size="large" />;
}

PluginIcon.propTypes = {
    src: PropTypes.string
};

PluginIcon.defaultProps = {
    src: null
};

Stage.defineCommon({
    name: 'PluginIcon',
    common: PluginIcon
});
