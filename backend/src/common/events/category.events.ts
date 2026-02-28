export class CategoryDeletedEvent {
    static readonly eventName = 'category.deleted';

    constructor(public readonly categoryId: number) { }
}