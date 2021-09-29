import { FormGroup, FormControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class PasswordValidation {
    
    // This makes sure that the password and confirm password match in registration
    static MatchPassword(FG: FormGroup) {
        let password = FG.controls.password1.value;
        let confirmPassword = FG.controls.password2.value;
        if (confirmPassword.length <= 0) {
            return null;
        } 
        if (password !== confirmPassword) {
            return { doesMatchPassword: true };
        }

        return null;
    }

}