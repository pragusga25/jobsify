import { Subjects, Listener, JobDeletedEvent } from '@jobsify/common';
import { Message } from 'node-nats-streaming';
import { Job } from '../models';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class JobDeletedListener extends Listener<JobDeletedEvent> {
  readonly subject = Subjects.JobDeleted;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: JobDeletedEvent['data'], msg: Message) {
    const { id, version } = data;
    console.log(`Job deleted: ${version}`);
    const job = await Job.findByIdVersion({ id, version: version + 1 });
    if (!job) throw new Error('Job not found');

    await job.remove();
    msg.ack();
  }
}
