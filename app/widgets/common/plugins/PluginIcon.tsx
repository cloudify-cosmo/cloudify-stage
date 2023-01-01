import React from 'react';
import PropTypes from 'prop-types';

interface PluginIconProps {
    src?: string;
}

export default function PluginIcon({ src }: PluginIconProps) {
    const { Image, Icon } = Stage.Basic;
    return src ? <Image src={src} width="25" /> : <Icon name="plug" size="large" />;
}

PluginIcon.propTypes = {
    src: PropTypes.string
};

PluginIcon.defaultProps = {
    src: null
};
