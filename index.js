const ariClient = require('ari-client');
const config = require('config');
const Pino = require('pino');
const log = new Pino({
    name: 'Asterisk-Dialogflow-ARI-Bridge',
});
const Bridge = require('./lib/Bridge');
const mqtt = require('async-mqtt');

log.info('Starting');

async function main() {
    try {
        let mqttClient = null;

        if (config.get('mqtt.url')) {
            log.info('trying to connect to mqtt');
            mqttClient = await mqtt.connectAsync(config.get('mqtt.url'))
            log.info('connected to mqtt');
        }

        const ariConfig = config.get('ari');

        log.info({ ariConfig }, 'ari config');

        client = await ariClient.connect(ariConfig.url, ariConfig.username, ariConfig.password);
        log.info('connected to ari websocket');

        client.on('StasisStart', async (event, channel) => {

            if (event.channel.name.includes('UnicastRTP')) {
                return;
            }

            let logger = log.child({id: channel.id});
            logger.info({event}, 'channel entered our application');

            let bridge = new Bridge(client, log);

            bridge.on('empty', async () => {
                await bridge.destroy();
            });

            if (mqttClient) {
                bridge.on('newStream', async (data) => {
                    await mqttClient.publish(`${config.get('mqtt.topicPrefix')}/newStream`, JSON.stringify({
                        roomName: data.roomName,
                        port: data.port,
                        callerName: data.callerName,
                        channelId: data.channelId
                    }));

                });

                bridge.on('streamEnded', async (data) => {
                    await mqttClient.publish(`${config.get('mqtt.topicPrefix')}/streamEnded`, JSON.stringify({
                        name: data.roomName,
                        port: data.port,
                        callerName: data.callerName,
                        channelId: data.channelId
                    }));
                });
            }

            await bridge.create();

            await channel.answer();

            await bridge.addChannel(channel);

        });

        client.on('StasisEnd', (event, channel) => {

        });

        await client.start(ariConfig.appName);
        log.info('ari started');
    } catch (err) {
        throw err;
    }
};

main();