import axios from 'axios';
import { NextResponse } from 'next/server';
const key = process.env.API_KEY;

export async function GET(){
    try {
        const trendingResponse = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${key}`)
        return NextResponse.json(trendingResponse.data)
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Failed to fetch Data"}, {status: 500})
    }
 
}
