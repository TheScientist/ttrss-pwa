import { Pipe, PipeTransform } from '@angular/core';
import { CounterResult } from '../model/counter-result';

@Pipe({
    name: 'counterFilter',
    pure: false
})
export class CounterFilterPipe implements PipeTransform {
    transform(items: CounterResult[], feedid: number, iscat: boolean): string {
        if (!items) {
            return "";
        }
        let ctResult = null;
        if (iscat) {
            ctResult = items.find(cntResult => cntResult.id == feedid + "" && cntResult.kind === "cat");
        } else {
            ctResult = items.find(cntResult => cntResult.id == feedid + "");
        }
        if (ctResult == null) {
            return "";
        }
        if (feedid <= 0 && feedid > -3) {
            let counter: number = ctResult.auxcounter;

            if (!counter || counter === 0) {
                return "";
            } else {
                return counter + "";
            }
        } else {
            let counter: number = ctResult.counter;
            if (!counter || counter === 0) {
                return "";
            } else {
                return counter + "";
            }
        }
    }
}