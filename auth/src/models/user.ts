import mongoose from 'mongoose';
import { Password } from '../services';

/* An interface that describes the required 
attributes to create a new User */
interface UserAttrs {
  username: string;
  password: string;
}

/* An interface that describes 
the properties that a User has */
interface UserModel extends mongoose.Model<UserDoc> {
  build: (attrs: UserAttrs) => UserDoc;
}

/* An interface that describes the properties 
that are required to create a new User */
interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
  id: string;
  role: string;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.hash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

const buildUser = (attrs: UserAttrs) => new User(attrs);
userSchema.statics.build = buildUser;

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
