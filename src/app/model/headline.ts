interface Headline {
  id: number;
  unread: boolean;
  marked: boolean;
  published: boolean;
  title: string;
  link: string;
  tags: string[];
  labels: string[];
  author: string;
  note: string;
  lang: string;
  feed_id: number;
  feed_title: string;
  content: string;
  updated: number;
}