var express = require('express');
var app = express();

// SHOW LIST OF events
app.get('/', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM events ORDER BY id DESC', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('event/list', {
					title: 'event List',
					data: ''
				})
			} else {
				// render to views/event/list.ejs template file
				res.render('event/list', {
					title: 'event List',
					data: rows
				})
			}
		})
	})
})

// SHOW ADD event FORM
app.get('/add', function (req, res, next) {
	// render to views/event/add.ejs
	res.render('event/add', {
		title: 'Add New event',
		event_name: '',
		event_type: '',
		gender: '',
		event_cat: ''
	})
})

// ADD NEW event POST ACTION
app.post('/add', function (req, res, next) {
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
			conn.query('INSERT INTO events SET ?', event, function (err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/event/add.ejs
					res.render('event/add', {
						title: 'Add New event',
						event_name: event.event_name,
						event_type: event.event_type,
						event_cat: event.event_cat,
						gender: event.gender
					})
				} else {
					req.flash('success', 'Data added successfully!')

					// render to views/event/add.ejs
					res.render('event/add', {
						title: 'Add New event',
						event_name: '',
						event_type: '',
						gender: '',
						event_cat: ''
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
		res.render('event/add', {
			title: 'Add New event',
			event_name: req.body.event_name,
			event_type: req.body.event_type,
			event_cat: req.body.event_cat,
			gender: req.body.gender
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