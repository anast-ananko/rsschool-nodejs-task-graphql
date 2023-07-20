import { IUser } from "../interfaces/user.js";
import { IProfile } from "../interfaces/profile.js";
import { IPost } from "../interfaces/post.js";

type userCreateInput = Pick<IUser, 'name' | 'balance'>;
type userChangeInput = Pick<IUser, 'name' | 'balance'>;
type profileCreateInput = Omit<IProfile, 'id'>;
type profileChangeInput = Omit<IProfile, 'id' | 'userId'>;
type postCreateInput = Omit<IPost, 'id'>;
type postChangeInput = Omit<IPost, 'id' | 'authorId'>;

export { 
  userCreateInput,
  userChangeInput,
  profileCreateInput,
  profileChangeInput,
  postCreateInput,
  postChangeInput
};
