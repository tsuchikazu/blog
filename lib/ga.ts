export const pageview = (url: string) => {
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string, {
    page_path: url,
  })
}
