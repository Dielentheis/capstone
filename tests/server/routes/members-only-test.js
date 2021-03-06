// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

describe('Members Route', function () {

    var app, User;

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        User = db.model('user');
    });

    describe('Unauthenticated request', function () {

        var guestAgent;

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('should get a 401 response', function (done) {
            guestAgent.get('/api/users/secret-stash')
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(401);
                    done();
            });
        });

    });

    describe('Authenticated request', function () {

        var loggedInAgent;

        var userInfo = {email: 'obama1@gmail.com', password: 'potus1', zip: '55112', firstName: 'Baracky', lastName: 'Obamama'};

        beforeEach('Create a user', function () {
            return User.create(userInfo);
        });

        beforeEach('Create loggedIn user agent and authenticate', function (done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo).end(done);
        });

        it('should get with 200 response and with an array as the body', function (done) {
            loggedInAgent.get('/api/users/secret-stash')
                .expect(200).end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body).to.be.an('array');
                    done();
            });
        });

    });

});
