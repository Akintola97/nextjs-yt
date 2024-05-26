import axios from 'axios';
import { NextResponse } from 'next/server';
const key = process.env.API_KEY;

export async function GET(){
    try {
        const tvResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false`)
        return NextResponse.json(tvResponse.data)
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Failed to fetch Data"}, {status: 500})
    }
}
