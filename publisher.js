import amqp from 'amqplib/callback_api';

amqp.connect('amqp://localhost', (err, connection) => {
    if(err) {
        throw err;
    }
    connection.createChannel((err, channel) => {
        if(err) {
            throw err;
        }
// difference from here

        let queueName = "technical";
        let message = "this is technical thing";

        channel.assertQueue(queueName, {
            durable: false
        });
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message: ${message}`)
        setTimeout(() => {
            connection.close();
        }, 1000)
    })
})


