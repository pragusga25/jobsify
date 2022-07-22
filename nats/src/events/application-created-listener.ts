import { ApplicationCreatedEvent } from './application-created-event';
import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subjects';

export class ApplicationCreatedListener extends Listener<ApplicationCreatedEvent> {
  readonly subject = Subjects.ApplicationCreated;
  queueGroupName = 'jobs-service';

  onMessage(data: ApplicationCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);
    msg.ack();
  }
}
