import { getAllContent, CONTENT_TYPES } from '@/lib/content'
import type { ContentItem, Language } from '@/lib/content'

export interface ContentItemWithType extends ContentItem {
  contentType: string
}

/**
 * 获取最新文章（服务器端）
 * @param locale 语言
 * @param max 最大数量
 * @returns 排序后的文章列表
 */
export async function getLatestArticles(
  locale: Language,
  max: number = 30
): Promise<ContentItemWithType[]> {
  // 获取所有内容类型的文章
  const allArticles: ContentItemWithType[] = []

  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale)
    allArticles.push(...items.map(item => ({ ...item, contentType })))
  }

  // 预分配排序 key：更新时间 + slug（确定性，禁止随机抽取）
  const articlesWithMeta = allArticles.map(article => ({
    article,
    updateTime: article.frontmatter.lastModified
      ? new Date(article.frontmatter.lastModified).getTime()
      : (article.frontmatter.date ? new Date(article.frontmatter.date).getTime() : 0),
  }))

  // 排序：更新时间降序，同时间按 slug 字母序（确定性）
  articlesWithMeta.sort((a, b) => {
    if (a.updateTime !== b.updateTime) return b.updateTime - a.updateTime
    return a.article.slug.localeCompare(b.article.slug)
  })

  return articlesWithMeta.slice(0, max).map(x => x.article)
}
