
export interface authToken {
    user: {
        name: string,
        email: string,
        image: string,
        id: string,
    },
    expires: string,
}