import nats from 'node-nats-streaming';
import { ApplicationCreatedPublisher } from './events';

console.clear();

const stan = nats.connect('jobsify', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new ApplicationCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '123',
      jobId: '123',
      userId: '123',
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'New Job',
  //   description: '20% off',
  // });

  // stan.publish('application:created', data, () => {
  //   console.log('Published a job!');
  // });
});
