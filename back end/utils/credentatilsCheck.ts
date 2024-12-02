function isEmailValid(email: string): boolean {
     const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return emailRegex.test(email);
   }
  
  function checkPasswordStrength(password: string): string {
    const conditions = {
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasDigit: /\d/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?`~]/.test(password),
      minimumLength: password.length >= 8,
    };
  
    const unmetConditions = [];
  
    for (const [condition, value] of Object.entries(conditions)) {
      if (!value) {
        unmetConditions.push(condition.replace(/([A-Z])/g, ' $1' ));
      }
    }
  
    return unmetConditions.length === 0 ? 'Strong password!' : `Password is weak: Missing ${unmetConditions.join(', ')}`;
  }
  function generateRandomPassword(length: number = 12): string {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    // Combine all characters
    const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;

    let password = '';
    
    // Ensure the password contains at least one of each character type
    password += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    password += lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Fill the rest of the password length with random characters from allChars
    for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password to ensure randomness
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Example usage
const randomPassword = generateRandomPassword(16);
console.log(randomPassword);

  
export {isEmailValid,checkPasswordStrength,generateRandomPassword}
   