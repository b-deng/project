'use strict';

var axe = require('axe-logger');

//var LoginCtrl = function($scope, $timeout, $location, updateHandler, account, auth, email, keychain, dialog, appConfig) {
var LoginCtrl = function($scope, $timeout, $location, $routeParams, $q, email, auth, pgp, publickeyVerifier, updateHandler, account, dialog, appConfig) {
    //
    // Scope functions
    //
    //!$routeParams.dev && !auth.isInitialized() && $location.path('/');


    $scope.init = function() {
        axe.debug('login.js   12');
        return auth.init().then(function() {
            axe.debug('login.js   14');
            return auth.getEmailAddress();
            axe.debug('login.js   16');
        }).then(function(info) {
            // check if account needs to be selected
            axe.debug('login.js   19');
            axe.debug(info);
            if (!info.emailAddress) {
                return $scope.goTo('/add-account');
            }

            // initiate the account by initializing the email dao and user storage
            return account.init({
                emailAddress: info.emailAddress,
                realname: info.realname
            }).then(function(availableKeys) {
                axe.debug("login 30");
                return confirmPassphrase();
            });

        }).catch(dialog.error);
    };

    $scope.goTo = function(location) {
        return $timeout(function() {
            $location.path(location);
        });
    };

    function confirmPassphrase() {
        $scope.key = {
            publicKeyArmored: "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\n\
Version: OpenPGP.js v1.2.0\r\n\
Comment: Whiteout Mail - https://whiteout.io\r\n\r\n\
xsBNBFXJoacBCADN01ia71H3Jj/xxQDjbNRAaHx72CIzPoLngqXPR/m8XEQH\r\n\
KQN3eVH5bSB0YiufOAiT31AxXql3Vy8J0SkeWW09k+/WgEu50mOpSkubugcG\r\n\
OxJX4+gmlUsAosZ+5wBe+H+9Y/WFRAlIP4qSzNVWdFv1GUx/eIEzTwawutKC\r\n\
vDBUWOtKUOfg8dAh5uJ9i1GMEYOiJiSIVqrqmPFeOyA8xrlBeZffb3RBN4Da\r\n\
ogGnFwIZWrKKoGIaXBV41s9hUI8e9EcEaZdsuZd0qrLGTdVVNLK2ZlInFlAV\r\n\
IYFgQPa5AsC1B24vOXV/iO210CITJ2/7tQk7Nns9eNIBb3d5LoYIgsk/ABEB\r\n\
AAHNFkIgPGRlbmdiaW4yNTlAc2luYS5jbj7CwHIEEAEIACYFAlXJoacGCwkI\r\n\
BwMCCRAle9jbCN51JwQVCAIKAxYCAQIbAwIeAQAAkZ0H/juvvWDGRMBl/KnM\r\n\
KlsxOWcn1e8FpYQWTwwlM+vGgkEtosH6UL/1HHdUkU4OjHW4uUn6E0/fdwCj\r\n\
wYv96PY/LKp/KGdwqJ0hnZh2OXyVOqnVeEtfnutKN8Erc62385tL49lE+td+\r\n\
h9sXQwZhmnbFA6VA1/YbK3MlGGcccNZaQFc7Ouf1RN5sCCAgPaJlt6Nrb8V2\r\n\
ZcywiNFbuZ2iBpzOJKOGyVdA0yL8cCjUXDT03K9qAXXe/j0eQBPHZVkmIbQh\r\n\
Z0gAD3CYnlZ+3vNbd5HxJn3vUiQdgikc2aHP0vyQyEpyaZB0Vb/KpWPs4Zed\r\n\
skuX33MVFe3nqaAdtaanVccUeR7OwE0EVcmhpwEIAL5hfZ8rze1/vhsuAcml\r\n\
4Q4JeU5/TREaOvuFIOQUl4Cr/p/qYqX9C67NZC/9ZeK8iVJoxud3qHdzBn1y\r\n\
vdPfK++k5xZ7FRw8IN+zdfGOnst+fXZXneVbwhZ5NZSydwG4rWLnqtxipRnN\r\n\
2lhgwI8I1mq8qUoT45FKRKVp5MZTQoKDtFKituYv4I3N0Rxyux3fpwfaA6Lb\r\n\
IIbFHVBjJ5kGuA0HihsXmXb3jNb3z/8kCjrvX7xaR/MdE4Iv2tuu8tT2D+Ex\r\n\
FHwmYYFMJhYuq1JXQoitlOQ2gza43Sk1zTB7k5n3uqEsLmyJOxHR3BX1VCWs\r\n\
4sViF+oxyFcldspyDciAAysAEQEAAcLAXwQYAQgAEwUCVcmhqAkQJXvY2wje\r\n\
dScCGwwAADLNB/4yMFSZCep5RHTP/AXGmqtsPVzceXBQqh+Jl7NRc7LYcqMM\r\n\
bW3f2iIGfvhKNxzLyxMfsPYn07mWHAD5H+RaYuj3kx1QQPai+eSfG0raexWo\r\n\
mLSfqSXLA37/n8e3U8By69IY41c8/LdQ4sgJ85tWwQdIEkAnHjSbZHAf7cEq\r\n\
oq/tiW4PzYa6Gf5e2ASbT6AtFJru5qey/+9AVGw9ZxpdIJwICMHAeYq3aALa\r\n\
3g1HOt7WOMmjf8oWjt6mBb2o9pTzlyj8SxE2r2Si16kOAbiTT/mnOOYh78PA\r\n\
72WZdoYHONqNGPaQrE1Ok4DtR4swcSl15aLmsDhVwcwlJYceMj2lH9Ym\r\n\
=VLzw\r\n\
-----END PGP PUBLIC KEY BLOCK-----",
    privateKeyArmored: "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\n\
Version: OpenPGP.js v1.2.0\r\n\
Comment: Whiteout Mail - https://whiteout.io\r\n\r\n\
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\r\n\
=ntur\r\n\
-----END PGP PRIVATE KEY BLOCK-----"
        };
            var userId = auth.emailAddress,
            pubKeyNeedsVerification = false,
            keypair;

        return $q(function(resolve) {
            $scope.busy = true;
            $scope.errMsg = undefined; // reset error msg
            $scope.incorrect = false;
            resolve();
            axe.debug("login  146");
        }).then(function(keys) {
            keypair = keys || {};

            //$scope.key.publicKeyArmored = pgp.extractPublicKey($scope.key.privateKeyArmored);
            //axe.debug($scope.key.privateKeyArmored);
            //axe.debug($scope.key.publicKeyArmored);


            // parse keypair params
            var privKeyParams, pubKeyParams;
            try {
                privKeyParams = pgp.getKeyParams($scope.key.privateKeyArmored);
                pubKeyParams = pgp.getKeyParams($scope.key.publicKeyArmored);
                //axe.debug(privKeyParams);
                //axe.debug(pubKeyParams);
            } catch (e) {
                throw new Error('Error reading key paramaters!');
            }

            // set parsed private key
            keypair.privateKey = {
                _id: privKeyParams._id,
                userId: userId,
                userIds: privKeyParams.userIds,
                encryptedKey: $scope.key.privateKeyArmored
            };

            if (!keypair.publicKey) {
                // there is no public key on the key server yet... use parsed
                keypair.publicKey = {
                    _id: pubKeyParams._id,
                    userId: userId,
                    userIds: pubKeyParams.userIds,
                    publicKey: $scope.key.publicKeyArmored
                };
                pubKeyNeedsVerification = true; // this public key needs to be authenticated
            }

            // import and validate keypair
            return email.unlock({
                keypair: keypair,
                passphrase: undefined
                //passphrase: undefined
            }).catch(function(err) {
                $scope.incorrect = true;
                throw err;
            });

        }).then(function(keypair) {
            if (!pubKeyNeedsVerification) {
                // persist credentials and key and go to main account screen
                return keychain.putUserKeyPair(keypair).then(function() {
                    return auth.storeCredentials();
                }).then(function() {
                    $location.path('/account');
                });
            }
            axe.debug("login  204");
            // remember keypair for public key verification
            publickeyVerifier.keypair = keypair;
            $location.path('/login-verify-public-key');
            //$location.path('/account');
            //success();
        }).catch(displayError);

        function displayError(err) {
            $scope.busy = false;
            $scope.errMsg = err.errMsg || err.message;
        }
    }

    $scope.test = function() {
        $scope.incorrect = false;

        //var PRIV_KEY_PREFIX = '-----BEGIN PGP PRIVATE KEY BLOCK-----';
        //var PUB_KEY_PREFIX = '-----BEGIN PGP PUBLIC KEY BLOCK-----';
        //var PRIV_ERR_MSG = 'Cannot find private PGP key block!';
        //pasteKey();
        axe.debug('login  306');
        confirmPassphrase();
        axe.debug('login  297');
    };
    //
    // Start the app
    //

    // check for app update
    axe.debug('login  234');
    updateHandler.checkForUpdate();
    axe.debug('login  236');

    // init the app
    if (!appConfig.preventAutoStart) {
        axe.debug('login  240');
        $scope.init();
        axe.debug('login  242');
    }
};

module.exports = LoginCtrl;