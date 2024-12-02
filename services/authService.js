// src/services/authService.js

// Sign in with the magic link
export const signInWithEmailLink = async () => {
    const email = window.localStorage.getItem('emailForSignIn');
    if (email && firebase.auth().isSignInWithEmailLink(window.location.href)) {
      try {
        await firebase.auth().signInWithEmailLink(email, window.location.href);
        window.localStorage.removeItem('emailForSignIn'); // Clear stored email after sign-in
        return true;
      } catch (error) {
        console.error('Error signing in with magic link:', error.message);
        throw new Error(error.message);
      }
    }
    return false;
  };
  