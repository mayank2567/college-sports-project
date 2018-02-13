var express = require('express');
var app = express();
var fs = require('fs');

var events;
// SHOW LIST OF events
app.get('/', function (req, res, next) {
	req.getConnection(function (error, conn) {

		conn.query('SELECT * FROM events ORDER BY id DESC', function (err, rows, fields) {
			//if(err) throw err

			if (err) {
				req.flash('error', err)
				res.render('attendence/list', {
					title: 'attendence List',
					data: '',
					success: 'none',
					students: ''
				})
			} else {
				// render to views/attendence/list.ejs template file
				events = rows;
				res.render('attendence/list', {
					title: 'attendence List',
					data: rows,
					success: 'none',
					students: ''
				})
			}
		});
	});
});

var event_name;
app.post('/', function (req, res, next) {
	event_name = req.body.event_name;
	req.getConnection(function (error, conn) {
		console.log("event_name", req.body.event_name)
		conn.query('SELECT * FROM event_student where event_id = ' + parseInt(req.body.event_id), function (err, rows, fields) {
			let sql = 'SELECT * FROM students WHERE';
			events;

			if (rows && rows.length == 0) {
				res.render('attendence/list', {
					title: 'No Item Found',
					data: events,
					success: 'none',
					attendance: '',
					event_name: '',
					students: ''
				});
				return;
			}
			for (let i = 0; i < rows.length; i++) {
				sql = sql + ' rollno = ' + parseInt(rows[i].rollno);
				if (i < rows.length - 1)
					sql += ' or ';
			}

			conn.query(sql, function (err, student, fields) {

				for (let i = 0; i < student.length; i++) {
					for (let j = 0; j < rows.length; j++) {
						if (student[i].rollno == rows[j].rollno) {
							// fs.readFile(`./photos/${student[i].rollno}.jpg`, function (err, data) {
							// 	var bitmap = new Buffer(data).toString('base64');
							// 	bitmap = 'data:image/jpeg;base64,' + bitmap;
							// 	student[i].photo = bitmap;
							student[i].attendence = rows[j].attendence;
							// if (i == student.length - 1) {

							// }
							// });
						}
					}

				}
				if (err) {
					req.flash('error', err)
					res.render('attendence/list', {
						title: 'Select Event',
						data: events,
						success: 'none',
						attendance: '',
						event_name: '',
						students: ''
					})
				} else {
					events;


					// render to views/student/list.ejs template file
					res.render('attendence/list', {
						title: 'Select Event',
						data: events,
						success: 'block',
						attendance: rows,
						event_name: event_name,
						bool: '',
						students: student
					});

				}

			});


		});
	});
});
app.get('/attend', function (req, res, next) {
	res.redirect('/attendence/add')
});

app.post('/attend', function (req, res, next) {
	event_name = req.body.event_name;
	console.log("event_name ", event_name);
	req.getConnection(function (error, conn) {

		conn.query('SELECT * FROM event_student where event_id = ' + parseInt(req.body.event_id), function (err, rows, fields) {
			let sql = 'SELECT * FROM students WHERE';
			if (rows.length == 0) {
				res.render('attendance/list', {
					title: 'No Item Found',
					data: events,
					success: 'none',
					attendance: '',
					event_name: event_name,
					students: ''
				});
				return;
			}
			for (let i = 0; i < rows.length; i++) {
				sql = sql + ' rollno = ' + parseInt(rows[i].rollno);
				if (i < rows.length - 1)
					sql += ' or ';
			}

			conn.query(sql, function (err, student, fields) {
				for (let i = 0; i < student.length; i++) {
					for (let j = 0; j < rows.length; j++) {
						if (student[i].rollno == rows[j].rollno) {

							student[i].attendence = rows[j].attendence;
						}
					}
				}
				if (err) {
					req.flash('error', err)
					res.render('attendence/add', {
						title: 'Select Event',
						data: '',
						success: 'node',
						attendance: '',
						event_name: event_name,
						students: ''
					})
				} else {
					// render to views/student/list.ejs template file

					res.render('attendence/add', {
						title: 'Select Event',
						data: events,
						success: 'block',
						attendance: rows,
						event_name: event_name,
						event_id: req.body.event_id,
						students: student
					});
				}
			});


		});
	});
});



// SHOW ADD event FORM
app.get('/add', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM events ORDER BY id DESC', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('attendence/add', {
					title: 'Select Event',
					data: ''
				})
			} else {
				events = rows;
				// render to views/student/list.ejs template file
				res.render('attendence/add', {
					title: 'Select Event',
					data: rows,
					success: 'none',
					result: '',
					students: '',
					attendance: ''
				});
			}
		});
	});
})

// ADD NEW event POST ACTION
app.post('/add', function (req, res, next) {
	var errors = req.validationErrors()

	if (!errors) { //No errors were found.  Passed Validation!

		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a event    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a event'
		********************************************/
		if (!Array.isArray(req.body.rollno)) {
			let temp = req.body.rollno;
			req.body.rollno = [];
			req.body.rollno.push(temp);
		}

		if (!Array.isArray(req.body.event_id)) {
			let temp = req.body.event_id;
			req.body.event_id = [];
			req.body.event_id.push(temp);
		}
		
		let attendence = [];
		for (let i = 0; i < req.body.rollno.length; i++) {
			attendence.push(req.body[`attendence_${req.body.rollno[i]}`]);
		};
		
		req.getConnection(function (error, conn) {
			for (let i = 0; i < req.body.rollno.length; i++) {

				conn.query('UPDATE event_student SET attendence = ? WHERE rollno = ? and event_id = ?', [attendence[i], parseInt(req.body.rollno[i]), req.body.event_id[0]], function (err, result) {
					if (err) {
						req.flash('error', err)
						
						// render to views/event/add.ejs
						res.redirect('add');
						// return;
					}


				});

			}

			req.flash('success', 'Updated Attendence');
			res.redirect('add');
		})
	}
});

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
					res.render('attendence/edit', {
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
		res.render('attendence/edit', {
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