import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
const secret = new TextEncoder().encode(process.env.SECRET);


export async function middleware(request){
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/' || path === "/register";
    const token = request.cookies.get('authToken')?.value;


    if(!token && !isPublicPath){
        return NextResponse.redirect(new URL('/', request.url))
    }
    else if(token){
        try {
            const {payload} = await jwtVerify(token, secret);
            const tokenExpiration = new Date(payload.exp * 1000);
            if(tokenExpiration <= new Date()){
                return NextResponse.redirect(new URL('/', request.url));
            }
            if(isPublicPath){
                return NextResponse.next();
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
return NextResponse.next();
}

export const config = {
    matcher:[
        '/', '/register', '/hero', '/location'
    ]
}