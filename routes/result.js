var express = require('express');
var app = express();

// SHOW LIST OF events
var events;
app.get('/', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM events ORDER BY id DESC', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('result/list', {
					title: 'Select Event',
					data: '',
					students: ''
				})
			} else {
				events = rows;
				// render to views/student/list.ejs template file
				res.render('result/list', {
					title: 'Select Event',
					data: rows,
					success: 'none',
					result: '',
					students: ''
				});
			}
		});
	});
});

app.post('/', function (req, res, next) {
	var students = [];
	req.getConnection(function (error, conn) {

		
		conn.query('SELECT id FROM events where id = ?', req.body.event, function (err, rows, fields) {
			console.log("req ", req.body.event);
			
			conn.query('SELECT * FROM result where event_id = ' + parseInt(rows[0].id), function (err, result, fields) {
				
				if (result[0]) {
					conn.query('SELECT rollno FROM event_student where event_id = ' + parseInt(result[0].event_id), function (err, student_rollno, fields) {
						let sql = 'SELECT * FROM students WHERE';
						for (let i = 0; i < student_rollno.length; i++) {
							sql = sql + ' rollno = ' + parseInt(student_rollno[i].rollno);
							if (i < student_rollno.length - 1)
								sql += ' or ';
						}
						conn.query(sql, function (err, student, fields) {

							// if (i == student_rollno.length - 1) {
							console.log("student ", student);
							if (err) {
								req.flash('error', err)
								res.render('result/list', {
									title: 'result List',
									result: '',
									data: '',
									success: 'none',
									students: ''

								})
							} else {
								events;

								// render to views/event/list.ejs template file

								res.render('result/list', {
									title: 'result List',
									result: result,
									success: 'block',
									event_name: req.body.event,
									data: events,
									students: student
								})


							}
							// }
						});


					});
				} else {
					events;
					req.flash('error', "No results Entered")
					res.render('result/list', {
						title: 'result List',
						result: '',
						data: events,
						success: 'none',
						students: ''

					})
				}

			});
			//if(err) throw err

		});
	});
});
app.post('/view', function (req, res, next) {
	var students = [];
	req.getConnection(function (error, conn) {
		
		conn.query('SELECT id FROM events where id = ?', req.body.event, function (err, rows, fields) {
			
			conn.query('SELECT rollno FROM event_student where event_id = ' + parseInt(rows[0].id), function (err, student_rollno, fields) {
				let sql = 'SELECT * FROM students WHERE';
				for (let i = 0; i < student_rollno.length; i++) {
					sql = sql + ' rollno = ' + parseInt(student_rollno[i].rollno);
					if (i < student_rollno.length - 1)
						sql += ' or ';
				}
				conn.query(sql, function (err, student, fields) {

					// if (i == student_rollno.length - 1) {
					console.log("student ", student);
					if (err) {
						req.flash('error', err)
						res.render('result/list', {
							title: 'result List',
							result: '',
							data: '',
							success: 'none',
							students: '',
							event_id: ''

						})
					} else {
						events;
						req;
						// render to views/event/list.ejs template file
						res.render('result/add', {
							title: 'result Add',
							result: '',
							success: 'block',
							event_name: req.body.event,
							event_id: req.body.event,
							data: events,
							students: student
						})

					}
					// }
				});


			});



			//if(err) throw err

		});
	});
});
// SHOW ADD event FORM
app.get('/add', function (req, res, next) {
	// render to views/event/add.ejs
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM events ORDER BY id DESC', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('result/add', {
					title: 'Select Event',
					data: '',
					students: '',
					event_id: ''
				})
			} else {
				events = rows;
				// render to views/student/list.ejs template file
				res.render('result/add', {
					title: 'Select Event',
					data: rows,
					success: 'none',
					result: '',
					students: '',
					event_id: ''
				});
			}
		});
	});
});
// conn.query('SELECT * FROM event_student ORDER BY id DESC', function (err, event, fields) {
// ADD NEW event POST ACTION
app.post('/add', function (req, res, next) {


	// req.assert('first', 'Name is required').notEmpty() //Validate name
	// req.assert('second', 'year is required').notEmpty() //Validate year
	// req.assert('third', 'A valid course is required').notEmpty() //Validate course
	var errors = req.validationErrors()

	if (!errors) {
		var result = {};
		//No errors were found.  Passed Validation!
		result.first = req.body.rollno[req.body.position.indexOf("First")];
		result.second = req.body.rollno[req.body.position.indexOf("Second")];
		result.third = req.body.rollno[req.body.position.indexOf("Third")];
		result.event_id = req.body.eve123;
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a event    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a event'
		********************************************/

		req.getConnection(function (error, conn) {
			conn.query('INSERT INTO result SET ?', result, function (err, result) {
				//if(err) throw err
				if (err) {
					
					req.flash('error', err)

					// render to views/event/add.ejs
					res.render('result/add', {
						data: '',
						success: 'none',
						result: '',
						students: '',
						event_id: ''
					})
				} else {
					req.flash('success', 'Data added successfully!')
					// render to views/event/add.ejs
					
					res.redirect('/result')
				}
			})
		})
	} else { //Display errors to event
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */
		res.render('result/add', {
			title: 'Add New event',
			data: ''
			// event_name: req.body.event_name,
			// event_type: req.body.event_type,
			// event_cat: req.body.event_cat,
			// gender: req.body.gender
		})
	}
})

// SHOW EDIT event FORM
app.get('/edit/(:id)', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM events WHERE id = ' + req.params.id, function (err, rows, fields) {
			if (err) throw err

			// if event not found
			if (rows.length <= 0) {
				req.flash('error', 'event not found with id = ' + req.params.id)
				res.redirect('/events')
			} else { // if event found

				// render to views/event/edit.ejs template file
				res.render('event/edit', {
					title: 'Edit event',
					//data: rows[0],
					id: rows[0].id,
					event_name: rows[0].event_name,
					event_type: rows[0].event_type,
					event_cat: rows[0].event_cat,
					gender: rows[0].gender
				})
			}
		})
	})
})

// EDIT event POST ACTION
app.put('/edit/(:id)', function (req, res, next) {
	req.assert('event_name', 'Name is required').notEmpty() //Validate name
	req.assert('event_cat', 'year is required').notEmpty() //Validate year
	req.assert('event_type', 'A valid course is required').notEmpty() //Validate course
	req.assert('gender', 'gender is required').notEmpty()
	var errors = req.validationErrors()

	if (!errors) { //No errors were found.  Passed Validation!

		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a event    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a event'
		********************************************/
		var event = {
			event_name: req.sanitize('event_name').escape().trim(),
			event_type: req.sanitize('event_type').escape().trim(),
			event_cat: req.sanitize('event_cat').escape().trim(),
			gender: req.sanitize('gender').escape().trim()
		}

		req.getConnection(function (error, conn) {
			conn.query('UPDATE events SET ? WHERE id = ' + req.params.id, event, function (err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/event/add.ejs
					res.render('event/edit', {
						title: 'Edit event',
						id: req.params.id,
						event_name: req.body.event_name,
						event_type: req.body.event_type,
						event_cat: req.body.event_cat,
						gender: req.body.gender
					})
				} else {
					req.flash('success', 'Data updated successfully!')

					// render to views/event/add.ejs
					res.render('event/edit', {
						title: 'Edit event',
						id: req.params.id,
						event_name: req.body.event_name,
						event_type: req.body.event_type,
						event_cat: req.body.event_cat,
						gender: req.body.gender
					})
				}
			})
		})
	} else { //Display errors to event
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */
		res.render('event/edit', {
			title: 'Edit event',
			id: req.params.id,
			event_name: req.body.event_name,
			event_type: req.body.event_type,
			event_cat: req.body.event_cat,
			gender: req.body.gender
		})
	}
})

// DELETE event
app.delete('/delete/(:id)', function (req, res, next) {
	var event = {
		id: req.params.id
	}

	req.getConnection(function (error, conn) {
		conn.query('DELETE FROM events WHERE id = ' + req.params.id, event, function (err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to events list page
				res.redirect('/events')
			} else {
				req.flash('success', 'event deleted successfully! id = ' + req.params.id)
				// redirect to events list page
				res.redirect('/events')
			}
		})
	})
})

module.exports = app