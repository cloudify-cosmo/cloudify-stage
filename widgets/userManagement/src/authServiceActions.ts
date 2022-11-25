import type { Toolbox } from '../../../app/utils/StageAPI';

export interface GetAuthUserResponse {
    email: string;
    // eslint-disable-next-line camelcase
    selected_manager_address: string;
    status: string;
}

export interface PostAuthUsersInviteRequestBody {
    email: string;
}

export default class AuthServiceActions {
    external: ReturnType<Toolbox['getExternal']>;

    constructor(toolbox: Toolbox) {
        this.external = toolbox.getExternal(undefined);
    }

    isAuthServiceAvailable() {
        const isReponseFromAuthService = (response: GetAuthUserResponse | string) => typeof response === 'object';

        return this.external
            .doGet<GetAuthUserResponse | string>('/auth/users/me')
            .then(isReponseFromAuthService)
            .catch(() => false);
    }

    doInvite(email: string) {
        return this.external.doPost<never, PostAuthUsersInviteRequestBody>('/auth/users/invite', {
            body: { email }
        });
    }
}
