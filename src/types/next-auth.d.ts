import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    // 1. User Interface ko update karna (Database ke liye)
    interface User {
        _id?: string; // Type batana zaroori hai
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }

    // 2. Session Interface ko update karna (Frontend use ke liye)
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'] // Purane fields (email/name) ko bhi rakho
    }
}

// 3. JWT Interface (Token ke liye)
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}