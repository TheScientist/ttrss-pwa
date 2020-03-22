export interface ICategory {
    id: string;
    name: string;
    unread: number;
    bare_id: number;
    items: ICategory[];
    type: string;
}
