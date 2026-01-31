import { Resend } from 'resend';

// Yeh line .env file se aapki API key uthayegi
console.log("DEBUG: My API Key is ->", process.env.RESEND_API_KEY);
export const resend = new Resend( process.env.RESEND_API_KEY);