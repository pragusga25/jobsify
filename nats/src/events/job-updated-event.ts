import { Subjects } from './subjects';

export interface JobUpdatedEvent {
  subject: Subjects.JobUpdated;
  data: {
    id: string;
    name?: string;
    description?: string;
    salary?: string;
    requirements?: string;
    responsibilities?: string[];
    location?: string;
    company?: string;
    vacancy?: number;
    status?: 'open' | 'closed';
    applicants?: number;
  };
}
