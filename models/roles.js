// models/tipoUser.js
var express = require('express');

var roles = {
            'alumno' : {'id': 'alumno'      ,'levelAccess' : 1, 'name' : 'Alumno'},
            'docente' : {'id': 'docente'    ,'levelAccess' : 3, 'name' : 'Docente'},
            'moderador' : {'id': 'moderador','levelAccess' : 4, 'name' : 'Moderador'},
            'owner' : {'id': 'owner'        ,'levelAccess' : 5, 'name' : 'Owner'}
            };

module.exports = {
	getTipo: function(strRole){
		if(strRole in roles === false)	{
			throw "No existe el rol asignado";
		}else{
		  //  roles[strRole];
		    return roles[strRole];
		}
	}
};