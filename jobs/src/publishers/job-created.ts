import { Publisher, Subjects, JobCreatedEvent } from '@jobsify/common';

export class JobCreatedPublisher extends Publisher<JobCreatedEvent> {
  readonly subject = Subjects.JobCreated;
}
