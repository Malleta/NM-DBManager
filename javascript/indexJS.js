let app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.picked = false;
    $scope.tableName = '';
    $scope.columnInput = [];
    $scope.dataUpdate = [];
    $scope.columnName = [];
    $scope.data = [];
    $scope.regexSearch = [{}];


    $http.get('database/showAllTables.php').then(function (data) {
        $scope.Tables_in = Object.keys(data.data[0]).toString();
        $scope.allTables = data.data;
    });
    $scope.getTable = function (tableName) {
        $scope.filterChecked = [];
        $scope._columnName = [];
        $('.ui.inverted.dimmer').addClass('active');
        $scope.tableName = tableName;
        $http.post('database/columnNames.php', tableName).then(function (data) {
            $scope.columnName = [];
            data.data.forEach(function (ele) {
                $scope.columnName.push(ele.COLUMN_NAME);
            });
            $scope._columnName = $scope.columnName;
            $http.post('database/empDetails.php', tableName).then(function (data) {
                $scope.data = data.data;
                $('.ui.active.inverted.dimmer').removeClass('active');
                $scope.picked = true;
            });
        });

    };

    $scope.currentPage = 0;
    $scope.pageSize = 100;
    $scope.searchBox = '';

    $scope.loader = function (item) {
        $scope.currentPage = $scope.currentPage + item;
    };

    $scope.numberOfPages = function () {
        return Math.ceil($scope.data.length / $scope.pageSize);
    };


    $scope.showModalInsert = function () {
        $('.ui.fullscreen.modal.insert')
            .modal('show')
            .modal({
                onApprove: function () {
                    return false
                }
            })
    };
    $scope.rowInsert = function () {
        //todo moze da se ispise tip inputa int, string, itd..
        $http.post('database/insertDetails.php', {
            'data': JSON.stringify(Object.assign({}, $scope.columnInput)),
            'tableName': $scope.tableName
        })
            .then(function (data) {
                $scope.getTable($scope.tableName);
                if (data.data == 1) {
                    $scope.dataStatus = 'dodati.';
                    $('.ui.mini.modal.success')
                        .modal('show')
                        .modal({
                            onApprove: function () {
                                $('.ui.fullscreen.modal.insert')
                                    .modal('hide');
                            }
                        });
                } else {
                    $scope.errorMsg = data.data;
                }
            });
    };

    $scope.showModalUpdate = function (row) {
        $('.ui.fullscreen.modal.update')
            .modal('show')
            .modal({
                onApprove: function () {
                    return false
                }
            });
        $scope.currentData = row;
        $scope._currentData = JSON.parse(JSON.stringify(row));

    };
    $scope.rowUpdate = function () {
        $http.post('database/updateDetails.php', {
            'currentData': JSON.stringify($scope._currentData),
            'data': JSON.stringify(Object.assign({}, $scope.dataUpdate)),
            'tableName': $scope.tableName
        })
            .then(function (data) {
                $scope.getTable($scope.tableName);
                if (data.data == 1) {
                    $scope.dataStatus = 'promenjeni.';
                    $('.ui.mini.modal.success')
                        .modal('show')
                        .modal({
                            onApprove: function () {
                                $('.ui.fullscreen.modal.update')
                                    .modal('hide');
                            }
                        });
                } else {
                    $scope.errorMsg = data.data;
                }
            });
    };

    $scope.showModalDelete = function (row) {
        $('.ui.tiny.modal.delete')
            .modal('show')
            .modal({
                onApprove: function () {
                    return false
                }
            });
        $scope.row = JSON.parse(JSON.stringify(row));
    };
    $scope.rowDelete = function () {
        $http.post('database/deleteDetails.php', {
            'data': JSON.stringify($scope.row),
            'tableName': $scope.tableName
        })
            .then(function (data) {
                $scope.getTable($scope.tableName);
                if (data.data == 1) {
                    $scope.dataStatus = 'obrisani.';
                    $('.ui.mini.modal.success')
                        .modal('show')
                        .modal({
                            onApprove: function () {
                                $('.ui.tiny.modal.delete')
                                    .modal('hide');
                            }
                        });
                } else {
                    $scope.errorMsg = data.data;
                }
            });
    };

    $scope.showModalColumnFilter = function () {
        $('.ui.modal._filter')
            .modal('show')
            .modal({
                onApprove: function () {
                    return false
                }
            })
    };
    $scope.columnFilter = function () {
        $scope.filterColumn = [];
        let i = 0;
        for (let k in $scope.filterChecked) {
            if ($scope.filterChecked.hasOwnProperty(k) && $scope.filterChecked[k] === true) {
                $scope.filterColumn[i] = k;
                i++;
            }
        }
        $http.post('database/filterTable.php', {
            'data': JSON.stringify(Object.assign({}, $scope.filterColumn)),
            'tableName': $scope.tableName
        })
            .then(function (data) {
                $scope.columnName = $scope.filterColumn;
                $scope.data = data.data;
                $scope.dataStatus = 'filtrirani.';
                $('.ui.mini.modal.success')
                    .modal('show')
                    .modal({
                        onApprove: function () {
                            $('.ui.modal._filter')
                                .modal('hide');
                        }
                    });
            });
    };

    $scope.showModalSearch = function () {
        $('.ui.modal._search')
            .modal('show')
            .modal({
                onApprove: function () {
                    return false
                }
            });
        $scope.dropDown();
    };

    $scope.dropDown = function () {
        setTimeout(function () {
            $('.target').addClass('dropdown');
            $('.ui.dropdown').dropdown();
        }, 200)
    };

    $scope.regNumUp = function () {
        $scope.regexSearch.push({});
    };
    // $scope.bigSearch = function (val, data) {
    //     return function () {
    //         console.log(val, data);
    //     }
    // };
    $scope.columnSearch = function () {
        // $scope.bigSearch($scope.regexSearch);
console.log($scope.regexSearch);
        // for(let i = 0; i<$scope.regexSearch.length;i++){
        //     if($scope.regexSearch[i].columnName)
        //         $scope.finalRegex += $scope.regexSearch[i].columnName;
        //     if($scope.regexSearch[i].Regex)
        //         $scope.finalRegex += $scope.regexSearch[i].Regex;
        //     if($scope.regexSearch[i].logicOperator)
        //         $scope.finalRegex += $scope.regexSearch[i].logicOperator;
        // }
        //todo kontrola unosa!
    };
}]);

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.filter('regex', function () {
    return function (field, regexSearch) {
        // console.warn(regexSearch);
        // _regex = new RegExp(regex);
        // _out = [];
        // for (let i = 0; i < field.length; i++) {
        //     if (_regex.test((JSON.stringify(field[i]))))
        //         _out.push(field[i]);
        // }
        // return _out;
        // let out = [];
        // for (let i = 0; i < field.length; i++) {
        //     if (field[i].req)
        //         out.push(field[i]);
        // }
        return field;
    }
});

app.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        $('.target').addClass('dropdown');
        $('.ui.dropdown').dropdown();
    }
});