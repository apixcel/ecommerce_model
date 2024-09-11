import mongoose, { Document, Schema } from 'mongoose';

interface IUserRole extends Document {
  role_name: 'Admin' | 'Customer';

}

const userRoleSchema: Schema<IUserRole> = new Schema({
  role_name: { type: String, required: true, enum: ['Admin', 'Customer'] }
}, {
  timestamps: true 
});

const UserRole = mongoose.model<IUserRole>('UserRole', userRoleSchema);

export default UserRole;
