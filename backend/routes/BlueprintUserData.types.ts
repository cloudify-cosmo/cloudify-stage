import type { BlueprintUserData } from '../db/models/BlueprintUserDataModel.types';

export type BlueprintLayout = BlueprintUserData['layout'];

export type GetBlueprintUserDataLayoutResponse = BlueprintLayout;

export type PutBlueprintUserDataLayoutRequestBody = BlueprintLayout;
