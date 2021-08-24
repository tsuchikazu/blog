import remark from 'remark'
import strip from 'strip-markdown'

export default async function stripMarkdown(markdown: string) {
  const result = await remark().use(strip).process(markdown)
  return result.toString()
}
