import mongoose from 'mongoose';
import { ApplicationStatus } from '@jobsify/common';
import { JobDoc } from './job';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ApplicationAttrs {
  userId: string;
  status?: ApplicationStatus;
  job: JobDoc;
}

interface ApplicationDoc extends mongoose.Document<string> {
  userId: string;
  status: ApplicationStatus;
  job: JobDoc;
  version: number;
}

interface ApplicationModel extends mongoose.Model<ApplicationDoc> {
  build(attrs: ApplicationAttrs): ApplicationDoc;
}

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.Pending,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

applicationSchema.set('versionKey', 'version');
applicationSchema.plugin(updateIfCurrentPlugin);
applicationSchema.statics.build = (attrs: ApplicationAttrs) =>
  new Application(attrs);

const Application = mongoose.model<ApplicationDoc, ApplicationModel>(
  'Application',
  applicationSchema
);

export { Application };
