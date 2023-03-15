import type { Label } from 'app/widgets/common/labels/types';
import type { PostEnvironmentBlueprintRequestBody } from 'backend/routes/blueprints/Environment.types';

export interface DefaultableLabel extends Label {
    blueprintDefault: boolean;
}

export type Capability = PostEnvironmentBlueprintRequestBody['capabilities'][number];
