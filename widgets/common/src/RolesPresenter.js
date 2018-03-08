/**
 * Created by edenp on 22/10/2017.
 */
import _ from 'lodash';

let PropTypes = React.PropTypes;

export default class RolesPresenter extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        groupRoles: PropTypes.object.isRequired,
        directRole: PropTypes.string
    };


    render() {
        let {Popup} = Stage.Basic;
        const HELP_MESSAGE = 'When the roles are inherited from a user group, ' +
            'the name of the user group is also shown, ' +
            'for example: viewer (Viewers)';

        let restOfGroupRoles = '';
        _.forEach(_.omit(this.props.groupRoles, this.props.directRole), (groups, role) => {
            restOfGroupRoles += role + ' (' + groups.join(', ') + '), ';
        });
        restOfGroupRoles = restOfGroupRoles.slice(0, -2);

        let RolesList = function(directRole, groupRoles) {
            return (
                _.isEmpty(groupRoles)
                ?
                //Use case 1: user
                directRole && <span>{directRole}</span>
                :
                _.has(groupRoles, directRole)
                    ?
                    _.isEmpty(restOfGroupRoles)
                        ?
                        //Use case 2: user (gp1)
                        <span>{directRole} ({groupRoles[directRole].join(', ')})</span>
                        :
                        //Use case 3: user (gp1), viewer (gp2)
                        <span>{directRole} ({groupRoles[directRole].join(', ')}), {restOfGroupRoles}</span>
                    :
                    directRole
                        ?
                        //Use case 4: user, viewer (gp2)
                        <span>{directRole}, {restOfGroupRoles}</span>
                        :
                        //Use case 5: viewer (gp2)
                        <span>{restOfGroupRoles}</span>
            );
        };

        return (
            _.isEmpty(this.props.groupRoles)
                ?
                RolesList(this.props.directRole, this.props.groupRoles)
                :
                <Popup trigger={RolesList(this.props.directRole, this.props.groupRoles)} content={HELP_MESSAGE} />
        );
    }
}


Stage.defineCommon({
    name: 'RolesPresenter',
    common: RolesPresenter
});