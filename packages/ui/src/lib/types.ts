export interface session {
    data: {
        expires: string;
        user: {
            id: string
            email: string;
            image?: string;
            name: string;
        };
    };
    status: authStatus
}
enum authStatus {
    "unauthenticated", 
    "loading", 
    "authenticated"
}