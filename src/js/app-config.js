'use strict';

var appCfg = {};

var ngModule = angular.module('woAppConfig', []);
ngModule.factory('appConfig', function() {
    return appCfg;
});
module.exports = appCfg;

/**
 * Global app configurations
 */
appCfg.config = {
    pgpComment: 'Whiteout Mail - https://whiteout.io',
    keyServerUrl: 'https://keys.whiteout.io',////
    //keyServerUrl: 'https://fortest.io',
    hkpUrl: 'http://keyserver.ubuntu.com',
    adminUrl: 'https://admin-node.whiteout.io',
    settingsUrl: 'https://settings.whiteout.io/autodiscovery/',
    mailServer: {
        domain: 'wmail.io',
        imap: {
            hostname: 'imap.wmail.io',
            port: 993,
            secure: true
        },
        smtp: {
            hostname: 'smtp.wmail.io',
            port: 465,
            secure: true
        }
    },
    oauthDomains: [/\.gmail\.com$/, /\.googlemail\.com$/],
    ignoreUploadOnSentDomains: [/\.gmail\.com$/, /\.googlemail\.com$/],
    serverPrivateKeyId: 'EE342F0DDBB0F3BE',
    symKeySize: 256,
    symIvSize: 96,
    asymKeySize: 2048,
    workerPath: 'js',
    reconnectInterval: 10000,
    checkOutboxInterval: 5000,
    iconPath: '/img/icon-128-chrome.png',
    verificationUrl: '/verify/',
    verificationUuidLength: 36,
    dbVersion: 6,
    appVersion: undefined,
    outboxMailboxPath: 'OUTBOX',
    outboxMailboxName: 'Outbox',
    outboxMailboxType: 'Outbox',
    connDocTimeout: 5000,
    imapUpdateBatchSize: 25
};

// parse manifest to get configurations for current runtime
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
    setConfigParams(chrome.runtime.getManifest());
} else if (typeof $ !== 'undefined' && $.get) {
    //$.get('/manifest.json', setConfigParams, 'json');
}

function setConfigParams(manifest) {
    var cfg = appCfg.config;

    function getUrl(beginsWith) {
        return _.find(manifest.permissions, function(permission) {
            return typeof permission === 'string' && permission.indexOf(beginsWith) === 0;
        }).replace(/\/$/, ''); // remove last '/' from url due to required syntax in manifest
    }

    // get key server base url
    cfg.keyServerUrl = getUrl('https://keys');
    // get the app version
    cfg.appVersion = manifest.version;
}

/**
 * Strings are maintained here
 */
appCfg.string = {
    fallbackSubject: '(no subject)',
    invitationSubject: 'Invitation to a private conversation',
    invitationMessage: 'Hi,\n\nI use Whiteout Mail to send and receive encrypted email. I would like to exchange encrypted messages with you as well.\n\nPlease install the Whiteout Mail application. This application makes it easy to read and write messages securely with PGP encryption applied.\n\nGo to the Whiteout Networks homepage to learn more and to download the application: https://whiteout.io\n\n',
    //signature: '\n\n\n--\nSent from Whiteout Mail - https://whiteout.io\n\nMy PGP key: ',
    signature: '',
    webSite: 'http://whiteout.io',
    verificationSubject: 'Just for test',
    //sendBtnClear: 'Send',
    sendBtnClear: '发送',
    //sendBtnSecure: 'Send securely',
    //sendBtnSecure: 'Send',
    sendBtnSecure: '发送',
    updatePublicKeyTitle: 'Public Key Updated',
    updatePublicKeyMsgNewKey: '{0} updated his key and may not be able to read encrypted messages sent with his old key. Update the key?',
    updatePublicKeyMsgRemovedKey: '{0} revoked his key and may no longer be able to read encrypted messages. Remove the key?',
    //updatePublicKeyPosBtn: 'Yes',
    //updatePublicKeyNegBtn: 'No',
    updatePublicKeyPosBtn: '是',
    updatePublicKeyNegBtn: '否',
    //outdatedCertificateTitle: 'Warning',
    outdatedCertificateMessage: 'The SSL certificate for the mail server {0} changed, the connection was refused.',
    //updateCertificateTitle: 'Warning',
    updateCertificateMessage: 'The SSL certificate for the mail server {0} changed. Do you want to proceed?',
    //updateCertificatePosBtn: 'Yes',
    //updateCertificateNegBtn: 'No',
    outdatedCertificateTitle: '提示',
    //outdatedCertificateMessage: 'The SSL certificate for the mail server {0} changed, the connection was refused.',
    updateCertificateTitle: '提示',
    //updateCertificateMessage: 'The SSL certificate for the mail server {0} changed. Do you want to proceed?',
    updateCertificatePosBtn: '是',
    updateCertificateNegBtn: '否',
    certificateFaqLink: 'https://github.com/whiteout-io/mail-html5/wiki/FAQ#what-does-the-ssl-certificate-for-the-mail-server--changed-mean',
    bugReportTitle: '诊断',
    bugReportSubject: '[Bug] 报告问题',
    bugReportBody: '重现步骤\n1. \n2. \n3. \n\n出现什么问题了?\n\n\n期望的结果是什么?\n\n\n\n== 下面的请不要修改! ==\n\n\n## Log\n\nBelow is the log. It includes your interactions with your email provider from the point where you started the app for the last time. Login data and email content has been stripped. Any information provided by you will be used for the purpose of locating and fixing the bug you reported. It will be deleted subsequently. However, you can edit this log and/or remove log data in the event that something would show up.\n\nUser-Agent: {0}\nVersion: {1}\n\n',
    //supportAddress: 'mail.support@whiteout.io',
    supportAddress: 'b-deng@mygzb.com',
    connDocOffline: '已经离线，请于在线的时候重试.',
    connDocTlsWrongCert: 'A connection to {0} was rejected because the TLS certificate is invalid. Please have a look at the FAQ for information on how to fix this error.',
    connDocHostUnreachable: 'We could not establish a connection to {0}. Please check the server settings!',
    connDocHostTimeout: '在{1}ms内无法连接到{0}. 请检查服务器设置和加密模式!',
    connDocAuthRejected: '未能连接到{0}，请检查用户名和密码',
    connDocNoInbox: 'We could not detect an IMAP inbox folder on {0}.  Please have a look at the FAQ for information on how to fix this error.',
    connDocGenericError: 'There was an error connecting to {0}: {1}',
    //logoutTitle: 'Logout',
    logoutTitle: '登出',
    logoutMessage: '是否要退出登录?',
    removePreAuthAccountTitle: 'Remove account',
    removePreAuthAccountMessage: 'Are you sure you want to remove your account from this device?',
    pleaseWaite: '正在登陆，请稍等。。。'
};