angular.module('studentServ', [])

    .factory("DBService", function ($q, $ionicPopup, $state) {
        
		var Sdb, tblStudent = null;

        function setupDB() {	
			var deferred = $q.defer();
			var schemaBuilder = lf.schema.create('studentsDB', 1);
			
			schemaBuilder.createTable('Student').
				addColumn('student_id', lf.Type.INTEGER).
				addColumn('student_name', lf.Type.STRING).
				addColumn('student_class', lf.Type.STRING).
				addColumn('student_sex', lf.Type.STRING).
				addColumn('student_phone', lf.Type.STRING).
				addColumn('student_address', lf.Type.STRING).
				addNullable(['student_phone', 'student_address']).
				addPrimaryKey(['student_id'], true);
				
			schemaBuilder.connect().then(function(db) {
				Sdb = db;
				tblStudent = Sdb.getSchema().table('Student');
				deferred.resolve(); 
			});
			
			return deferred.promise; 
        }

        function getStudent(){
			var deferred = $q.defer();
			
            var qry1 = Sdb.
                select().
                from(tblStudent).
                orderBy(tblStudent.student_name);
                qry1.exec().then(function(rows) {
                    if(rows.length == 0){
                        $ionicPopup.alert({
                            title: "Warning",
                            template: "No record to display. Please add student details."
                        }).then(function(res) {
                            $state.go('appmenu.add-student');
                        });
                    }else{
                        deferred.resolve(rows);
                    }

                });
			
			
			return deferred.promise;
		}

        function getStudentById(studentId){
            var deferred = $q.defer();
			
            var qry1 = Sdb.
                select().
                from(tblStudent).
                where(tblStudent.student_id.eq(studentId));
                qry1.exec().then(function(rows) {
                    deferred.resolve(rows);
                });
			
            return deferred.promise;
        }

        function saveStudent(student){
            
			var s = angular.copy(student);
			var deferred = $q.defer();
			
            var row = tblStudent.createRow({
                'student_name': s.name,
                'student_class': s.class,
                'student_sex': s.sex,
                'student_phone': s.phone,
                'student_address': s.address
            });

            var qry1 = Sdb.
                insertOrReplace().
                into(tblStudent).
                values([row]);

            qry1.exec().then(function() {
                deferred.resolve();
                $ionicPopup.alert({
                    title: 'Success',
                    template: 'Student record saved.'
                }).then(function(res) {
                    $state.go('appmenu.list-student');
                });
            });

            return deferred.promise;
        }

        function delStudent(studentId){
			var deferred = $q.defer();
			
            var qry1 = Sdb.
                delete().
                from(tblStudent).
                where(tblStudent.student_id.eq(studentId));
                qry1.exec().then(function(rows) {
                    deferred.resolve(rows);
                });

            return deferred.promise;
        }

        function updateStudent(student, studentId){
         
			var s = angular.copy(student);
            var deferred = $q.defer();
			
            var qry1 = Sdb.
                update(tblStudent).
                set(tblStudent.student_name, s.name).
                set(tblStudent.student_class, s.class).
                set(tblStudent.student_sex, s.sex).
                set(tblStudent.student_phone, s.phone).
                set(tblStudent.student_address, s.address).
                where(tblStudent.student_id.eq(studentId));

                qry1.exec().then(function() {
                    deferred.resolve();
                    $ionicPopup.alert({
                        title: 'Success',
                        template: 'Student record updated.'
                    }).then(function(res) {
                        $state.go('appmenu.list-student');
                    });
                });
			
            return deferred.promise;
        }

        return {            
            setupDB: function(){
                return setupDB();
            },
            getStudent: function(){
                return getStudent();
            },
            getStudentById: function(studentId){
                return getStudentById(studentId);
            },
            saveStudent: function(student){
                return saveStudent(student);
            },
            delStudent: function(studentId){
                return delStudent(studentId);
            },
            updateStudent: function(student, studentId){
                return updateStudent(student, studentId);
            }
        }

    });
