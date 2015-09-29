'use strict';

var axe = require('axe-logger');

var RETRY_INTERVAL = 1000;

var PublicKeyVerifierCtrl = function($scope, $location, $q, $timeout, $interval, auth, publickeyVerifier) {
    $scope.retries = 0;

    /**
     * Runs a verification attempt
     */
    $scope.verify = function() {
        disarmTimeouts();
        axe.debug("login-verify-public-key  13");
        return $q(function(resolve) {
            // updates the GUI
            $scope.errMsg = undefined;
            resolve();
            axe.debug("login-verify-public-key  18");
        }).then(function() {
            // pre-flight check: is there already a public key for the user?
            //return publicKey.getByUserId(auth.emailAddress);

        }).then(function(cloudPubkey) {
            //if (!cloudPubkey || (cloudPubkey && cloudPubkey.source)) {
                // no pubkey, need to do the roundtrip
                //return verifyImap();
            //}

            // pubkey has already been verified, we're done here
            return success();

        }).catch(function(error) {
            $scope.errMsg = error.message; // display error

            scheduleVerification(); // schedule next verification attempt
        });

        function verifyImap() {
            // retrieve the credentials
            return auth.getCredentials().then(function(credentials) {
                return publickeyVerifier.configure(credentials); // configure imap

            }).then(function() {
                return publickeyVerifier.verify(); // connect to imap to look for the message

            }).then(function() {
                return success();
            });
        }
    };

    function success() {
        return $q(function(resolve) {
            resolve();
            axe.debug("login-verify-public-key  55");
        })/*.then(function() {
            // persist keypair
            axe.debug("login-verify-public-key  58");
            return publickeyVerifier.persistKeypair();

        })*/.then(function() {
            axe.debug("login-verify-public-key  62");
            // persist credentials locally (needs private key to encrypt imap password)
            return auth.storeCredentials();

        }).then(function() {
            axe.debug("login-verify-public-key  67");
            $location.path('/account'); // go to main account screen
        });
    }

    /**
     * schedules next verification attempt in RETRY_INTERVAL ms (scope.timeout)
     * and sets up a countdown timer for the ui (scope.countdown)
     */
    function scheduleVerification() {
        $scope.timeout = setTimeout($scope.verify, RETRY_INTERVAL);

        // shows the countdown timer, decrements each second
        $scope.countdown = RETRY_INTERVAL / 1000;
        $scope.countdownDecrement = setInterval(function() {
            if ($scope.countdown > 0) {
                $timeout(function() {
                    $scope.countdown--;
                }, 0);
            }
        }, 1000);
    }

    function disarmTimeouts() {
        clearTimeout($scope.timeout);
        clearInterval($scope.countdownDecrement);
    }

    // upload public key and then schedule verifcation
    //publickeyVerifier.uploadPublicKey().then(scheduleVerification);
    $scope.verify();
};

module.exports = PublicKeyVerifierCtrl;