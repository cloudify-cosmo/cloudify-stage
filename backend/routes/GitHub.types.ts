// eslint-disable-next-line node/no-unpublished-import
import type { Endpoints } from '@octokit/types';

export type GetGitHubSearchRepositoriesResponse = Endpoints['GET /search/repositories'];

export type GetGitHubReposTreesResponse = Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}'];
