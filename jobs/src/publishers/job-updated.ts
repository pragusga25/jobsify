import { Publisher, Subjects, JobUpdatedEvent } from '@jobsify/common';

export class JobUpdatedPublisher extends Publisher<JobUpdatedEvent> {
  readonly subject = Subjects.JobUpdated;
}
