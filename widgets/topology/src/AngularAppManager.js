/**
 * Created by kinneretzin on 07/11/2016.
 */

export default class AngularAppManager{

    constructor () {
        this.appName = null;
        this.app = null;
        this.container = null;
    }

    start (container,appName) {
        if (this.app) {
            this.destroy();
        }

        if (container) {
            this.appName = appName;
            this.container = container;
            this.app = angular.bootstrap(this.container,[this.appName]);
            this.$rootScope = this.app.get('$rootScope');
        }
    }

    destroy() {
        //var $rootScope = this.app.get('$rootScope');
        this.$rootScope.$destroy();

        this.app = null;
        this.appName = null;
        this.container = null;
    }

    fireEvent(eventName,data) {
        if (this.app && this.$rootScope) {
            this.$rootScope.$broadcast(eventName,data);
        }
    }
}