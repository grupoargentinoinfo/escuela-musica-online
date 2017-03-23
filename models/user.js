var mysql = require('mysql');

module.exports = function User(){
	var self = this;

	this.id = String;
	this.username = String;
	this.password = String;
	this.email = String;
	this.firstName = String;
	this.lastName = String;
	this.rol = String;
	this.peer_id = String;
	
	this.findById = function(id, connection){
		connection.query('SELECT id, username, password, email, firstName, lastName, rol, peer_id FROM Usuarios WHERE id = "'+id+'" LIMIT 1',
			function(err, rows, fields) {
			  if (!err)
			    console.log('The solution is: ', rows);
			  else
			    console.log('Error while performing Query.');
			});

	};
	
	this.findOne = function(params, connection, response){
		var query = 'SELECT id, username, password, email, firstName, lastName, rol, peer_id FROM Usuarios WHERE ';
		params.forEach(function(currentValue, index){
			query += index + ' = ' + currentValue + ' ';
		});
		query += ' LIMIT 1';
		connection.query(query, response);
	};

	this.findByPeerId = function(peer_id, connection) {
		self.findOne({'peer_id': peer_id});
	}
};