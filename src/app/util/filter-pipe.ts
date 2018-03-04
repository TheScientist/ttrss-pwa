import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'feedFilter',
    pure: false
})
export class FeedFilterPipe implements PipeTransform {
    transform(items: Feed[], catid: number): Feed[] {
        if (!items) {
            return items;
        }
        if (catid === -1) {
            // special feeds sort like in web client
            return items
                .filter(feed => feed.cat_id === catid)
                .sort((a, b) => {
                    switch (a.id) {
                        case -1:
                            if (b.id === -3 || b.id === -4) return 1;
                            else return -1;
                        case -2:
                            if (b.id === -6 || b.id === 0) return -1;
                            else return 1;
                        case -3:
                            if (b.id === -4) return 1;
                            else return -1;
                        case -4:
                            return -1;
                        case 0:
                            if (b.id === -6) return 1;
                            else return -1;
                        case -6:
                            return 1;
                        default: return a.id - b.id;
                    }
                });
        } else {
            return items
                .filter(feed => feed.cat_id === catid)
                .sort((a, b) => a.order_id - b.order_id);
        }
    }
}