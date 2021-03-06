using System;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Watchdog.RabbitMQ.Shared.Interfaces;
using Watchdog.RabbitMQ.Shared.Models;

namespace Watchdog.RabbitMQ.Shared.Services
{
    public sealed class Consumer : IConsumer
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public Consumer(IConnection connection)
        {
            _connection = connection;
            _channel = _connection.CreateModel();
        }

        public void Connect(ConsumerSettings settings, EventHandler<BasicDeliverEventArgs> received)
        {
            _channel.ExchangeDeclare(settings.ExchangeName, settings.ExchangeType);

            _channel.QueueDeclare(settings.QueueName, true, false, false);
            _channel.QueueBind(settings.QueueName, settings.ExchangeName, settings.RoutingKey);

            var consumer = new EventingBasicConsumer(_channel);

            consumer.Received += received;

            if (settings.SequentialFetch)
            {
                _channel.BasicQos(
                    prefetchSize: 0,
                    prefetchCount: 1,
                    global: false);
            }

            _channel.BasicConsume(settings.QueueName, settings.AutoAcknowledge, consumer);
        }


        public void SetAcknowledge(ulong deliveryTag, bool processed)
        {
            if (processed)
            {
                _channel.BasicAck(deliveryTag, false);
            }
            else
            {
                _channel.BasicNack(deliveryTag, false, true);
            }
        }

        public void Dispose()
        {
            _channel.Dispose();
            _connection.Dispose();
        }
    }
}