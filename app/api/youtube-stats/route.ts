import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = 'AIzaSyCJXtZQT-6OI2vjNTLZhlNR5qiZcUHZq7A';
const CHANNEL_HANDLE = '@whyonlythakur';

export async function GET() {
  try {
    // First, get the channel ID from the handle
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?forHandle=${CHANNEL_HANDLE}&part=contentDetails,snippet,statistics&key=${YOUTUBE_API_KEY}`
    );
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      // Fallback: try with search for the channel
      return NextResponse.json({
        error: 'Channel not found',
        subscribers: 0,
        totalViews: 0,
        videoCount: 0
      });
    }
    
    const channel = channelData.items[0];
    const stats = channel.statistics;
    
    return NextResponse.json({
      subscribers: parseInt(stats.subscriberCount || 0),
      totalViews: parseInt(stats.viewCount || 0),
      videoCount: parseInt(stats.videoCount || 0),
      channelTitle: channel.snippet.title,
      channelId: channel.id
    });
  } catch (error) {
    console.error('YouTube API Error:', error);
    return NextResponse.json({
      error: 'Failed to fetch YouTube stats',
      subscribers: 0,
      totalViews: 0,
      videoCount: 0
    });
  }
}
