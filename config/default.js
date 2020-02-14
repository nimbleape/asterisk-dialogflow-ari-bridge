module.exports = {
    ari: {
        url: 'http://asterisk-fqdn:8088',
        username: 'username',
        password: 'foo',
        appName: 'dialogflow'
    },
    rtpServer: {
        host: 'rtp-audioserver-ip',
        port: '7777',
        format: 'slin16'
    },
    mqtt: {
        url: 'mqtt://test.mosquitto.org',
        topicPrefix: 'dialogflow-asterisk'
    }
}