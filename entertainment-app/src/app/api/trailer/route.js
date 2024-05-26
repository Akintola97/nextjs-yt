import axios from 'axios';
import { NextResponse } from 'next/server';
const key = process.env.API_KEY;

export async function POST(request){
    try {
        const {media_type, id} = await request.json();
        const response = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${key}&language=en-US`)
        const data = response.data;
        const trailer = data.results.find((video)=> video.type === 'Trailer' && video.site=== "YouTube");
        const trailerKey = trailer ? trailer.key : null;
        return NextResponse.json({trailerKey}, {status: 200})
    } catch (error) {
        console.error("Failed to find trailer:", error)
        return NextResponse.json({error: "Failed to fetch trailer"}, {status: 500})
    }
}