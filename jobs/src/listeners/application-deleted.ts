import { Subjects, Listener, ApplicationDeletedEvent } from '@jobsify/common';
import { Message } from 'node-nats-streaming';
import { Job } from '../models';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class ApplicationDeletedListener extends Listener<ApplicationDeletedEvent> {
  readonly subject = Subjects.ApplicationDeleted;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: ApplicationDeletedEvent['data'], msg: Message) {
    const { jobId } = data;
    Job.findByIdAndUpdate(jobId, {
      $inc: {
        applicants: -1,
      },
    }).exec((err) => {
      if (!err) return msg.ack();
    });
  }
}
