import { NextResponse } from 'next/server';

export function middleware(request: Request) {

const url = new URL(request.url);
const origin = url.origin;
const pathname = url.pathname;
const requestHeaders = new Headers(request.headers);
requestHeaders.set('x-params', url.searchParams.get("load") || "false");
requestHeaders.set('x-origin', origin);
requestHeaders.set('x-pathname', pathname);

return NextResponse.next({
    request: {
        headers: requestHeaders,
    }
});
}