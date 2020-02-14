const config = require('config');
const { EventEmitter } = require('events');

class Bridge extends EventEmitter {
    constructor(ariClient, log) {
        super();
        this.logger = log.child({});
        this.ariClient = ariClient;
    }

    async create () {
        this.bridge = await this.ariClient.Bridge();
        await this.bridge.create({type: 'mixing'});

        this.bridge.on('ChannelLeftBridge', (event) => {
            this.logger.info(event, 'Channel left bridge');
            if (event.bridge.channels.length === 0) {
                this.emit('empty');
            }
        })

        return this.bridge;
    }

    async destroy() {
        let destroyed = await this.bridge.destroy();
        return destroyed;
    }

    async addChannel(channel) {

        await this.bridge.addChannel({channel: channel.id});

        let externalMediaChannel = this.ariClient.Channel();
        let externalMediaUdpSourcePort = null;
        let callerName = channel.caller.name || 'Unknown';


        externalMediaChannel.on('StasisStart', (event, channel) => {
            this.logger.info(event, 'got a stasisStart event on the externalMediaChannel');
            this.bridge.addChannel({channel: channel.id});
        });

        externalMediaChannel.on('StasisEnd', () => {
            this.logger.info('external media channel ended');
            this.emit('streamEnded', {
                roomName: channel.dialplan.exten,
                port: externalMediaUdpSourcePort,
                callerName: callerName,
                channelId: channel.id
            });
        });

        let externalMediaOptions = {
            app: config.get('ari.appName'),
            external_host: `${config.get('rtpServer.host')}:${config.get('rtpServer.port')}`,
            format: config.get('rtpServer.format')
        };

        let externalMediaRes = await externalMediaChannel.externalMedia(externalMediaOptions);

        //set the externalMediaSourcePort
        externalMediaUdpSourcePort = externalMediaRes.local_port;

        this.emit('newStream', {
            roomName: channel.dialplan.exten,
            port: externalMediaUdpSourcePort,
            callerName: callerName,
            channelId: channel.id
        });

        this.logger.info('created an externalMedia channel');
    }
}

module.exports = Bridge;  // i miss exports default