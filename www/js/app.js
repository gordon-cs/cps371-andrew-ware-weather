// Simple Weather app
// Created by Andrew Ware January 2016
// Project for Gordon College's Mobile Development course
// Weather data fetched from forecast.io
// Zip code to lat/long coord conversion by Google Maps API
angular.module('simpleWeather', ['ionic'])
    .run(function($ionicPlatform) {

        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })

    })
    .controller('weatherController', function($scope, $http, $q) {

        $scope.geoLoc = {};
        $scope.getLocation = function() {
            return $q(function(resolve, reject) {
                navigator.geolocation.getCurrentPosition(function(Position) {
                    resolve({
                        latitutde: Position.coords.latitude,
                        longitude: Position.coords.longitude
                    });
                }, function(err) {
                    reject(err);
                });
            });
        };

        $scope.days = ['Su', 'M', 'T', 'W', 'T', 'F', 'Sa'];
        $scope.getWeek = function() {
            var week = [];
            var today = $scope.days[(new Date()).getDay()];
            for (var i = 1; i < 8; i++) {
                week.push($scope.days[((new Date()).getDay() + i) % 7]);
            }
            return week;
        };

        $scope.weather = {
            temperature: {}
        };
        $scope.forecast = [];
        $scope.sevenDay = {};
        $scope.zip = '';
        $scope.icons = {
            clear: 'img/clear.svg',
            clearNight: 'img/clear-night.svg',
            cloudy: 'img/cloudy.svg',
            foggy: 'img/foggy.svg',
            partlyCloudy: 'img/partly-cloudy.svg',
            rainy: 'img/rainy.svg',
            snowy: 'img/snowy.svg',
            sunny: 'img/sunny.svg',
            thunderstorm: 'img/thunderstorm.svg'
        };

        $scope.getLatLngAndWeather = function(zipCode) {
            if (!zipCode || zipCode.length < 5) return;
            $scope.zip = zipCode;
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + zipCode)
                .then(function(data) {
                    setActiveDay(0);
                    var lat = data.data.results[0].geometry.location.lat;
                    var lng = data.data.results[0].geometry.location.lng;
                    var address = data.data.results[0].formatted_address.replace(/,/g, "").split(" ");
                    var city = address[0];
                    var state = address[1];
                    if (state.length > 0 && state.length < 3) $scope.weather.city = city + ', ' + state;
                    else $scope.weather.city = city;
                    $scope.getWeather(lat, lng);
                }).catch(function(err) {
                    console.log(err);
                });
        };

        $scope.getZip = function(lat, lng) {
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true')
                .then(function(data) {
                    $scope.zip = data.data.results[2].address_components[0].long_name; //long_name
                    var city = data.data.results[1].address_components[0].long_name; //city
                    var state = data.data.results[1].address_components[2].short_name; //state
                    if (state.length > 0 && state.length < 3) $scope.weather.city = city + ', ' + state;
                    else $scope.weather.city = city;
                }).catch(function(err) {
                    console.log(err);
                });
        }

        $scope.getWeather = function(lat, lng) {
            $http.get('http://andrew-ware-weather.appspot.com/?lat=' + lat + '&lon=' + lng)
                .then(function(data) {
                    $scope.weather.currently = data.data.currently.currently;
                    $scope.weather.summary = data.data.daily[0].summary
                    $scope.weather.icon = $scope.getIcon($scope.weather.summary.toLowerCase());
                    $scope.weather.temperature.mean = Math.floor(data.data.currently.temperature);
                    $scope.weather.temperature.low = Math.floor(data.data.daily[0].maxTemp);
                    $scope.weather.temperature.high = Math.floor(data.data.daily[0].minTemp);
                    $scope.weather.windSpeed = Math.floor(data.data.currently.windSpeed);
                    $scope.weather.humidity = Math.floor(data.data.currently.humidity * 100);
                    $scope.forecast = data.data.daily;
                    $scope.setDay(1);
                }).catch(function(err) {
                    console.log(err);
                });
        }

        $scope.getIcon = function(icon, noNight) {
            var info = {
                img: '',
                desc: ''
            };
            if (icon.includes('')) {
                info.img = $scope.icons.clear;
                info.desc = 'Clear';
            }
            if (icon.includes('night') && !noNight) {
                info.img = $scope.icons.clearNight;
                info.desc = 'Clear Night';
            }
            if (icon.includes('sunny')) {
                info.img = $scope.icons.sunny;
                info.desc = 'Sunny';
            }
            if (icon.includes('cloudy') || icon.includes('overcast')) {
                info.img = $scope.icons.cloudy;
                info.desc = 'Cloudy';
            }
            if (icon.includes('fog')) {
                info.img = $scope.icons.foggy;
                info.desc = 'Foggy';
            }
            if (icon.includes('rain') || icon.includes('drizzle') || icon.includes('precip')) {
                info.img = $scope.icons.rainy;
                info.desc = 'Rainy';
            }
            if (icon.includes('snow') || $scope.weather.summary.includes('flur')) {
                info.img = $scope.icons.snowy;
                info.desc = 'Snowy';
            }
            if (icon.includes('thunder')) {
                info.img = $scope.icons.thunderstorm;
                info.desc = 'Thunderstorm';
            }
            return info;
        };

        $scope.setDay = function(day) {
            $scope.sevenDay.summary = $scope.forecast[day].summary;
            $scope.sevenDay.icon = $scope.getIcon($scope.forecast[day].summary.toLowerCase(), true);
            $scope.sevenDay.temperature = (Math.floor($scope.forecast[day].maxTemp) + Math.floor($scope.forecast[day].minTemp)) / 2;
        };

        var removeLoadingGif = function() {
            $('.loading').hide();
            setTimeout(function() {
                $('.wrapper').show();
            }, 400);
        }

        $scope.refresh = function() {
            $('.wrapper').hide();
            setTimeout(function() {
                $('.loading').show();
            }, 50);
            setTimeout(function() {
                removeLoadingGif();
            }, 2000);
        }

        var colors = ['#8ADCDC', '#8AB3DC', '#8A8ADC', '#B38ADC', '#DC8ADC', '#DC8AB3', '#DC8A8A', '#DCB38A', '#DCDC8A', '#B3DC8A', '#8ADCB3'];
        var startColorChanger = function(time) {
            for (var i = 0; i < colors.length; i++) {
                $('html').animate({
                    backgroundColor: colors[i]
                }, time);
                $('.zip-button').animate({
                    color: colors[i]
                }, time);
                $('.refresh').animate({
                    color: colors[i]
                }, time);
            }
            setTimeout(startColorChanger(time), time * colors.length);
        }

        $scope.init = function(notFirstTime) {
            $scope.zip = '01984'
            $scope.getLocation()
                .then(function(position) {
                    var latitude = position.latitutde;
                    var longitude = position.longitude;
                    $scope.getZip(latitude, longitude);
                    $scope.getWeather(latitude, longitude);
                    if (!notFirstTime) {
                        removeLoadingGif();
                        startColorChanger(3000);
                    }
                }, function(reason) {
                    console.log(reason);
                    $scope.getLatLngAndWeather($scope.zip); // gets lat and lng using Google Maps API then calls getWeather
                    if (!notFirstTime) {
                        removeLoadingGif();
                        startColorChanger(3000);
                    }
                });
        };

    });