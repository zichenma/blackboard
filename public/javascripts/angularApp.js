"use strict";


var app = angular.module('angularApp', ['ngRoute','ngResource']).run(function ($rootScope, $http) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';

    $rootScope.logout = function () {
        $http.get('/auth/signout');

        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };
});

app.config(function($routeProvider,$locationProvider){
    $locationProvider.html5Mode(true);
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
        .otherwise({
            redirectTo:'/'
        })

});
app.factory('courseService', function ($resource) {
    return $resource('/api/courses/:id');
});
app.factory('userService',function ($resource) {
    return $resource('/api/users/:id');
});
app.controller('userController', function($rootScope,$scope,userService){
    $scope.users = userService.query();
});

app.factory('postService', function ($resource) {
    return $resource('/api/posts/:id');
});
app.controller('mainController', function($rootScope,$scope,postService){
    $scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};


	$scope.post = function(){
	    $scope.newPost.created_by = $rootScope.current_user;
        $scope.newPost.created_at = Date.now();
        postService.save($scope.newPost,function() {
            $scope.posts = postService.query();
            $scope.newPost = {created_by: '', text: '', created_at: ''};
        });
	};
});

app.controller('authController', function($scope,$http, $rootScope,$location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

    $scope.login = function () {
        $http.post('/auth/login', $scope.user).success(function (data) {
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.username;
            $location.path('/');
        });
    };

    $scope.register = function () {
        $http.post('/auth/signup', $scope.user).success(function (data) {
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.username;
            $location.path('/');
        });
    };

});

app.controller('courseController', function ($scope,$http,$rootScope,courseService) {
    $scope.courses = courseService.query();
    $scope.newCourse = {courseID: '', courseName: '', isEditing: false, created_at:''};
    $scope.course = function () {
        $scope.course.created_at = Date.now();
        courseService.save($scope.newCourse,function () {
            $scope.courses = courseService.query();
            $scope.newCourse= {courseID: '', courseName: '', isEditing: false, created_at:''};
        });
    };
    $scope.updateCourse= function (course) {
       $http.put('/api/courses/' + course._id,{courseID: course.updatedCourseId,
       courseName:course.updatedCourseName}).success(function(response){
           $scope.courses = courseService.query();
           course.isEditing = false;
       });
    };
    
   $scope.onEditClick = course =>{
        course.isEditing = true;
        course.updatedCourseId = course.courseID;
        course.updatedCourseName = course.courseName;
   };
   $scope.onCancelClick = course=>{
       course.isEditing = false;
   };

   $scope.deleteCourse = course =>{
       //$scope.courses.splice($scope.courses.indexOf(course),1);
       $http.delete('/api/courses/' + course._id).success(response =>{
           $scope.courses = courseService.query();
       });
   };

});