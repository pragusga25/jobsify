import { Publisher, Subjects, JobDeletedEvent } from '@jobsify/common';

export class JobDeletedPublisher extends Publisher<JobDeletedEvent> {
  readonly subject = Subjects.JobDeleted;
}
