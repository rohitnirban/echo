import axios from 'axios';
import dbConnect from '@/lib/dbConnect';
import TrendingModel from '@/models/Trending';

export async function GET(
    request: Request,
    { params }: { params: { region: string } }
) {
    await dbConnect();

    const region = params.region || 'global';  // Use 'global' as default if region is not provided

    try {
        const todayStart = new Date(new Date().toISOString().split('T')[0]);
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        // Check if data for today and region already exists
        const existingData = await TrendingModel.findOne({
            date: {
                $gte: todayStart,
                $lt: todayEnd
            },
            region: region
        });

        if (existingData) {
            return new Response(JSON.stringify({
                success: true,
                titles: existingData.titles
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            const regionCode = region === 'india' ? 'IN' : ''; // Add more regions as needed

            const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    part: 'snippet',
                    chart: 'mostPopular',
                    regionCode: regionCode,
                    videoCategoryId: '10',
                    maxResults: 30,
                    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
                }
            });

            if (response.status !== 200) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Failed to fetch data from YouTube API'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            const titles = response.data.items.map((item: any) => item.snippet.title.split('|')[0]);

            const trendingData = new TrendingModel({
                titles: titles,
                date: todayStart,
                region: region
            });

            try {
                await trendingData.save();
                console.log('Data saved successfully.');
            } catch (saveError) {
                console.error('Error saving data:', saveError);
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Error saving data'
                }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            return new Response(JSON.stringify({
                success: true,
                titles: titles
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);

        return new Response(JSON.stringify({
            success: false,
            message: 'Error fetching data'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
