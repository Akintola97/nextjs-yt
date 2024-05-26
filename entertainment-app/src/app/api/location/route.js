import axios from "axios";
import { NextResponse } from "next/server";
const map_api = process.env.MAP_API;

export async function POST(request) {
  try {
    const { latitude, longitude, zipCode } = await request.json();

    let lat = latitude;
    let lng = longitude;

    if (zipCode) {
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${map_api}`
      );

      if (geocodeResponse.data.results.length === 0) {
        return NextResponse.json(
          { error: "Invalid Zip Code" },
          { status: 400 }
        );
      }
      const location = geocodeResponse.data.results[0].geometry.location;
      lat = location.lat;
      lng = location.lng;
    }

    //Fetch Movie Theatres
    const searchResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=movie_theatre&keyword=movies&key=${map_api}`
    );
    const facilities = searchResponse.data.results;

    const responseData = facilities.map((facility) => ({
      name: facility.name,
      rating: facility.rating,
      available: facility.opening_hours,
    }));
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}