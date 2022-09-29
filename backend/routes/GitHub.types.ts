/* eslint-disable import/no-extraneous-dependencies,node/no-unpublished-import */
import type { Endpoints } from '@octokit/types';

export type { Endpoints } from '@octokit/types';

export type GetGitHubSearchRepositoriesResponse = Endpoints['GET /search/repositories']['response']['data'] & {
    isAuth: boolean;
};

export type GetGitHubReposTreesResponse =
    Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']['data'];
