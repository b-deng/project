'use strict';

var AddAccountCtrl = function($scope, $location, $routeParams, $timeout, $q, mailConfig, auth, dialog) {
    !$routeParams.dev && !auth.isInitialized() && $location.path('/'); // init app

    $scope.getSettings = function() {
        /*if ($scope.form.$invalid) {
            $scope.errMsg = 'Please enter a valid email address!';
            return;
        }*/

        return $q(function(resolve) {
            //$scope.busy = true;
            //$scope.errMsg = undefined; // reset error msg
            resolve();

        })/*.then(function() {
         return mailConfig.get($scope.emailAddress);

         })*/.then(function() {
                console.log('add-account.js   21');
                //console.log(config)
                //$scope.busy = false;
                $scope.state.login =
                {
                    mailConfig:{
                        /*imap: {
                            hostname: 'imap.sina.cn',
                            port: 993,
                            secure: true,
                            source: 'guess',
                            type: 'imap'
                        },
                        smtp: {
                            hostname: 'smtp.sina.cn',
                            port: 587,
                            secure: true,
                            source: 'guess',
                            type: 'smtp'
                        }*/
                         imap: {
                            hostname: 'imap.qiye.163.com',
                            port: 993,
                            secure: true,
                            source: 'guess',
                            type: 'imap'
                        },
                        smtp: {
                            hostname: 'smtp.qiye.163.com',
                            port: 25,
                            secure: true,
                            source: 'guess',
                            type: 'smtp'
                        }
                    },
                    emailAddress:$scope.emailAddress
                };

                console.log('add-account.js   43')
                //console.log($scope.state.login.mailConfig)
                //var hostname = config.imap.hostname;
                //if (auth.useOAuth(hostname)) {
                // check for oauth support
                //    return $scope.oauthPossible();
                //} else {
                // use standard password login
                return $scope.setCredentials();
                //}

            }).catch(function() {
                //$scope.busy = false;
                //$scope.errMsg = 'Error fetching IMAP settings for that email address!';
            });
    };
    $scope.getSettings();

    $scope.getAccountSettings = function() {
        if ($scope.form.$invalid) {
            $scope.errMsg = 'Please enter a valid email address!';
            return;
        }

        return $q(function(resolve) {
            $scope.busy = true;
            $scope.errMsg = undefined; // reset error msg
            resolve();

        })/*.then(function() {
            return mailConfig.get($scope.emailAddress);

        })*/.then(function() {
            var config = {
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
                imap: {
                    hostname: 'imap.qiye.163.com',
                    port: 993,
                    secure: true,
                    source: 'guess',
                    type: 'imap'
                },
                smtp: {
                    hostname: 'smtp.qiye.163.com',
                    port: 25,
                    secure: true,
                    source: 'guess',
                    type: 'smtp'
                }
            };
            console.log('add-account.js   21');
            //console.log(config)
            $scope.busy = false;
            $scope.state.login = {
                mailConfig: config,
                emailAddress: $scope.emailAddress
            };
            //console.log('add-account.js   43')
            //console.log($scope.state.login.mailConfig)
            //var hostname = config.imap.hostname;
            //if (auth.useOAuth(hostname)) {
                // check for oauth support
            //    return $scope.oauthPossible();
            //} else {
                // use standard password login
                return $scope.setCredentials();
            //}

        }).catch(function() {
            $scope.busy = false;
            $scope.errMsg = 'Error fetching IMAP settings for that email address!';
        });
    };

    $scope.oauthPossible = function() {
        // ask user to use the platform's native OAuth api
        return dialog.confirm({
            title: 'Google Account Login',
            message: 'You are signing into a Google account. Would you like to sign in with Google or just continue with a password login?',
            positiveBtnStr: 'Google sign in',
            negativeBtnStr: 'Password',
            showNegativeBtn: true,
            faqLink: 'https://github.com/whiteout-io/mail-html5/wiki/FAQ#how-does-sign-in-with-google-work',
            callback: function(granted) {
                if (granted) {
                    // query oauth token
                    return getOAuthToken();
                } else {
                    // use normal user/password login
                    $scope.setCredentials();
                }
            }
        });

        function getOAuthToken() {
            // fetches the email address from the chrome identity api
            return auth.getOAuthToken().then(function() {
                // continue to setting credentials
                return $scope.setCredentials();

            }).catch(dialog.error);
        }
    };

    $scope.setCredentials = function() {
        return $timeout(function() {
            console.log('add-account.js   74');
            $location.path('/login-set-credentials');
        });
    };
};

module.exports = AddAccountCtrl;