import HomeClient from '@/components/HomeClient';
import type { FeedBodyInfo } from '@/models/feed';

const BLOG_FEED_URL = 'https://blog.oboard.fun/feed.json';

async function getBlogFeed(): Promise<FeedBodyInfo | null> {
  try {
    const response = await fetch(BLOG_FEED_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Blog feed request failed: ${response.status}`);
      return null;
    }

    return (await response.json()) as FeedBodyInfo;
  } catch (error) {
    console.error('Blog feed request failed:', error);
    return null;
  }
}

export default async function Home() {
  const blog = await getBlogFeed();

  return <HomeClient blog={blog} />;
}
