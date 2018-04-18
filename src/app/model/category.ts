export class Category {
    id: number;
    title: string;
    unread: number;
    order_id: number;

    constructor(orig: ICategory) {
        this.id = +orig.id;
        this.title = orig.title;
        // Special feeds first.
        if (this.id === -1) {
            this.order_id = -1;
        } else {
            this.order_id = orig.order_id;
        }
        this.unread = orig.unread;
    }
}
