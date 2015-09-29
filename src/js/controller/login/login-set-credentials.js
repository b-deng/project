'use strict';

//var pgp = require('../../crypto/pgp');
//var updateHandler = require('../../util/update/update-handler');
//var keychain = require('../../service/keychain');
//var publickeyVerifier = require('../../service/publickey-verifier');
//var appConfig = require('../../app-config');

var ENCRYPTION_METHOD_NONE = 0;
var ENCRYPTION_METHOD_STARTTLS = 1;
var ENCRYPTION_METHOD_TLS = 2;

var SetCredentialsCtrl = function($scope, $location, $routeParams, $q, auth, connectionDoctor, appConfig, updateHandler, publickeyVerifier, pgp, keychain) {
    !$routeParams.dev && !auth.isInitialized() && $location.path('/'); // init app

    //
    // Presets and Settings
    //
    var mailConfig = {
        imap:{
            hostname:'imap.qiye.163.com',
            port:993,
            secure:true,
            source:'guess',
            type:'imap'
        },
        smtp:{
            hostname:'smtp.qiye.163.com',
            port:25,
            secure:true,
            source:'guess',
            type:'smtp'
        }
         /*imap:{
            hostname:'imap.sina.cn',
            port:993,
            secure:true,
            source:'guess',
            type:'imap'
        },
        smtp:{
            hostname:'smtp.sina.cn',
            port:587,
            secure:true,
            source:'guess',
            type:'smtp'
        }*/
    };
    //var mailConfig = $scope.state.login.mailConfig;
    //$scope.useOAuth = !!auth.oauthToken;
    //$scope.showDetails = (mailConfig.imap.source === 'guess');

    // set email address
    //if ($scope.useOAuth) {
    //    $scope.emailAddress = auth.emailAddress;
    //} else {
        //$scope.emailAddress = $scope.state.login.emailAddress;
    //}

    // SMTP config
    //$scope.smtpHost = mailConfig.smtp.hostname;
    //$scope.smtpPort = parseInt(mailConfig.smtp.port, 10);

    // transport encryption method
    /*if (mailConfig.smtp.secure && !mailConfig.smtp.ignoreTLS) {
        $scope.smtpEncryption = ENCRYPTION_METHOD_TLS;
    } else if (!mailConfig.smtp.secure && !mailConfig.smtp.ignoreTLS) {
        $scope.smtpEncryption = ENCRYPTION_METHOD_STARTTLS;
    } else {
        $scope.smtpEncryption = ENCRYPTION_METHOD_NONE;
    }*/

    // IMAP config
    //$scope.imapHost = mailConfig.imap.hostname;
    //$scope.imapPort = parseInt(mailConfig.imap.port, 10);

    // transport encryption method
    /*if (mailConfig.imap.secure && !mailConfig.imap.ignoreTLS) {
        $scope.imapEncryption = ENCRYPTION_METHOD_TLS;
    } else if (!mailConfig.imap.secure && !mailConfig.imap.ignoreTLS) {
        $scope.imapEncryption = ENCRYPTION_METHOD_STARTTLS;
    } else {
        $scope.imapEncryption = ENCRYPTION_METHOD_NONE;
    }*/

    //
    // Scope functions
    //

    $scope.test = function() {
        // parse the <select> dropdown lists
        var imapEncryption = ENCRYPTION_METHOD_TLS;//parseInt($scope.imapEncryption, 10);
        var smtpEncryption = ENCRYPTION_METHOD_STARTTLS;//parseInt($scope.smtpEncryption, 10);

        // build credentials object
        var credentials = {
            emailAddress: $scope.emailAddress,
            username: $scope.emailAddress,
            realname: '',
            password: $scope.password,
            xoauth2: auth.oauthToken,
            imap: {
                host: mailConfig.imap.hostname.toLowerCase(),
                port: mailConfig.imap.port,
                secure: imapEncryption === ENCRYPTION_METHOD_TLS,
                requireTLS: imapEncryption === ENCRYPTION_METHOD_STARTTLS,
                ignoreTLS: imapEncryption === ENCRYPTION_METHOD_NONE
            },
            smtp: {
                host: mailConfig.smtp.hostname.toLowerCase(),
                port: mailConfig.smtp.port,
                secure: smtpEncryption === ENCRYPTION_METHOD_TLS,
                requireTLS: smtpEncryption === ENCRYPTION_METHOD_STARTTLS,
                ignoreTLS: smtpEncryption === ENCRYPTION_METHOD_NONE
            }
        };
        console.log("login-set  103");
        //console.log(credentials);

        // use the credentials in the connection doctor
        connectionDoctor.configure(credentials);
        //$scope.connectionError = appConfig.string.pleaseWaite;
        // run connection doctor test suite
        return $q(function(resolve) {
            //$scope.busy = true;connectionError.message
            var pleaseWaite = new Error(appConfig.string.pleaseWaite);
            pleaseWaite.code = 1;
            $scope.connectionError = pleaseWaite;
            resolve();
            console.log("login-set  113");

        }).then(function() {
            console.log("login-set  115");

            return connectionDoctor.check();
        }).then(function() {
            // persists the credentials and forwards to /login
            console.log("login-set  120");
            auth.setCredentials(credentials);
            //$scope.busy = false;
            $location.path('/login');
        }).catch(function(err) {
            // display the error in the settings UI
            $scope.connectionError = err;
            //$scope.busy = false;
        });
    };
};

module.exports = SetCredentialsCtrl;