import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    console.log('=== TEST IMAGE UPLOAD ===');
    console.log('FormData received:', formData);
    
    // Check all form fields
    const title = formData.get('title');
    const content = formData.get('content');
    const images = formData.getAll('images');
    
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Images count:', images.length);
    
    // Log each image
    images.forEach((image, index) => {
      if (image instanceof File) {
        console.log(`Image ${index}:`, {
          name: image.name,
          size: image.size,
          type: image.type,
          lastModified: image.lastModified
        });
      } else {
        console.log(`Image ${index} (not File):`, image);
      }
    });
    
    // Check environment variables
    console.log('Environment variables:');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET');
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');
    console.log('CLOUDINARY_UPLOAD_PRESET:', process.env.CLOUDINARY_UPLOAD_PRESET ? 'SET' : 'NOT SET');
    
    return NextResponse.json({
      success: true,
      message: 'Test completed',
      data: {
        title,
        content,
        imagesCount: images.length,
        imageDetails: images.map((img, i) => {
          if (img instanceof File) {
            return {
              index: i,
              name: img.name,
              size: img.size,
              type: img.type
            };
          }
          return { index: i, type: typeof img };
        })
      }
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
