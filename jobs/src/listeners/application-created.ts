import { Subjects, Listener, ApplicationCreatedEvent } from '@jobsify/common';
import { Message } from 'node-nats-streaming';
import { Job } from '../models';
import { JobUpdatedPublisher } from '../publishers';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class ApplicationCreatedListener extends Listener<ApplicationCreatedEvent> {
  readonly subject = Subjects.ApplicationCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: ApplicationCreatedEvent['data'], msg: Message) {
    const { jobId } = data;
    const job = await Job.findById(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    job.set({
      applicants: job.applicants + 1,
    });

    await job.save();
    await new JobUpdatedPublisher(this.stan).publish({
      ...job.toObject(),
      version: job.version,
      id: job.id,
    });

    msg.ack();
  }
}
