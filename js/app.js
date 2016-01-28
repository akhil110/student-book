angular.module('StudentBook', ['ionic', 'studentServ'])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('appmenu', {
                url: "/appURL",
                abstract: true,
                templateUrl: "menu.html"
            })
			
	    .state('appmenu.list-student', {
                url: "/list-student",
                views: {
                    'menuContent' :{
                        templateUrl: "list-student.html",
                        controller: "ListStudentCtrl"
                    }
                }
            })

            .state('appmenu.student-detail/:studentId', {
                url: "/student-detail/:studentId",
                views: {
                    'menuContent' :{
                        templateUrl: "student-detail.html",
                        controller: 'StudentDetailCtrl'
                    }
                }
            })

           
            .state('appmenu.add-student', {
                url: "/add-student",
                views: {
                    'menuContent' :{
                        templateUrl: "add-student.html",
                        controller: "AddStudentCtrl"
                    }
                }
            })
            .state('appmenu.edit-student/:studentId', {
                url: "/edit-student/:studentId",
                views: {
                    'menuContent' :{
                        templateUrl: "add-student.html",
                        controller: "AddStudentCtrl"
                    }
                }
            })
            .state('appmenu.list-class', {
                url: "/list-class",
                views: {
                    'menuContent' :{
                        templateUrl: "list-class.html",
			controller: "ListClassCtrl"
                    }
                }
            })

        $urlRouterProvider.otherwise("/appURL/list-student");
    }])

    .controller('ListStudentCtrl', ['$scope', '$state', '$ionicPopup', '$ionicActionSheet', 'DBService', function($scope, $state, $ionicPopup, $ionicActionSheet, DBService) {
		
	$scope.loadStudent = function() {
		DBService.getStudent().then(function (results) {
			$scope.students = results;
            	});
        }
        
        DBService.setupDB().then(function () {
            $scope.loadStudent();
        });

        $scope.delStudent = function(studentId){
            $ionicActionSheet.show({
                titleText: 'Confirm Delete',
                destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {
                    //console.log('CANCELLED');
                },
                destructiveButtonClicked: function() {
                    DBService.delStudent(studentId).then(function () {
                        $ionicPopup.alert({
                            title: "Success",
                            template: "Student deleted."
                        }).then(function(res) {
                            $scope.loadStudent();
                        });
                    });
                    return true;
                }
            });
        }

        $scope.editStudent = function(student_Id){
            $state.go('appmenu.edit-student/:studentId',{studentId:student_Id});
        }
    }])

    .controller('StudentDetailCtrl', ['$scope', '$state', '$stateParams', 'DBService', function($scope, $state, $stateParams, DBService) {
		
	DBService.getStudentById($stateParams.studentId).then(function (result) {
		$scope.student = result;
	});
        
    }])

    .controller('AddStudentCtrl', ['$scope', '$ionicPopup', '$stateParams', 'DBService', function($scope, $ionicPopup, $stateParams, DBService) {
        

        if($stateParams.studentId === undefined){
            $scope.action = 'Add';
            $scope.btnaction = 'Submit';
        }else{
            $scope.action = 'Edit';
            $scope.btnaction = 'Update';
	$scope.student = {};
			
            DBService.getStudentById($stateParams.studentId).then(function (results) {
		$scope.student.name = results[0].student_name;
                $scope.student.class = results[0].student_class;
                $scope.student.sex = results[0].student_sex;
		$scope.student.phone = results[0].student_phone;
		$scope.student.address = results[0].student_address;
            });
        }

        $scope.saveStudent = function(student){
	    if(student === undefined || student.name === null || student.name === ""){
                $ionicPopup.alert({
                    title: 'Error - Input Required',
                    template: 'Please enter student name.'
                });
            }else if (student.class === undefined || student.class === null || student.class === ""){
                $ionicPopup.alert({
                    title: 'Error - Input Required',
                    template: 'Please select class.'
                });
			}else if (student.sex === undefined || student.sex === null || student.sex === ""){
                $ionicPopup.alert({
                    title: 'Error - Input Required',
                    template: 'Please select sex.'
                });
            }else{
                if($stateParams.studentId === undefined) {
                    DBService.saveStudent(student);
                }else{
                    DBService.updateStudent(student, $stateParams.studentId);
                }

                $scope.student = null;
            }
        }
    }])
	
	.controller('ListClassCtrl', ['$scope', '$state', '$stateParams', 'DBService', function($scope, $state, $stateParams, DBService) {
		
		DBService.getStudent().then(function (results) {
			$scope.students = results;
			
			var indexedClass = [];

			// this will reset the list of indexed teams each time the list is rendered again
			$scope.studentsToFilter = function() {
				indexedClass = [];
				return $scope.students;
			}
			
			$scope.filterClass = function(student) {
				var classIsNew = indexedClass.indexOf(student.student_class) == -1;
				if (classIsNew) {
					indexedClass.push(student.student_class);
				}
				
				return classIsNew;
			}
            
            console.log($scope.students);
		});
        
    }]);
	
	
