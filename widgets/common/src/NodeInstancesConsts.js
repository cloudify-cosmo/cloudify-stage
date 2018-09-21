/**
 * Created by jakub.niezgoda on 21/09/2018.
 */

const groupStates = [
    {
        name: 'uninitialized',
        icon: 'ban',
        color: 'grey',
        states: ['uninitialized']
    },
    {
        name: 'in progress',
        icon: 'spinner',
        color: 'orange',
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
        color: 'green',
        states: ['started']
    },
    {
        name: 'deleted',
        icon: 'trash',
        color: 'black',
        states: ['deleted']
    },
];


Stage.defineCommon({
    name: 'NodeInstancesConsts',
    common: {groupStates}
});