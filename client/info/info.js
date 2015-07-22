/**
 * Created by seal on 7/2/15.
 */

angular
    .module('mean')
    .controller('InfoController', InfoController);

InfoController.$inject = ['$scope', '$rootScope'];

/* @ngInject */
function InfoController($scope, $rootScope) {
    /* jshint validthis: true */
    window.$rootScope = $rootScope;
    var info = this;
    info.items = [];
    info.filterItem = 'name';
    info.filterName = '';
    $scope.filterObj = {};
    // 实例方法
    info.add = add;
    info.init = init;
    info.remove = remove;
    info.edit = edit;
    info.save = save;
    info.cancel = cancel;

    $scope.$watch('info.filterName', function(oldValue, newValue) {
        $scope.filterObj = {};
        $scope.filterObj[info.filterItem] = info.filterName;
    });

    init();

    function add() {
        info.items.push({
            name: info.name,
            number: info.number,
            age: info.age,
            score: info.score
        });
        init();
    }

    function init() {
        info.name = '';
        info.number = '';
        info.age = 21;
        info.score = 0;
    }

    function remove(item) {
        var items = [];
        info.items.forEach(function(i) {
            if (i != item) {
                items.push(i);
            }
        });
        info.items = items;
    }

    function edit(item) {
        var index = 0;
        for (var i = 0; i < item.length; i++) {
            if (info.items[i] == item)
                index = i;
        }
        info.name = item.name;
        info.number = item.number;
        info.age = item.age;
        info.score = item.score;
        info.index = index;
        $('#myModal').modal();
    }

    function save() {
        var item = info.items[info.index];
        item.name = info.name;
        item.number = info.number;
        item.age = info.age;
        item.score = info.score;
        init();
        $('#myModal').modal('hide');
    }

    function cancel() {
        init();
        $('#myModal').modal('hide');
    }
}
