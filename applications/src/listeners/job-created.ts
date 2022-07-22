import { Subjects, Listener, JobCreatedEvent } from '@jobsify/common';
import { Message } from 'node-nats-streaming';
import { Job } from '../models';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class JobCreatedListener extends Listener<JobCreatedEvent> {
  readonly subject = Subjects.JobCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: JobCreatedEvent['data'], msg: Message) {
    await Job.build(data).save();
    msg.ack();
  }
}
