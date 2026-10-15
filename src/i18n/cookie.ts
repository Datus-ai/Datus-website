import type { Locale } from "./config";

export const COOKIE_UI: Record<Locale, Record<string, string>> = {
  en: {
    title: "Your Cookies, Your Choice",
    settings: "Cookie Settings",
    policy: "Cookie Policy",
    manage: "Manage Settings",
    reject: "Reject Non-Essential",
    accept: "Accept All",
    save: "Save Choices",
    close: "Close without saving changes",
    dismiss: "Dismiss for now; analytics remains off until allowed",
    description:
      "We use necessary storage to remember your privacy choices. With your permission, Google Analytics helps us understand website usage. You can decline analytics and continue browsing.",
    intro:
      "Choose how we use cookies and local storage. Necessary uses remain available; usage analytics is optional.",
    necessary: "Necessary Uses",
    always_on: "Always On",
    necessary_description:
      "Remember your privacy choices so this website follows them on this and future visits.",
    necessary_details:
      "Your choices are saved in this browser for 180 days, together with the policy version and time of your decision.",
    basic_settings:
      "Language and theme settings can be changed or reset in the product, independently of usage analytics.",
    analytics: "Usage Analytics",
    analytics_description:
      "Allow Google Analytics to help us understand page visits and traffic sources. Disabling this does not affect browsing.",
    analytics_details:
      "Google Analytics uses cookies with a configured expiration of 180 days. It is not loaded until you allow usage analytics.",
    details: "View Uses and Retention",
    scope:
      "Applies to this browser on datus.ai. You can reopen settings in the footer at any time. Datus Studio manages its choices separately.",
    storage_error:
      "Your choice applies to this visit, but your browser could not save it for next time.",
    brand: "Datus Website",
  },
  zh: {
    title: "你的 Cookie，由你选择",
    settings: "Cookie 设置",
    policy: "Cookie 政策",
    manage: "管理设置",
    reject: "拒绝非必要",
    accept: "全部接受",
    save: "保存选择",
    close: "关闭设置，不保存更改",
    dismiss: "暂时关闭，使用分析在允许前保持关闭",
    description:
      "我们使用必要存储来保存你的隐私选择。经你允许，我们也会使用 Google Analytics 了解官网访问情况。你可以拒绝分析，继续浏览网站。",
    intro:
      "你可以决定我们如何使用 Cookie 和本地存储。必要用途始终可用，使用分析由你选择。",
    necessary: "必要用途",
    always_on: "始终启用",
    necessary_description:
      "保存你的隐私选择，确保本次和后续访问按你的选择处理。",
    necessary_details:
      "选择保存在当前浏览器中，保存 180 天，包含选择结果、政策版本和选择时间。",
    basic_settings:
      "语言和主题可在产品设置中调整或重置，不受使用分析开关影响。",
    analytics: "使用分析",
    analytics_description:
      "允许 Google Analytics 帮助我们了解页面访问和流量来源。关闭不影响你浏览官网。",
    analytics_details:
      "Google Analytics Cookie 设置为 180 天过期，仅在你允许使用分析后加载。",
    details: "查看用途与保存时间",
    scope:
      "仅对当前浏览器中的 datus.ai 生效，可随时从页脚重新调整。Datus Studio 的选择单独管理。",
    storage_error: "本次选择已生效，但浏览器未能将其保存到下次访问。",
    brand: "Datus 官网",
  },
};
