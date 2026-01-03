import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}

// Sign up function
export const signUp = async (email: string, password: string, firstName: string, lastName: string, role: string): Promise<UserData> => {
  try {
    // Validate college domain
    const collegeDomain = "sathyabama.ac.in";
    if (!email.endsWith(`@${collegeDomain}`)) {
      throw new Error(`Please use your ${collegeDomain} email address`);
    }

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore with minimal data first
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      firstName,
      lastName,
      role,
      createdAt: new Date()
    };

    // Use setDoc with merge: false for faster write
    await setDoc(doc(db, 'users', user.uid), userData, { merge: false });

    return userData;
  } catch (error: any) {
    console.error('Sign up error:', error);
    // Provide more specific error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please sign in instead.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use at least 8 characters.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    }
    throw new Error(error.message || 'Failed to create account. Please try again.');
  }
};

// Sign in function
export const signIn = async (email: string, password: string): Promise<UserData> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found. Please contact support.');
    }

    return userDoc.data() as UserData;
  } catch (error: any) {
    console.error('Sign in error:', error);
    // Provide more specific error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email. Please sign up first.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later.');
    }
    throw new Error(error.message || 'Failed to sign in. Please try again.');
  }
};

// Sign out function
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Password reset function
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Google OAuth sign in function
export const signInWithGoogle = async (): Promise<UserData> => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Add college domain scope to ensure we get the right email
    provider.addScope('email');
    provider.addScope('profile');
    
    // Force account selection to prevent cached email issues
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user has college domain email
    const collegeDomain = "sathyabama.ac.in";
    if (!user.email?.endsWith(`@${collegeDomain}`)) {
      // Sign out the user if they don't have college email
      await signOut(auth);
      throw new Error(`Please use your ${collegeDomain} email address for Google sign-in. You used: ${user.email}`);
    }

    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        role: 'faculty', // Default role for Google sign-in
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } else {
      // Return existing user data
      return userDoc.data() as UserData;
    }
  } catch (error: any) {
    console.error('Google sign in error:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with this email using a different sign-in method.');
    }
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

// GitHub OAuth sign in function
export const signInWithGitHub = async (): Promise<UserData> => {
  try {
    const provider = new GithubAuthProvider();
    
    // Add scopes for GitHub
    provider.addScope('user:email');
    provider.addScope('read:user');
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user has college domain email
    const collegeDomain = "sathyabama.ac.in";
    if (!user.email?.endsWith(`@${collegeDomain}`)) {
      // Sign out the user if they don't have college email
      await signOut(auth);
      throw new Error(`Please use your ${collegeDomain} email address for GitHub sign-in. You used: ${user.email}`);
    }

    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        role: 'faculty', // Default role for GitHub sign-in
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } else {
      // Return existing user data
      return userDoc.data() as UserData;
    }
  } catch (error: any) {
    console.error('GitHub sign in error:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with this email using a different sign-in method.');
    }
    throw new Error(error.message || 'Failed to sign in with GitHub');
  }
};

// Clear Google authentication cache
export const clearGoogleAuthCache = async (): Promise<void> => {
  try {
    // Sign out from Firebase
    await signOut(auth);
    
    // Clear any cached Google authentication
    // This forces Google to show account selection again
    console.log('Cleared Google authentication cache');
  } catch (error) {
    console.error('Error clearing auth cache:', error);
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: UserData | null) => void) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as UserData);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
