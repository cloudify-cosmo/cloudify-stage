import type { FunctionComponent, ReactElement } from 'react';

type NoDataMessageProps =
    | {
          children: ReactElement;
          error?: never;
          repositoryName?: never;
      }
    | { children?: never; error?: { name: string }; repositoryName: string };

const NoDataMessage: FunctionComponent<NoDataMessageProps> = ({ children, error, repositoryName }) => {
    const { Message } = Stage.Basic;
    const { MessageContainer } = Stage.Basic;
    return (
        <MessageContainer wide margin="30px auto">
            <Message>
                {children ||
                    (((error as Record<string, any>) || {}).name === 'SyntaxError'
                        ? `The widget content cannot be displayed because configured URL does not point to a valid ${repositoryName} repository JSON data. Please check widget's configuration.`
                        : `The widget content cannot be displayed because there is no connection to ${repositoryName} repository. Please check network connection and widget's configuration.`)}
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
