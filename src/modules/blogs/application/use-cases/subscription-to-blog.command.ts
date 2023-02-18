export class SubscriptionToBlogCommand {
  constructor(public readonly blogId: string, public readonly userId: string) {}
}
