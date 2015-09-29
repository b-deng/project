'use strict';

//var log = require('npmlog');

var LoginExistingCtrl = function($scope, $location, $routeParams, $q, email, auth, pgp, keychain, publickeyVerifier) {
    !$routeParams.dev && !auth.isInitialized() && $location.path('/'); // init app

    $scope.incorrect = false;

    //var PRIV_KEY_PREFIX = '-----BEGIN PGP PRIVATE KEY BLOCK-----';
    //var PUB_KEY_PREFIX = '-----BEGIN PGP PUBLIC KEY BLOCK-----';
    //var PRIV_ERR_MSG = 'Cannot find private PGP key block!';
    //$scope.pasteKey();
    $scope.confirmPassphrase();

    $scope.pasteKey = function() {
        /*var index = pasted.indexOf(PRIV_KEY_PREFIX);
        if (index === -1) {
            $scope.errMsg = PRIV_ERR_MSG;
            return;
        }*/


        $scope.errMsg = undefined; // reset error msg

        $scope.key = {
            //privateKeyArmored: pasted.substring(index, pasted.length).trim()
            privateKeyArmored: "Version: OpenPGP.js v1.2.0\
            Comment: Whiteout Mail - https://whiteout.io\
\
        xsBNBFXJoacBCADN01ia71H3Jj/xxQDjbNRAaHx72CIzPoLngqXPR/m8XEQH\
        KQN3eVH5bSB0YiufOAiT31AxXql3Vy8J0SkeWW09k+/WgEu50mOpSkubugcG\
        OxJX4+gmlUsAosZ+5wBe+H+9Y/WFRAlIP4qSzNVWdFv1GUx/eIEzTwawutKC\
        vDBUWOtKUOfg8dAh5uJ9i1GMEYOiJiSIVqrqmPFeOyA8xrlBeZffb3RBN4Da\
        ogGnFwIZWrKKoGIaXBV41s9hUI8e9EcEaZdsuZd0qrLGTdVVNLK2ZlInFlAV\
        IYFgQPa5AsC1B24vOXV/iO210CITJ2/7tQk7Nns9eNIBb3d5LoYIgsk/ABEB\
        AAHNFkIgPGRlbmdiaW4yNTlAc2luYS5jbj7CwHIEEAEIACYFAlXJoacGCwkI\
        BwMCCRAle9jbCN51JwQVCAIKAxYCAQIbAwIeAQAAkZ0H/juvvWDGRMBl/KnM\
        KlsxOWcn1e8FpYQWTwwlM+vGgkEtosH6UL/1HHdUkU4OjHW4uUn6E0/fdwCj\
        wYv96PY/LKp/KGdwqJ0hnZh2OXyVOqnVeEtfnutKN8Erc62385tL49lE+td+\
        h9sXQwZhmnbFA6VA1/YbK3MlGGcccNZaQFc7Ouf1RN5sCCAgPaJlt6Nrb8V2\
        ZcywiNFbuZ2iBpzOJKOGyVdA0yL8cCjUXDT03K9qAXXe/j0eQBPHZVkmIbQh\
        Z0gAD3CYnlZ+3vNbd5HxJn3vUiQdgikc2aHP0vyQyEpyaZB0Vb/KpWPs4Zed\
        skuX33MVFe3nqaAdtaanVccUeR7OwE0EVcmhpwEIAL5hfZ8rze1/vhsuAcml\
        4Q4JeU5/TREaOvuFIOQUl4Cr/p/qYqX9C67NZC/9ZeK8iVJoxud3qHdzBn1y\
        vdPfK++k5xZ7FRw8IN+zdfGOnst+fXZXneVbwhZ5NZSydwG4rWLnqtxipRnN\
        2lhgwI8I1mq8qUoT45FKRKVp5MZTQoKDtFKituYv4I3N0Rxyux3fpwfaA6Lb\
        IIbFHVBjJ5kGuA0HihsXmXb3jNb3z/8kCjrvX7xaR/MdE4Iv2tuu8tT2D+Ex\
        FHwmYYFMJhYuq1JXQoitlOQ2gza43Sk1zTB7k5n3uqEsLmyJOxHR3BX1VCWs\
        4sViF+oxyFcldspyDciAAysAEQEAAcLAXwQYAQgAEwUCVcmhqAkQJXvY2wje\
        dScCGwwAADLNB/4yMFSZCep5RHTP/AXGmqtsPVzceXBQqh+Jl7NRc7LYcqMM\
        bW3f2iIGfvhKNxzLyxMfsPYn07mWHAD5H+RaYuj3kx1QQPai+eSfG0raexWo\
        mLSfqSXLA37/n8e3U8By69IY41c8/LdQ4sgJ85tWwQdIEkAnHjSbZHAf7cEq\
        oq/tiW4PzYa6Gf5e2ASbT6AtFJru5qey/+9AVGw9ZxpdIJwICMHAeYq3aALa\
        3g1HOt7WOMmjf8oWjt6mBb2o9pTzlyj8SxE2r2Si16kOAbiTT/mnOOYh78PA\
        72WZdoYHONqNGPaQrE1Ok4DtR4swcSl15aLmsDhVwcwlJYceMj2lH9Ym\
            =VLzw\
-----END PGP PUBLIC KEY BLOCK-----\
\
\
        -----BEGIN PGP PRIVATE KEY BLOCK-----\
            Version: OpenPGP.js v1.2.0\
        Comment: Whiteout Mail - https://whiteout.io\
\
        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\
            =ntur\
        -----END PGP PRIVATE KEY BLOCK-----\
"
        };
    };

    $scope.confirmPassphrase = function() {
        /*if ($scope.form.$invalid || !$scope.key) {
            $scope.errMsg = PRIV_ERR_MSG;
            return;
        }*/
        $scope.key = {
            //privateKeyArmored: pasted.substring(index, pasted.length).trim()
            privateKeyArmored: "Version: OpenPGP.js v1.2.0\
            Comment: Whiteout Mail - https://whiteout.io\
\
        xsBNBFXJoacBCADN01ia71H3Jj/xxQDjbNRAaHx72CIzPoLngqXPR/m8XEQH\
        KQN3eVH5bSB0YiufOAiT31AxXql3Vy8J0SkeWW09k+/WgEu50mOpSkubugcG\
        OxJX4+gmlUsAosZ+5wBe+H+9Y/WFRAlIP4qSzNVWdFv1GUx/eIEzTwawutKC\
        vDBUWOtKUOfg8dAh5uJ9i1GMEYOiJiSIVqrqmPFeOyA8xrlBeZffb3RBN4Da\
        ogGnFwIZWrKKoGIaXBV41s9hUI8e9EcEaZdsuZd0qrLGTdVVNLK2ZlInFlAV\
        IYFgQPa5AsC1B24vOXV/iO210CITJ2/7tQk7Nns9eNIBb3d5LoYIgsk/ABEB\
        AAHNFkIgPGRlbmdiaW4yNTlAc2luYS5jbj7CwHIEEAEIACYFAlXJoacGCwkI\
        BwMCCRAle9jbCN51JwQVCAIKAxYCAQIbAwIeAQAAkZ0H/juvvWDGRMBl/KnM\
        KlsxOWcn1e8FpYQWTwwlM+vGgkEtosH6UL/1HHdUkU4OjHW4uUn6E0/fdwCj\
        wYv96PY/LKp/KGdwqJ0hnZh2OXyVOqnVeEtfnutKN8Erc62385tL49lE+td+\
        h9sXQwZhmnbFA6VA1/YbK3MlGGcccNZaQFc7Ouf1RN5sCCAgPaJlt6Nrb8V2\
        ZcywiNFbuZ2iBpzOJKOGyVdA0yL8cCjUXDT03K9qAXXe/j0eQBPHZVkmIbQh\
        Z0gAD3CYnlZ+3vNbd5HxJn3vUiQdgikc2aHP0vyQyEpyaZB0Vb/KpWPs4Zed\
        skuX33MVFe3nqaAdtaanVccUeR7OwE0EVcmhpwEIAL5hfZ8rze1/vhsuAcml\
        4Q4JeU5/TREaOvuFIOQUl4Cr/p/qYqX9C67NZC/9ZeK8iVJoxud3qHdzBn1y\
        vdPfK++k5xZ7FRw8IN+zdfGOnst+fXZXneVbwhZ5NZSydwG4rWLnqtxipRnN\
        2lhgwI8I1mq8qUoT45FKRKVp5MZTQoKDtFKituYv4I3N0Rxyux3fpwfaA6Lb\
        IIbFHVBjJ5kGuA0HihsXmXb3jNb3z/8kCjrvX7xaR/MdE4Iv2tuu8tT2D+Ex\
        FHwmYYFMJhYuq1JXQoitlOQ2gza43Sk1zTB7k5n3uqEsLmyJOxHR3BX1VCWs\
        4sViF+oxyFcldspyDciAAysAEQEAAcLAXwQYAQgAEwUCVcmhqAkQJXvY2wje\
        dScCGwwAADLNB/4yMFSZCep5RHTP/AXGmqtsPVzceXBQqh+Jl7NRc7LYcqMM\
        bW3f2iIGfvhKNxzLyxMfsPYn07mWHAD5H+RaYuj3kx1QQPai+eSfG0raexWo\
        mLSfqSXLA37/n8e3U8By69IY41c8/LdQ4sgJ85tWwQdIEkAnHjSbZHAf7cEq\
        oq/tiW4PzYa6Gf5e2ASbT6AtFJru5qey/+9AVGw9ZxpdIJwICMHAeYq3aALa\
        3g1HOt7WOMmjf8oWjt6mBb2o9pTzlyj8SxE2r2Si16kOAbiTT/mnOOYh78PA\
        72WZdoYHONqNGPaQrE1Ok4DtR4swcSl15aLmsDhVwcwlJYceMj2lH9Ym\
            =VLzw\
-----END PGP PUBLIC KEY BLOCK-----\
\
\
        -----BEGIN PGP PRIVATE KEY BLOCK-----\
            Version: OpenPGP.js v1.2.0\
        Comment: Whiteout Mail - https://whiteout.io\
\
        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\
            =ntur\
        -----END PGP PRIVATE KEY BLOCK-----\
"
        };
        var userId = auth.emailAddress,
            pubKeyNeedsVerification = false,
            keypair;

        return $q(function(resolve) {
            $scope.busy = true;
            $scope.errMsg = undefined; // reset error msg
            $scope.incorrect = false;
            resolve();

        })/*.then(function() {
            // check if user already has a public key on the key server
            return keychain.getUserKeyPair(userId);

        })*/.then(function(keys) {
            keypair = keys || {};

            // extract public key from private key block if missing in key file
            /*if (!$scope.key.publicKeyArmored || $scope.key.publicKeyArmored.indexOf(PUB_KEY_PREFIX) < 0) {
                try {
                    $scope.key.publicKeyArmored = pgp.extractPublicKey($scope.key.privateKeyArmored);
                } catch (e) {
                    throw new Error('Cannot find public PGP key!');
                }
            }*/
            $scope.key.publicKeyArmored = pgp.extractPublicKey($scope.key.privateKeyArmored);

            // parse keypair params
            var privKeyParams, pubKeyParams;
            try {
                privKeyParams = pgp.getKeyParams($scope.key.privateKeyArmored);
                pubKeyParams = pgp.getKeyParams($scope.key.publicKeyArmored);
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

            // remember keypair for public key verification
            publickeyVerifier.keypair = keypair;
            // upload private key and then go to public key verification
            //$location.path('/login-privatekey-upload');
            //$scope.errMsg = $scope.passphrase;
            //throw new Error($scope.passphrase);
            //log.silly('io', 'passphrase %s', $scope.passphrase);
            $location.path('/login-verify-public-key');

        }).catch(displayError);
    };

    function displayError(err) {
        $scope.busy = false;
        $scope.errMsg = err.errMsg || err.message;
    }
};

module.exports = LoginExistingCtrl;