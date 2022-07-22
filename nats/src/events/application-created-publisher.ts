import { ApplicationCreatedEvent } from './application-created-event';
import { Publisher } from './base-publisher';
import { Subjects } from './subjects';

export class ApplicationCreatedPublisher extends Publisher<ApplicationCreatedEvent> {
  readonly subject = Subjects.ApplicationCreated;
}
