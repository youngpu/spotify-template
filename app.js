$(document).ready(function(){
  //starts with filter bars and popup hidden
  $('#filterBar').hide(); 
  $('#popup, .overlay').hide(); 
  // hide popup if the popup is clicked
  $('#popup, .overlay').click(function() {
    $('#popup, .overlay').hide();
  });
});

var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=artist:'
var myApp = angular.module('myApp', []);
var currentArtist;
var trackName;

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}

  // get songs by artist search
  $scope.getSongs = function() {
    if ($scope.artist != currentArtist && $scope.track == undefined && $scope.album == undefined) {
      currentArtist = $scope.artist;
      $('#filterBar').show();
      $http.get(baseUrl + $scope.artist).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.artist == currentArtist && $scope.track == undefined && $scope.album == undefined) {
        $http.get('https://api.spotify.com/v1/search?type=track&query=artist:' + $scope.artist).success(function(response){ 
          data = $scope.tracks = response.tracks.items;  
        });
    }
    // if user searchs a track or an album or both
    if ($scope.track != undefined &&$scope.album == undefined) {
      $http.get(baseUrl + $scope.artist + "%20track:" + $scope.track).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track == undefined && $scope.album != undefined) {
      $http.get(baseUrl + $scope.artist + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track != undefined && $scope.album != undefined) {
      $http.get(baseUrl + $scope.artist + "%20track:" + $scope.track + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } 
  }

  // Unhides, the popup, and then appends information to it - including Instagram pictures
  $scope.popup = function(track) {
    $('#popup, .overlay').show();
    $scope.trackName = track.name;
    // clear the popup, then append information
    $('#popup').html("");
    $('#popup').append("<img class='popupAlbum' src=" + track.album.images[0].url + " alt=" + track.name + ">");
    $('#popup').append('<h4>"' + track.name + '" by ' + track.artists[0].name + "</h4>")
    $('#popup').append("<h4>" + "from the album <i>" + track.album.name + "</i></h4>")
  }

  // play the preview_url
  $scope.play = function(song) {
    if($scope.currentSong == song) { 
      $scope.audioObject.pause(); 
      $scope.currentSong = false; 
      return;
    } else { 
      if($scope.audioObject.pause != undefined) { 
        $scope.audioObject.pause() 
      }
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play();   
      $scope.currentSong = song; 
    } 
  }

  // Pauses the music when the pause button is clicked if the music is playing
  $scope.pause = function() {
    if(!$scope.audioObject.paused) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
  }
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]',
});


