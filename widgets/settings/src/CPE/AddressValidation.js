/**
 * Created by jakub on 2/3/17.
 */

/*  Validation
 */

function _validateIP(value) {
    let _ipv4Regex = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
    return _ipv4Regex.test(value);
}

function _validateMAC(value) {
    let _macRegex = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/;
    return _macRegex.test(value);
}


export default function debounceErrorCheck (field, that ) {
    let errors = that.state.errors;
    if( field['data-validate'] !== undefined ) {

        let className = field['data-validate'] === 'ipv4' ?
            (_validateIP(field.value) ? "" : "error") :
            (_validateMAC(field.value) ? "" : "error");

        errors[field.name] = {
            class: field.value === '' ? '' : className,
            type: field['data-validate'],
            name: field['data-text']
        };
    }

    let errorsTexts = Object.keys(errors).map( key => {
            if( errors[key].class === '' )
                return undefined;

            let message = "Field " + errors[key].name;
            message += errors[key].type === 'ipv4' ? ipv4ErrorMessage : '';
            message += errors[key].type === 'mac' ? macErrorMessage : '';

            return message;
        }
    ).filter(x => (typeof x === 'string'));

    return {
        errors,
        errorsTexts
    };
}

const ipv4ErrorMessage = ' has to be IPv4 format.';
const macErrorMessage = ' has to be MAC format.';
