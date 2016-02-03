angular.module('thrifterApp.controllers', ['ngCordova'])

       .controller('CardsCtrl', function ($scope, Listings, $cordovaGeolocation) {

        /*

        function distance(listingLatitude, listingLongitude, latUserRoot, longUserRoot) {
            var radlat1 = Math.PI * listingLatitude / 180;
            var radlat2 = Math.PI * latUserRoot / 180;
            var radlon1 = Math.PI * listingLongitude / 180;
            var radlon2 = Math.PI * longUserRoot / 180;
            var theta = listingLongitude - longUserRoot;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;

            //Get in in kilometers
            $scope.dist = dist * 1.609344;

            return dist;
        }

       distance();

       */

        $scope.quantity = 1;
        $scope.cards = [];

        $scope.addCard = function (name, price, details, image, listingLatitude, listingLongitude) {

            var newCard = {
                listingTitle: name,
                listingPrice: price,
                listingDetails: details,
                listingImage: image,
                listingLatitude: listingLatitude,
                listingLongitude: listingLongitude
            };

            var locationOptions = {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            };

            $cordovaGeolocation.getCurrentPosition(locationOptions)
                .then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    $scope.userLatitude = lat;
                    $scope.userLongitude = long;
                    console.log('userLatitude', userLatitude);
                    console.log('userLongitude', userLongitude);
                    calculateDistance();
                }, function (error) {
                    console.log('error:', error);
                });

          /*  function calculateDistance () {

                var radlat1 = Math.PI * $scope.listingLatitude / 180;
                var radlat2 = Math.PI * $scope.userLatitude / 180;
                var radlon1 = Math.PI * $scope.listingLongitude / 180;
                var radlon2 = Math.PI * $scope.userLongitude / 180;
                var theta = $scope.listingLongitude - $scope.userLongitude;
                var radtheta = Math.PI * theta / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;

                //Get in in kilometers
                $scope.dist = dist * 1.609344;

                return dist;
            }
*/

            newCard.id = Math.random();
            $scope.cards.unshift(angular.extend({}, newCard));
        };

        $scope.addCards = function () {
            Listings.getAll().then(function (value) {
                angular.forEach(value.data.results, function (v) {
                    $scope.addCard(v.listingTitle, v.listingPrice, v.listingDetails, v.listingImage, v.listingLatitude, v.listingLongitude);
                });
            });
        };

        $scope.addCards(1);

        $scope.cardSwipedLeft = function (index) {
            console.log('Left swipe');
        };

        $scope.cardSwipedRight = function (index) {
            console.log('Right swipe');
        };

        $scope.cardDestroyed = function (index) {
            $scope.cards.splice(index, 1);
            //     $scope.addCards(1);
        };

    })

    .controller('imageSubmissionCtrl', function($scope, $http, $cordovaCamera, $state, Listings, PARSE_CREDENTIALS, $cordovaGeolocation) {

        var imageData;
        $scope.listing = {};

        // Object to save to Parse that includes an image
        var object = {
            text: "",
            image: null
        };

        // Function to take a picture using the device camera
        $scope.takePicture = function () {

            // Define various properties for getting an image using the camera
            var cameraOptions = {
                quality: 75,
                // This ensures the actual base64 data is returned, and not the file URI
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                allowEdit: true,
                targetWidth: 300,
                targetHeight: 300
            };

            // Use the Cordova Camera APIs to get a picture. For brevity, camera
            // is simply an injected service
            $cordovaCamera.getPicture(cameraOptions).then(function (returnedImageData) {
                imageData = returnedImageData;
                confirm("Photo added!");
            }, function (err) {
                alert("Error taking picture: " + err);
            });
        };

        $scope.getLocation = function () {
            var locationOptions = {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            };

            $cordovaGeolocation.getCurrentPosition(locationOptions)
            .then(function(position){
                var latListing  = position.coords.latitude;
                var longListing = position.coords.longitude;
                    $scope.latListing = latListing;
                    $scope.longListing = longListing;
                console.log('latListing', latListing);
                console.log('longListing', longListing);
            }, function(error){
                console.log('error:', error);
            });

        };

        $scope.createImage = function () {
            var dataToSubmit = {__ContentType: "image/jpeg", base64: imageData};
            return $http.post("https://api.parse.com/1/files/image.jpg", dataToSubmit, {
                headers: {
                    "X-Parse-Application-Id": PARSE_CREDENTIALS.APP_ID,
                    "X-Parse-REST-API-Key": PARSE_CREDENTIALS.REST_API_KEY,
                    "Content-Type": "plain/text"
                }
            })
                .success(function (result) {
                    // Now associate the image file with the object
                    coupleImageFileWithObject(result.name);
                })
                .error(function (result) {
                    alert("Error uploading image file: " + err);
                });
        };

        function coupleImageFileWithObject(fileName) {
            // Assign the filename to our object prior to saving it to Parse
            object.listingImage = {name: fileName, __type: "File"};
            var latListing = $scope.latListing;
            var longListing = $scope.longListing;
                Listings.createListing({
                    listingTitle: $scope.listing.listingTitle,
                    listingPrice: $scope.listing.listingPrice,
                    listingDetails: $scope.listing.listingDetails,
                    listingImage: object.listingImage,
                    listingLatitude: latListing,
                    listingLongitude: longListing
                }).success(function (data) {
                    confirm("Your listing has been submitted!");
                    $state.go('app.browse');
                });
        }
    })


.value('PARSE_CREDENTIALS',{
    APP_ID: 'PCm0kDVeThvRcdFuS9lITrmskEhqjbqwFAydL2Lr',
    REST_API_KEY:'FhasGkTl0BLpJuLLJvPB2NFwlccXzVbirktdngXN'

});
