export class UpdateCounterEvent {
    feed_id: number;
    count: number;
    target_feed: number;
    isCat: boolean;

    constructor(feed_id: number,
        count: number,
        target_feed: number,
        isCat: boolean) {
        this.feed_id = feed_id;
        this.count = count;
        this.target_feed = target_feed;
        this.isCat = isCat;
    }
}
