const amqplib = require('amqplib');
const { EXCHANGE_NAME, MESSAGE_BROKER_URL } = require('../config/serverConfig');

const createChannel = async() => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);  // connection with RabbitMQ server
        const channel = await connection.createChannel();
        channel.assertExchange(EXCHANGE_NAME, 'direct', false); // exchange distributer is setup
        return channel;
    } catch (ex) {
        throw ex;
    }   
}

const publishMessage = async(channel, binding_key, message) => { 
    try {
        await channel.assertQueue('REMINDER_QUEUE');
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (ex) {
        throw ex
    }
}

const subscribeMessage = async(channel, service, binding_key) => {
    try{const applicationQueue = await channel.assertQueue('REMINDER_QUEUE');
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
        channel.consume(applicationQueue.queue, msg => {
            console.log('recieved data')
            console.log(msg.content.toString());
            channel.ack(msg);
        })
    }catch(ex){
        throw ex;
    }
}

module.exports = {
    createChannel,
    publishMessage,
    subscribeMessage
}