export class CriterionDeletedEvent {
    static readonly eventName = 'criterion.deleted';

    constructor(public readonly criterionId: number) { }
}