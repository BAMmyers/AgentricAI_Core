/**
 * @file Data.ts
 * Data structures and state management for the Recursive Web Crawler agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a crawled page
export interface CrawledPage {
  url: string;
  title: string;
  content: string;
  links: string[];
}

// Example: The state for the crawler
export interface CrawlerState {
  crawledPages: CrawledPage[];
  status: 'idle' | 'crawling' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): CrawlerState {
  return {
    crawledPages: [],
    status: 'idle',
  };
}
