/**
 * Created by jakub.niezgoda on 21/09/2018.
 */

const groupStates = [
    {
        name: 'uninitialized',
        icon: 'cancel',
        colorSUI: 'blue',
        colorHTML: '#2185d0',
        states: ['uninitialized']
    },
    {
        name: 'in progress',
        icon: 'spinner',
        colorSUI: 'yellow',
        colorHTML: '#fbbd08',
        states: [
            'initializing',
            'creating',
            'created',
            'configuring',
            'configured',
            'starting',
            'stopping',
            'stopped',
            'deleting'
        ]
    },
    {
        name: 'started',
        icon: 'checkmark',
        colorSUI: 'green',
        colorHTML: '#21ba45',
        states: ['started']
    },
    {
        name: 'deleted',
        icon: 'trash',
        colorSUI: 'black',
        colorHTML: '#1b1c1d',
        states: ['deleted']
    }
];

Stage.defineCommon({
    name: 'NodeInstancesConsts',
    common: { groupStates }
});
