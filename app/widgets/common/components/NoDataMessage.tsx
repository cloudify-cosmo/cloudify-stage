import type { FunctionComponent, ReactElement } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Message, MessageContainer } from '../../../components/basic';

type NoDataMessageProps =
    | {
          children: ReactElement;
          error?: never;
          repositoryName?: never;
      }
    | { children?: never; error?: { name: string }; repositoryName: string };

const translate = (suffix: string, params?: Record<string, any>) =>
    i18n.t(`widgets.common.noDataMessage.${suffix}`, params);

const NoDataMessage: FunctionComponent<NoDataMessageProps> = ({ children, error, repositoryName }) => {
    return (
        <MessageContainer wide margin="30px auto">
            <Message>
                {children ||
                    translate(error?.name === 'SyntaxError' ? 'invalidUrl' : 'noConnection', { repositoryName })}
            </Message>
        </MessageContainer>
    );
};

NoDataMessage.propTypes = {
    repositoryName: PropTypes.string as any,
    children: PropTypes.node as any,
    error: PropTypes.shape({ name: PropTypes.string }) as any
};

export default NoDataMessage;
