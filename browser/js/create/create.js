app.config(function ($stateProvider) {
    $stateProvider.state('create', {
        url: '/create',
        templateUrl: 'js/create/create.html',
        controller: 'CreateCtrl',
    });
});

app.controller('CreateCtrl', function ($scope, $log, CreatePlotFactory, PlantsFactory) {
    PlantsFactory.fetchAll()
    .then(function (plants) {
        $scope.plants = plants;
    })
    .catch($log.error);

    var autoObj = function() {
        var dataObj = {};
        $scope.plants.forEach(function (plantObj) {
            dataObj[plantObj.name] = null;
        })
        return dataObj;
    }

    $scope.autocomplete = {data: autoObj()};

    // put back to false after creating add plant view
    $scope.switch = true;
    $scope.plot = {};
    $scope.feet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.inches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    $scope.createPlot = function (hf, hi, wf, wi) {
        CreatePlotFactory.createPlot(hf, hi, wf, wi);
        $scope.switch = true;
    }

});

app.factory('CreatePlotFactory', function () {
    var returnObj = {};

    returnObj.Cell = function () {
        this.sun = 0;
        this.taken = false;
    };

    returnObj.createPlot = function (hf, hi, wf, wi){
        let height = (+hf * 12) + (+hi);
        let width = (+wf * 12) + (+wi);
        let plot = [];
        for (var i = 0; i < height; i++) {
            let row = [];
            for (var j = 0; j < width; j++) {
                let cell = new returnObj.Cell();
                row.push(cell)
            }
            plot.push(row);
        }
        returnObj.plot = plot;
    }


    // returnObj.renderPlot = function (plotData) {
    //     //send plot data to backend
    //     //plot data will be 2 params
    //     //1 array of objects {sun: 0/1/2, taken:false} (returnObj.plot);
    //     //2 array of plants, either full plant obj or plant id
    // }

    return returnObj;
});
