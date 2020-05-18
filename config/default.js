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
    asterisk: {
        // If set then Playback this Asterisk sound file before bridging to the dialogflow media.
        // Useful for debug and breaking media stand-offs.
        // playback: 'silence/1'
    },
    mqtt: {
        url: 'mqtt://test.mosquitto.org',
        topicPrefix: 'dialogflow-asterisk'
    }
}
