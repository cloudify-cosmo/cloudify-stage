/**
 * Created by pawelposel on 04/04/2017.
 */

import log from 'loglevel';
let logger = log.getLogger("MessageResolver");

const resolvers = {
    "User" : { pattern: /<User username=`(\w+)`>/, text: (params)=>`user ${params[1]}` }
};

export default class MessageResolver {

    static resolve(message) {
        var checkPattern = /<(\w+)/g;

        var match;
        while (match = checkPattern.exec(message)) {
            var resolver = resolvers[match[1]];

            if (resolver)  {
                var params = resolver.pattern.exec(message);
                var text = resolver.text(params);

                message = message.replace(resolver.pattern, text);
            } else {
                logger.error("There is no error message resolver defined for " + match[0]);
            }
        }

        return message;
    }
}