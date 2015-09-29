'use strict';

var ngModule = angular.module('woServices');
ngModule.service('keychain', Keychain);
module.exports = Keychain;

var DB_PUBLICKEY = 'publickey',
    DB_PRIVATEKEY = 'privatekey';

/**
 * A high-level Data-Access Api for handling Keypair synchronization
 * between the cloud service and the device's local storage
 */
function Keychain(accountLawnchair, publicKey, privateKey, crypto, pgp, dialog, appConfig) {
    this._lawnchairDAO = accountLawnchair;
    this._publicKeyDao = publicKey;
    //this._privateKeyDao = privateKey;
    this._crypto = crypto;
    this._pgp = pgp;
    this._dialog = dialog;
    this._appConfig = appConfig;
}

//
// Public key functions
//

/**
 * Display confirmation dialog to request a public key update
 * @param  {Object}   params.newKey   The user's updated public key object
 * @param  {String}   params.userId   The user's email address
 */
Keychain.prototype.requestPermissionForKeyUpdate = function(params, callback) {
    var str = this._appConfig.string;
    var message = params.newKey ? str.updatePublicKeyMsgNewKey : str.updatePublicKeyMsgRemovedKey;
    message = message.replace('{0}', params.userId);

    this._dialog.confirm({
        title: str.updatePublicKeyTitle,
        message: message,
        positiveBtnStr: str.updatePublicKeyPosBtn,
        negativeBtnStr: str.updatePublicKeyNegBtn,
        showNegativeBtn: true,
        callback: callback
    });
};

/**
 * Verifies the public key of a user o nthe public key store
 * @param {String} uuid The uuid to verify the key
 */
Keychain.prototype.verifyPublicKey = function(uuid) {
    return this._publicKeyDao.verify(uuid);
};

/**
 * Checks for public key updates of a given user id
 * @param {String} options.userId The user id (email address) for which to check the key
 * @param {String} options.overridePermission (optional) Indicates if the update should happen automatically (true) or with the user being queried (false). Defaults to false
 */
Keychain.prototype.refreshKeyForUserId = function(options) {
    var self = this,
        userId = options.userId,
        overridePermission = options.overridePermission;

    //console.log('options');
    //console.log(options);
    // get the public key corresponding to the userId
    return self.getReceiverPublicKey(userId).then(function(localKey) {
        //console.log('localKey');
        //console.log(localKey);
        if (!localKey || !localKey._id) {
            // there is no key available, no need to refresh
            return;
        }
        // no need to refresh manually imported public keys
        if (localKey.imported) {
            return localKey;
        }
        // check if the key id still exists on the key server
        return checkKeyExists(localKey);
    });

    // checks if the user's key has been revoked by looking up the key id
    function checkKeyExists(localKey) {
        return self._publicKeyDao.getByUserId(userId).then(function(cloudKey) {
            if (cloudKey && cloudKey._id === localKey._id) {
                // the key is present on the server, all is well
                return localKey;
            }
            // the key has changed, update the key
            return updateKey(localKey, cloudKey);

        }).catch(function(err) {
            if (err && err.code === 42) {
                // we're offline, we're done checking the key
                return localKey;
            }
            throw err;
        });
    }

    function updateKey(localKey, newKey) {
        // the public key has changed, we need to ask for permission to update the key
        if (overridePermission) {
            // don't query the user, update the public key right away
            return permissionGranted(localKey, newKey);
        } else {
            return requestPermission(localKey, newKey);
        }
    }

    function requestPermission(localKey, newKey) {
        return new Promise(function(resolve, reject) {
            // query the user if the public key should be updated
            self.requestPermissionForKeyUpdate({
                userId: userId,
                newKey: newKey
            }, function(granted) {
                if (!granted) {
                    // permission was not given to update the key, so don't overwrite the old one!
                    resolve(localKey);
                    return;
                }
                // permission was granted by the user
                permissionGranted(localKey, newKey).then(resolve).catch(reject);
            });
        });
    }

    function permissionGranted(localKey, newKey) {
        // permission to update the key was given, so delete the old one and persist the new one
        return self.removeLocalPublicKey(localKey._id).then(function() {
            if (!newKey) {
                // error or no new key to save
                return;
            }
            // persist the new key and return it
            return self.saveLocalPublicKey(newKey).then(function() {
                return newKey;
            });
        });
    }
};

/**
 * Look up a reveiver's public key by user id
 * @param userId [String] the receiver's email address
 */
Keychain.prototype.getReceiverPublicKey = function(userId) {
    var self = this;

    // search local keyring for public key
    return self._lawnchairDAO.list(DB_PUBLICKEY).then(function(allPubkeys) {
        var userIds;
        // query primary email address
        var testKey;
        if (userId === 'mail.support@whiteout.io')
        {
                testKey = {
__proto__: {},
_id: "EE342F0DDBB0F3BE",
publicKey: "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\n\
Version: OpenPGP.js v.1.20131205\r\n\
Comment: Whiteout Mail - http://whiteout.io\r\n\
\r\n\
xsBNBFLeWSABCADCNCMzMuFQu+hM9nu4tfyIdiyM/sCEhJa/iauzIlhS9Lun\r\n\
s0TnO5EF1pSM6CskFBegoA1fSOcRz1oalrZ2xPrVWdvEGf1NmfWEGM3mzaSa\r\n\
wRVZLHwPwkIYacobIa7gPeWJslUwSPVD8Yqz3BMXjp9kVcE7u/pgL2dUvg6w\r\n\
fBJM2ZJ5+2KJqsk7xhZpL3A0b+kc22srxQZsSQhgOJr0mAtJsjmLv1r/ZtNk\r\n\
Z2ktEQgCreHL1Am1dBZcNYB8cUyW0oqvyoA0ZHyRUM8BcOXNYIWAnlzWx99+\r\n\
8Adt5Q/07Qo0fy8uZLD/oUiGqDroBPx4QJgv8lbbPXteIQzMqaL/LjMRABEB\r\n\
AAHNKFdoaXRlb3V0IFVzZXIgPG1haWwuc3VwcG9ydEB3aGl0ZW91dC5pbz7C\r\n\
wFwEEAEIABAFAlLeWSIJEO40Lw3bsPO+AAA33wgApSgBINYWV7oajy8g5Cvx\r\n\
P4AmQTLqWrAFgY3wQ3rmyDUoHfS/ohyXQipi9Cyq4kymF6WGf1KGGhjPQosl\r\n\
PX9jQGIpJxAGAaV86NEN0gmmou0w7ERHhcCfBbkZPoumggeTkKb9+kCe7KXM\r\n\
pP9iXfW7sw7ry63KjosLLP3b8aSmfRC5GtpK2Ifo921ubuJc2GvY4cHRWYiU\r\n\
Sqr2RVj9a4tqBkDiSMcMnVFXaW64I1gXoiqWTtCeQbe4ywoy+AuLfnKs3Uq7\r\n\
VMv5ws7QTAacrtJxChJVcjojVAQ7um0H7lUxbXaKOi3Aj3mJQnplqCcEIkTj\r\n\
WCZV9w8HRoMPOaIxY7xViw==\r\n\
=9iZ9\r\n\
-----END PGP PUBLIC KEY BLOCK-----\r\n\
\r\n\
",
                    userId: userId
                };
        }
        else{
            testKey = {
__proto__: {},
_id: "257BD8DB08DE7527",
imported: true,
publicKey: "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\n\
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
                userId: userId,
                userIds: [{
                    __proto__: {},
                    emailAddress: 'dengbin259@sina.cn',
                    name: 'B'
                }]
            };
        }
        //console.log('keychain.js 199');
        //console.log(testKey);
        return testKey;

        var pubkey = _.findWhere(allPubkeys, {
            userId: userId
        });
        // query mutliple userIds
        if (!pubkey) {
            for (var i = 0, match; i < allPubkeys.length; i++) {
                userIds = self._pgp.getKeyParams(allPubkeys[i].publicKey).userIds;
                match = _.findWhere(userIds, {
                    emailAddress: userId
                });
                if (match) {
                    pubkey = allPubkeys[i];
                    break;
                }
            }
        }
        // that user's public key is already in local storage
        if (pubkey && pubkey._id) {
            //console.log('pubkey  175');
            //console.log(pubkey);
            return pubkey;
        }
        //console.log('no public key by that user id in storage!!!!!!!!');
        // no public key by that user id in storage
        // find from cloud by email address
        return self._publicKeyDao.getByUserId(userId).then(onKeyReceived).catch(onError);
    });

    function onKeyReceived(cloudPubkey) {
        if (!cloudPubkey) {
            // public key has been deleted without replacement
            return;
        }
        // persist and return cloud key
        return self.saveLocalPublicKey(cloudPubkey).then(function() {
            return cloudPubkey;
        });
    }

    function onError(err) {
        if (err && err.code === 42) {
            // offline
            return;
        }
        throw err;
    }
};

//
// Keypair functions
//

/**
 * Gets the local user's key either from local storage
 * or fetches it from the cloud. The private key is encrypted.
 * If no key pair exists, null is returned.
 * return [Object] The user's key pair {publicKey, privateKey}
 */
Keychain.prototype.getUserKeyPair = function(userId) {
    var self = this;

    // search for user's public key locally
    return self._lawnchairDAO.list(DB_PUBLICKEY).then(function(allPubkeys) {
        var pubkey = _.findWhere(allPubkeys, {
            userId: userId
        });
        //console.log('pubkey  223');
        //console.log(pubkey);
        if (pubkey && pubkey._id && !pubkey.source) {
            // that user's public key is already in local storage...
            // sync keypair to the cloud
            return syncKeypair(pubkey._id);
        }
        console.log('no public key by that user id in storage  230');
        // no public key by that user id in storage
        // find from cloud by email address
        return self._publicKeyDao.getByUserId(userId).then(function(cloudPubkey) {
            if (cloudPubkey && cloudPubkey._id && !cloudPubkey.source) {
                // there is a public key for that user already in the cloud...
                // sync keypair to local storage
                return syncKeypair(cloudPubkey._id);
            }

            // continue without keypair... generate or import new keypair
        });
    });

    function syncKeypair(keypairId) {
        var savedPubkey, savedPrivkey;
        // persist key pair in local storage
        return self.lookupPublicKey(keypairId).then(function(pub) {
            savedPubkey = pub;

            // persist private key in local storage
            return self.lookupPrivateKey(keypairId);

        }).then(function(priv) {
            savedPrivkey = priv;

        }).then(function() {
            var keys = {};

            if (savedPubkey && savedPubkey.publicKey) {
                keys.publicKey = savedPubkey;
            }
            if (savedPrivkey && savedPrivkey.encryptedKey) {
                keys.privateKey = savedPrivkey;
            }

            return keys;
        });
    }
};

/**
 * Checks to see if the user's key pair is stored both
 * locally and in the cloud and persist arccordingly
 * @param [Object] The user's key pair {publicKey, privateKey}
 */
Keychain.prototype.putUserKeyPair = function(keypair) {
    var self = this;

    // validate input
    /*if (!keypair || !keypair.publicKey || !keypair.privateKey || !keypair.publicKey.userId || keypair.publicKey.userId !== keypair.privateKey.userId) {
        return new Promise(function() {
            throw new Error('Cannot put user key pair: Incorrect input!');
        });
    }*/

    // don't check the user's own public key for deletion in refreshKeyForUserId
    keypair.publicKey.imported = true;

    // store public key locally
    return self.saveLocalPublicKey(keypair.publicKey).then(function() {
        // persist public key in cloud storage
        return self._publicKeyDao.put(keypair.publicKey);
    }).then(function() {
        // store private key locally
        return self.saveLocalPrivateKey(keypair.privateKey);
    });
};

/**
 * Uploads the public key
 * @param {Object} publicKey The user's public key
 * @return {Promise}
 */
Keychain.prototype.uploadPublicKey = function(publicKey) {
    var self = this;
    //console.log('publicKey  306');
    // validate input
    if (!publicKey || !publicKey.userId || !publicKey.publicKey) {
        return new Promise(function() {
            throw new Error('Cannot upload user key pair: Incorrect input!');
        });
    }

    return self._publicKeyDao.put(publicKey);
};

//
// Helper functions
//

Keychain.prototype.lookupPublicKey = function(id) {
    var self = this,
        cloudPubkey;

    if (!id) {
        return new Promise(function() {
            throw new Error('ID must be set for public key query!');
        });
    }

    // lookup in local storage
    return self._lawnchairDAO.read(DB_PUBLICKEY + '_' + id).then(function(pubkey) {
        if (pubkey) {
            //console.log('pubkey  334');
            //console.log(pubkey);
            return pubkey;
        }

        //console.log('fetch from cloud storage  339');
        // fetch from cloud storage
        return self._publicKeyDao.get(id).then(function(pub) {
            cloudPubkey = pub;
            // cache public key in cache
            return self.saveLocalPublicKey(cloudPubkey);
        }).then(function() {
            return cloudPubkey;
        });
    });
};

/**
 * List all the locally stored public keys
 */
Keychain.prototype.listLocalPublicKeys = function() {
    // search local keyring for public key
    return this._lawnchairDAO.list(DB_PUBLICKEY);
};

Keychain.prototype.removeLocalPublicKey = function(id) {
    return this._lawnchairDAO.remove(DB_PUBLICKEY + '_' + id);
};

Keychain.prototype.lookupPrivateKey = function(id) {
    // lookup in local storage
    return this._lawnchairDAO.read(DB_PRIVATEKEY + '_' + id);
};

Keychain.prototype.saveLocalPublicKey = function(pubkey) {
    // persist public key (email, _id)
    var pkLookupKey = DB_PUBLICKEY + '_' + pubkey._id;
    return this._lawnchairDAO.persist(pkLookupKey, pubkey);
};

Keychain.prototype.saveLocalPrivateKey = function(privkey) {
    // persist private key (email, _id)
    var prkLookupKey = DB_PRIVATEKEY + '_' + privkey._id;
    return this._lawnchairDAO.persist(prkLookupKey, privkey);
};