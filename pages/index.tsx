import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Post from '../types/post'
import { useRouter } from 'next/router'
import PostPreview from 'components/post-preview'
import Link from 'next/link'
import stripMarkdown from 'lib/stripMarkdown'
import { HOME_OG_IMAGE_URL } from '../lib/constants'

type Props = {
  allPosts: Post[]
}
const PER_PAGE = 10

const Index = ({ allPosts }: Props) => {
  const router = useRouter()
  let page = Number(router.query.page)
  if (!page) {
    page = 1
  }

  const heroPost = allPosts[0]
  const pagingPosts = allPosts.slice(1)
  const posts = pagingPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <Layout>
        <Head>
          <title>tsuchikazu blog</title>
          <meta property="og:image" content={HOME_OG_IMAGE_URL} />
        </Head>
        <Container>
          <Intro />
          {page == 1 &&
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt || heroPost.content.substring(0, 200)}
            />
          }
          <MoreStories posts={posts} />
          <div className="flex justify-end m-5">
            <Link href={`/?page=${page + 1}`}>
              <a className="hover:underline">次のページ</a>
            </Link>
          </div>
        </Container>
      </Layout>
    </>
  )
}

export default Index

export const getStaticProps = async () => {
  const allPosts = await Promise.all(
    getAllPosts([
      'title',
      'date',
      'slug',
      'coverImage',
      'excerpt',
      'content',
    ]).map(async post => {
      const content = await stripMarkdown(post.content || '')
      return {
        ...post,
        content
      }
    })
  )

  return {
    props: { allPosts },
  }
}
