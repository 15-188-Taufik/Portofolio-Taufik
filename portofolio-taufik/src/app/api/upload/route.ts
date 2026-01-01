import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Tidak ada file yang diupload' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      // Ubah file menjadi Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload ke Cloudinary menggunakan Stream
      return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'portfolio-taufik' }, // Nama folder di Cloudinary
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || '');
          }
        ).end(buffer);
      });
    });

    // Tunggu semua file selesai diupload
    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: 'Gagal upload gambar' }, { status: 500 });
  }
}