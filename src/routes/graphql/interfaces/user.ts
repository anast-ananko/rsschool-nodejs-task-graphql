import { IProfile } from "./profile.js";
import { IPost } from "./post.js";

export interface IUser {
  id: string;
  name: string;
  balance: number;
  profile: IProfile;
  posts: IPost;
  userSubscribedTo: IUser[];
  subscribedToUser: IUser[];
}