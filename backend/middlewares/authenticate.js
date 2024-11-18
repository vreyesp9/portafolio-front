'use strict'

const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require("../config/general");
const moment = require('moment');

exports.ensureAuth = async function(req, res, next) {
    if (!req.headers.authorization) {

        return res.status(403).send({
            message: "La petición no tiene cabecera de authorization"
        })

    } else {

        var token = req.headers.authorization.replace(/['"]+/g, '').replace("Bearer ", "");

        try {

            var payload = jwt.decode(token, jwtSecretKey);

            if (moment().unix() > payload.die) {
                return res.status(403).send({
                    success: false,
                    msg: "Error: Este token ya expiró"
                });
            }

            req.user = payload;

            next();


        } catch (ex) {


            return res.status(200).send({
                msg: "El token no es válido",
                success: false
            });

        }

    }

};