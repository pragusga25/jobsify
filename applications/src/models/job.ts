import mongoose from 'mongoose';
import { JobStatus } from '@jobsify/common';
import { Application } from './application';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

type IdVersion = {
  id: string;
  version: number;
};

interface JobAttrs {
  name: string;
  company: string;
  salary: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  description: string;
  vacancy: number;
  status: JobStatus;
  applicants?: number;
  id: string;
}

interface JobDocMongo extends mongoose.Document<string> {
  isApplied(userId: string): Promise<boolean>;
}

export type JobDoc = JobDocMongo &
  Required<JobAttrs> & {
    version: number;
  };

interface JobModel extends mongoose.Model<JobDoc> {
  build(attrs: JobAttrs): JobDoc;
  findByIdVersion(data: IdVersion): Promise<JobDoc | null>;
}

const jobSchema = new mongoose.Schema(
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
    vacancy: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(JobStatus),
      default: JobStatus.Closed,
    },
    applicants: {
      type: Number,
      default: 0,
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
    timestamps: true,
  }
);

jobSchema.set('versionKey', 'version');
jobSchema.plugin(updateIfCurrentPlugin);
jobSchema.statics.findByIdVersion = ({ id, version }: IdVersion) =>
  Job.findOne({ _id: id, version: version - 1 });
jobSchema.statics.build = ({ id, ...rest }: JobAttrs) =>
  new Job({
    _id: id,
    ...rest,
  });

jobSchema.pre('remove', function (next) {
  Application.deleteMany({ job: this._id }).exec();
  next();
});

jobSchema.methods.isApplied = async function (userId: string) {
  const existingApplication = await Application.findOne({
    job: this,
    userId,
  });

  return !!existingApplication;
};

const Job = mongoose.model<JobDoc, JobModel>('Job', jobSchema);

export { Job };
