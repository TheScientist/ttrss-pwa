import { keyframes, style } from '@angular/animations';

export const slideInOutLeft  = [
    style({transform: 'translate3d(-100%, 0, 0)', offset: 1, opacity: 0}),
    style({transform: 'translate3d(0, 0, 0)', offset: 0, opacity: 1}),
    style({transform: 'translate3d(-100%, 0, 0)', opacity: 0, offset: 1}),
];
