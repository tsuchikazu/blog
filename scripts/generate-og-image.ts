import { getAllPosts } from '../lib/api'
const catchy = require('catchy-image')

const options = {
  output: {
    directory: 'public/og-images',
    fileName: '',
  },
  image: {
    width: 1200,
    height: 630,
    backgroundColor: '#222639',
    // backgroundImage: require.resolve('./images/background.jpg'),
  },
  style: {
    title: {
      fontFamily: 'Noto Sans CJK JP',
      fontColor: '#bb99ff',
      fontWeight: 'bold',
      fontSize: 64,
      paddingTop: 100,
      paddingBottom: 200,
      paddingLeft: 150,
      paddingRight: 150,
    },
    author: {
      fontFamily: 'Noto Sans CJK JP',
      fontColor: '#f0f5fa',
      fontWeight: '400',
      fontSize: 42,
    },
  },
  meta: {
    title: '',
    author: 'tsuchikazu.net',
  },
  fontFile: [
    {
      path: require.resolve('./fonts/NotoSansJP-Bold.otf'),
      family: 'Noto Sans CJK JP',
      weight: 'bold',
    },
    {
      path: require.resolve('./fonts/NotoSansJP-Regular.otf'),
      family: 'Noto Sans CJK JP',
      weight: '400',
    },
  ],
  iconFile: require.resolve('./images/avatar.png'),
  timeout: 10000,
}

async function generate(fontSize: number): Promise<any> {
  if (fontSize == 0) {
    throw new Error(`${options.output.fileName} image is not generated`)
  }
  options.style.title.fontSize = fontSize
  try {
    return await catchy.generate(options)
  } catch (e) {
    return generate(fontSize - 1)
  }
}

async function main() {
  const allPosts = getAllPosts([
    'slug',
    'title',
  ])
  for (const post of allPosts) {
    options.output.fileName = `${post.slug}.png`
    options.meta.title = post.title
    const fontSize = 64

    const output = await generate(fontSize);
    console.log(`Successfully generated: ${output}`)
  }
}
main()
