/**
 * Created by jakub.niezgoda on 21/09/2018.
 */

const groupNames = {
    uninitialized: 'uninitialized',
    inProgress: 'in progress',
    started: 'started',
    deleted: 'deleted'
};

const groupStates = [
    {
        name: groupNames.uninitialized,
        icon: 'cancel',
        colorSUI: 'blue',
        colorHTML: '#2185d0',
        states: ['uninitialized']
    },
    {
        name: groupNames.inProgress,
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
        name: groupNames.started,
        icon: 'checkmark',
        colorSUI: 'green',
        colorHTML: '#21ba45',
        states: ['started']
    },
    {
        name: groupNames.deleted,
        icon: 'trash',
        colorSUI: 'black',
        colorHTML: '#1b1c1d',
        states: ['deleted']
    }
];

Stage.defineCommon({
    name: 'NodeInstancesConsts',
    common: { groupNames, groupStates }
});
