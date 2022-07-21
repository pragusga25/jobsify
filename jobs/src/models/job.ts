import { Document, Model, Schema, model } from 'mongoose';

interface JobAttrs {
  name: string;
  company: string;
  salary?: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  description: string;
}

type JobDoc = Document<string> & Required<JobAttrs>;

interface JobModel extends Model<JobDoc> {
  build(attrs: JobAttrs): JobDoc;
}

const jobSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      default: 'disclosed',
    },
    requirements: {
      type: [String],
      required: true,
    },
    responsibilities: {
      type: [String],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

jobSchema.statics.build = (attrs: JobAttrs) => new Job(attrs);

const Job = model<JobDoc, JobModel>('Job', jobSchema);

export { Job };
