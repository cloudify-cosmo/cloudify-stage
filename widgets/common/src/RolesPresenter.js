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


    render(){
        let directRoleLabel = <i>direct role</i>;

        let restOfGroupRoles = '';
        _.forEach(_.omit(this.props.groupRoles, this.props.directRole), (groups, role) => {
            restOfGroupRoles += role+' ('+groups.join(', ')+'), ';
        });
        restOfGroupRoles = restOfGroupRoles.slice(0, -2);

        return (
            _.isEmpty(this.props.groupRoles)
                ?
                //Use case 1: user (direct role)
                this.props.directRole && <span>{this.props.directRole} ({directRoleLabel})</span>
                :
                _.has(this.props.groupRoles, this.props.directRole)
                    ?
                    _.isEmpty(restOfGroupRoles)
                        ?
                        //Use case 2: user (direct role, gp1)
                        <span>{this.props.directRole} ({directRoleLabel}, {this.props.groupRoles[this.props.directRole].join(', ')})</span>
                        :
                        //Use case 3: user (direct role, gp1), viewer (gp2)
                        <span>{this.props.directRole} ({directRoleLabel}, {this.props.groupRoles[this.props.directRole].join(', ')}), {restOfGroupRoles}</span>
                    :
                    this.props.directRole
                        ?
                        //Use case 4: user (direct role), viewer (gp2)
                        <span>{this.props.directRole} ({directRoleLabel}), {restOfGroupRoles}</span>
                        :
                        //Use case 5: viewer (gp2)
                        <span>{restOfGroupRoles}</span>
            )

    }
}


Stage.defineCommon({
    name: 'RolesPresenter',
    common: RolesPresenter
});