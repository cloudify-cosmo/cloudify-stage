function NoDataMessage({ repositoryName, error, children }) {
    const { Message } = Stage.Basic;
    const { MessageContainer } = Stage.Basic;
    return (
        <MessageContainer wide margin="30px auto">
            <Message>
                {children ||
                    (error.name === 'SyntaxError'
                        ? `The widget content cannot be displayed because configured URL does not point to a valid ${repositoryName} repository JSON data. Please check widget's configuration.`
                        : `The widget content cannot be displayed because there is no connection to ${repositoryName} repository. Please check network connection and widget's configuration.`)}
            </Message>
        </MessageContainer>
    );
}

NoDataMessage.propTypes = {
    repositoryName: PropTypes.string,
    children: PropTypes.node,
    error: PropTypes.shape({ name: PropTypes.string })
};

NoDataMessage.defaultProps = {
    repositoryName: null,
    children: null,
    error: {}
};

Stage.defineCommon({
    name: 'NoDataMessage',
    common: NoDataMessage
});
