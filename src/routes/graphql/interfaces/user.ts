interface ISubscription {
  subscriberId: string;
  authorId: string;
}

export interface IUser {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo: ISubscription[];
  subscribedToUser: ISubscription[];
}
