import { ApplicationCreatedEvent } from './application-created-event';
import { Subjects } from './subjects';

export interface ApplicationDeletedEvent
  extends Omit<ApplicationCreatedEvent, 'subject'> {
  subject: Subjects.ApplicationDeleted;
}
