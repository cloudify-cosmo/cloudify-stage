import type { FunctionComponent, ReactElement } from 'react';

type NoDataMessageProps =
    | {
          children: ReactElement;
          error?: never;
          repositoryName?: never;
      }
    | { children?: never; error?: { name: string }; repositoryName: string };

const translate = (suffix: string, params?: Record<string, any>) =>
    Stage.i18n.t(`widgets.common.noDataMessage.${suffix}`, params);

const NoDataMessage: FunctionComponent<NoDataMessageProps> = ({ children, error, repositoryName }) => {
    const { Message, MessageContainer } = Stage.Basic;

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

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { NoDataMessage };
    }
}

Stage.defineCommon({
    name: 'NoDataMessage',
    common: NoDataMessage
});
