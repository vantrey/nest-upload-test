export class UnsubscriptionToBlogCommand {
  constructor(public readonly blogId: string, public readonly userId: string) {}
}
