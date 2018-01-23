var express = require('express');
var app = express();

// SHOW LIST OF students
app.get('/', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM events ORDER BY id DESC', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('selectEvent', {
					title: 'Select Event',
					data: ''
				})
			} else {
				// render to views/student/list.ejs template file
				res.render('selectEvent', {
					title: 'Select Event',
					data: rows,
					url: req.query.url
				});
			}
		});
	});
});

app.post('/', function (req, res, next) {
	res.redirect(`${req.body.url}?event=${req.body.event}`);
});


module.exports = app