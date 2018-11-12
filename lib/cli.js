const commander = require('commander');

const DEFAULT_HOST = 'localhost';
const DEFAULT_VHOST = '/';
const DEFAULT_ROUTING_KEY = '#';

commander
    .version(require('../package.json').version)
    .usage('<required> [optional]')
    .description('Tail the stream of messages from a RabbitMQ exchange')
    .option('--host [rabbit.host.com]', 'Remote host to connect to')
    .option('--exchange <myExchange>', 'Exchange to bind to')
    .option('--routingKeys [myRoutingKey]', 'Comma separated list of routing keys to consume (defaults to #)')
    .option('--vhost [/]', 'RabbitMQ vhost')
    .option('--auth [username:password]', 'Server authentication')
    .option('--queuePrefix [myDebugQueue]', 'Transient queue prefix')
    .option('--verbose', 'Print verbose output during setup')
    .parse(process.argv);

// Validate required CLI arguments.
const required = ['exchange'];
required.forEach((field) => {
    if (!commander[field]) {
        commander.help();
    }
});

const options = {
    connection: {},
    application: {}
};

options.connection = {
    protocol: 'amqp',
    hostname: commander.host || DEFAULT_HOST,
    vhost: commander.vhost || DEFAULT_VHOST
}

if (commander.auth) {
    const [username, password] = commander.auth.split(':');

    options.connection.username = username;
    options.connection.password = password;
}

options.application = {
    exchange: commander.exchange,
    routingKeys: commander.routingKeys,
    queuePrefix: commander.queuePrefix || commander.exchange,
    verbose: commander.hasOwnProperty('verbose')
}

module.exports = options;