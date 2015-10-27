/**
 * Created by bindhyeswarimishra on 10/27/15.
 */
var app = angular.module('myApp', ['ui.router']).controller('MyController', function ($scope) {
    $scope.message = 'Hello';
});

// configure the router

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'app/profile/_profile.html',
        controller: 'ProfileController'
    }).state('landing', {
        url: '/landing',
        templateUrl: 'app/landing/_landing.html',
        controller: 'LandingController'
    });

    $urlRouterProvider.otherwise('/landing');
});

app.controller('ProfileController', function ($scope, User) {

    User.getFriends().then(function (data) {
        console.log(data);

        $scope.friends = data;
        console.log('$scope.friends', $scope.friends);
    });

    $scope.saveFriend = function () {
        console.log($scope.friend, User.profile);
        User.saveFriend($scope.friend).then(function (data) {
            console.log(data);
            $scope.friends = data.friends;
        });
    }
});




app.controller('LandingController', function ($scope, User, Geolocation, Position) {
    $scope.user = null;

    User.validate().then(function (data) {
        console.log('Printing from the controller ... ');
        console.log(data);
        console.log('User.profile', User.profile);
        $scope.user = User.profile;
    });

    $scope.getLocation = function () {
        Geolocation.getPosition().then(function (data) {
            console.log(data);
            $scope.coords = data.coords;
        }, function (data) {
            console.log(data);
        });
    };

    $scope.sendPosition = function () {
        Position.send();
    };


});

app.factory('User', function ($q, $http) {

    var _user = null;

    return {
        get profile() {
            return _user;
        },
        // User service object
        validate: function () {
            return $q(function (resolve, reject) {
                $http.get('/validate').then(function (config) {
                    console.log('printing from the service ... ');
                    console.log(config.data);
                    resolve(config.data);
                    _user = config.data;
                }, function (config) {
                    console.log(config);
                    // person is not authenticated, so redirect to /auth/google
                    window.location = 'http://localhost:3000/auth/google';
                });
            });
        },
        saveFriend: function (friend) {
            // friend is an object with a name and an email
            return $q(function (resolve, reject) {
                $http.put('/users/' + _user.id + '/friends', friend).then(function (config) {
                    resolve(config.data);
                }, function (config) {
                    reject(config);
                });
            });
        },
        getFriends: function () {
            return $q(function (resolve, reject) {
                $http.get('/users/' + _user.id + '/friends').then(function (config) {
                    resolve(config.data);
                }, function (config) {
                    reject(config);
                });
            });
        }
    };
});

app.factory('Geolocation', function ($q) {
    return {
        getPosition: function () {
            return $q(function (resolve, reject) {
                // async oeprations here ...

                navigator.geolocation.getCurrentPosition(function (position) {
                    resolve(position);
                }, function () {
                    reject(arguments);
                })

            });
        }
    };
});

app.factory('Position', function (Geolocation, $http, User) {
    return {
        send: function () {
            console.log('starting the position service ... ');
            console.time('info');
            // sending position information to the backend
            Geolocation.getPosition().then(function(loc) {
                var obj = {
                    gid: User.profile.id,
                    coords: {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude
                    }
                };
                console.log('have access to the position ... ', obj);
                $http.post('/position', obj).then(function (config) {
                    // success from the server
                    console.timeEnd('info');
                    console.log(config.data);
                }, function (config) {
                    // error from the server
                    console.log('Failed to contact server ...', config);

                });
            });
        }
    };
});