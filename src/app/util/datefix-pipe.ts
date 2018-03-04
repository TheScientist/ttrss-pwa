import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datefix',
    pure: false
})
export class DateFixPipe implements PipeTransform {
    transform(date: number): number {
       return date * 1000;
    }
}