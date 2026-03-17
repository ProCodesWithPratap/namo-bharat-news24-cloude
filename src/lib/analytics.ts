declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function track(eventName: string, params?: Record<string, any>) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch {
    // no-op
  }
}

export function trackArticleView(slug: string, category: string, author?: string) {
  track("article_view", { article_slug: slug, article_category: category, article_author: author });
}

export function trackArticleShare(platform: "whatsapp" | "facebook" | "twitter" | "telegram", slug: string) {
  track("article_share", { share_platform: platform, article_slug: slug });
}

export function trackChatbotOpen() {
  track("chatbot_open");
}

export function trackChatbotQuery(message: string) {
  track("chatbot_query", { query_text: message.slice(0, 100) });
}

export function trackSearch(query: string) {
  track("search", { search_term: query.slice(0, 100) });
}

export function trackWhatsAppCTA(location: string) {
  track("whatsapp_cta_click", { cta_location: location });
}

export function trackNewsletterSignup(source: string) {
  track("newsletter_signup", { signup_source: source });
}

export function trackCategoryClick(category: string) {
  track("category_click", { category_name: category });
}
