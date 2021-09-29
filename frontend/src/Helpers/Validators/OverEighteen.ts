import { AbstractControl } from '@angular/forms';

export function ValidateDob(control: AbstractControl) {
    var today = new Date();
    let dob = control.value;

    if (dob.length <= 0) {
        return null;
    }

    var diffMilliSeconds = today.getTime() - dob.getTime();
    var diffYears = diffMilliSeconds / 31557600000;
    if (diffYears < 18) {
        return { overEighteen: true };
    }
    return null;
}
