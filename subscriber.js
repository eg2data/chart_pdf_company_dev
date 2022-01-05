import amqp from 'amqplib/callback_api';

amqp.connect('amqp://localhost', (err, connection) => {
    if(err) {
        throw err;
    }
    connection.createChannel((err, channel) => {
        if(err) {가
            throw err;
        }
// difference from here

        let queueName = "technical";

        channel.assertQueue(queueName, {
            durable: false
        });
        channel.consume(queueName, (message) => {
            console.log(`Received: ${message.content.toString()}`)
            channel.ack(message)
        },
        // {
        //     noAck: true
        // }
        )
    })
})


