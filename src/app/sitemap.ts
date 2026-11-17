import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

const BASE_URL = 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/` },
    { url: `${BASE_URL}/books` },
  ];

  const bookUrls: MetadataRoute.Sitemap = db.books.map((book) => ({
    url: `${BASE_URL}/books/${book.id}`,
  }));

  return [...staticUrls, ...bookUrls];
}
