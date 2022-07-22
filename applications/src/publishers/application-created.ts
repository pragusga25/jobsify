import { Publisher, Subjects, ApplicationCreatedEvent } from '@jobsify/common';

export class ApplicationCreatedPublisher extends Publisher<ApplicationCreatedEvent> {
  readonly subject = Subjects.ApplicationCreated;
}
