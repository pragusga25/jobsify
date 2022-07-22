import { Publisher, Subjects, ApplicationDeletedEvent } from '@jobsify/common';

export class ApplicationDeletedPublisher extends Publisher<ApplicationDeletedEvent> {
  readonly subject = Subjects.ApplicationDeleted;
}
