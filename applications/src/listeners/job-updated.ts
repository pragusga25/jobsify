import { Subjects, Listener, JobUpdatedEvent } from '@jobsify/common';
import { Message } from 'node-nats-streaming';
import { Job } from '../models';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class JobUpdatedListener extends Listener<JobUpdatedEvent> {
  readonly subject = Subjects.JobUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: JobUpdatedEvent['data'], msg: Message) {
    const { id, version, ...rest } = data;
    const job = await Job.findOne({
      _id: id,
      version: version - 1,
    });

    if (!job) throw new Error('Job not found');

    job.set(rest);
    await job.save();
    msg.ack();
  }
}
