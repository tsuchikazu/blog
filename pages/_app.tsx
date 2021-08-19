import { AppProps } from 'next/app'
import '../styles/index.css'
import 'highlight.js/styles/github.css'
import 'github-markdown-css/github-markdown.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
