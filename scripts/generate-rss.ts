import { getAllPosts } from '../lib/api'
import RSS from 'rss'
import * as fs from 'fs'
import stripMarkdown from '../lib/stripMarkdown'

async function main() {
  const feed = new RSS({
    title: 'tsuchikazu blog',
    site_url: 'https://tsuchikazu.net',
    feed_url: 'https://tsuchikazu.net/feed.xml'
  })

  await Promise.all(
    getAllPosts([
      'slug',
      'title',
      'date',
      'content',
      'categories',
    ]).map(async (post) => {
      const content = await stripMarkdown(post.content || '')
      feed.item({
        title: post.title,
        url: `https://tsuchikazu.net/${post.slug}`,
        date: post.date,
        description: content.substring(0, 200),
        // @ts-ignore
        categories: post.categories,
      })
    })
  )

  fs.writeFileSync('./public/feed.xml', feed.xml({ indent: true }))
}

main()
