import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { ApplicationCreatedListener } from './events';

console.clear();

const stan = nats.connect('jobsify', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new ApplicationCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
