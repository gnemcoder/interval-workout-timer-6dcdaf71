
/**
 * Password utility functions for validation and breach checking
 */

// Checks if a password has been compromised using the Have I Been Pwned API
export async function checkPasswordBreached(password: string): Promise<{
  isBreached: boolean;
  count?: number;
  error?: string;
}> {
  try {
    // Generate SHA-1 hash of the password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    
    // Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Get prefix (first 5 chars) and suffix of the hash
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    // Query API with only the prefix for k-anonymity
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    
    if (!response.ok) {
      return { isBreached: false, error: "Failed to check password security." };
    }
    
    const text = await response.text();
    const hashes = text.split('\n');
    
    // Check if our suffix is in the returned list
    for (const hash of hashes) {
      const [returnedSuffix, count] = hash.split(':');
      if (returnedSuffix.trim() === suffix) {
        return { isBreached: true, count: parseInt(count.trim(), 10) };
      }
    }
    
    return { isBreached: false };
  } catch (error) {
    console.error("Error checking password breach:", error);
    return { isBreached: false, error: "Error checking password security." };
  }
}

// Validates password strength
export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  feedback: string[];
} {
  const feedback: string[] = [];
  
  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push("Password should include at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push("Password should include at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push("Password should include at least one number");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push("Password should include at least one special character");
  }
  
  return {
    isStrong: feedback.length === 0,
    feedback
  };
}
