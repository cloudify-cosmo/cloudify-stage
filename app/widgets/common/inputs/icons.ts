const iconClassName = (icon: string) => `icon-button dds__icon dds__icon--${icon}`;
export const icons = {
    metadata: iconClassName('metadata'),
    helpCir: iconClassName('help-cir'),
    arrowTriSolidStacked: iconClassName('arrow-tri-solid-stacked'),
    sortAz: iconClassName('sort-az'),
    sortZa: iconClassName('sort-za')
};