export interface token {
    data: {
        user: {
            name: string,
            email: string,
            image: string,
            id: string
        }, expires: string
    }, status: string
}
export interface Servertoken {
    user: {
        name: string,
        email: string,
        image: string,
        id: string
    }, expires: string
}
