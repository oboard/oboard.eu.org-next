export interface FeedItemInfo {
  id: string
  url: string
  title: string
  image: string
  summary: string
  content_html: string
  date_published: string
  tags: string[]
  author: string
}

export interface FeedBodyInfo {
  version: string
  title: string
  description: string
  icon: string
  home_page_url: string
  feed_url: string
  items: FeedItemInfo[]
} 