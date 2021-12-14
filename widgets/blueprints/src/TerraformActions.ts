import type { RequestBody } from '../../../backend/routes/Terraform.types';

export default class TerraformActions {
    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {}

    doGenerateBlueprint(body: RequestBody) {
        return this.toolbox.getInternal().doPost('/terraform/blueprint', { body });
    }
}
