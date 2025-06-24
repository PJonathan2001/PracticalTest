import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  birthDate?: Date;
  isActive: boolean;
  activationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
}

export interface IUserModel extends mongoose.Model<IUser> {
  createDefaultUser(): Promise<void>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  birthDate: { type: Date },
  isActive: { type: Boolean, default: false },
  activationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

userSchema.statics.createDefaultUser = async function () {
  const defaultEmail = 'admin@testseneca.com';
  const exists = await this.findOne({ email: defaultEmail });
  if (!exists) {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    await this.create({
      email: defaultEmail,
      password: hash,
      firstName: 'Admin',
      lastName: 'Default',
      address: 'Avenida Siempre Viva',
      birthDate: new Date('1990-01-01'),
      isActive: true,
    });
  }
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User; 