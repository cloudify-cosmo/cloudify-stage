const { Message, Icon } = Stage.Basic;

const AuthenticationWarning = () => {
    return (
        <Message>
            <Icon name="ban" />
            <span>
                No GitHub credentials provided! Widget may stop working after reaching unrestricted query limit (~50).
                Fix this by adding &amp;github-username&amp; and &amp;github-password&amp; entries to your secrets store
                (Secrets widget).
            </span>
        </Message>
    );
};

export default AuthenticationWarning;
