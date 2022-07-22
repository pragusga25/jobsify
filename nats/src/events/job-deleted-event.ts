import { Subjects } from './subjects';

export interface JobDeletedEvent {
  subject: Subjects.JobDeleted;
  data: {
    id: string;
  };
}
