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
    dismiss: "Dismiss for now; limited cookieless measurement continues",
    description:
      "We use necessary storage to remember your choices. Before you choose, Google Analytics sends limited measurements without analytics cookies. Accept All enables regular analytics; Reject Non-Essential stops subsequent analytics.",
    intro:
      "Necessary uses remain available. Before you choose, Google Analytics sends limited measurements without analytics cookies. Enable usage analytics for regular statistics, or leave it off and save to stop analytics.",
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
      "Enable Google Analytics cookies to understand visits and traffic sources. Rejecting analytics stops subsequent analytics and does not affect browsing.",
    analytics_details:
      "Before a choice, GA sends limited measurements to Google without reading or writing analytics cookies. This is not anonymous or zero collection. Accepted analytics cookies use a 180-day expiration.",
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
    dismiss: "暂时关闭，有限的无分析 Cookie 测量继续运行",
    description:
      "我们使用必要存储来保存你的选择。作出选择前，Google Analytics 会发送不使用分析 Cookie 的有限测量。「全部接受」开启常规分析；「拒绝非必要」停止后续分析。",
    intro:
      "必要用途始终可用。作出选择前，Google Analytics 会发送不使用分析 Cookie 的有限测量。开启使用分析可启用常规统计；保持关闭并保存可停止分析。",
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
      "开启 Google Analytics Cookie，帮助我们了解页面访问和流量来源。拒绝后停止后续分析，不影响浏览官网。",
    analytics_details:
      "作出选择前，GA 会在不读写分析 Cookie 的情况下向 Google 发送有限测量，不代表匿名或零采集。接受后的分析 Cookie 配置为 180 天过期。",
    details: "查看用途与保存时间",
    scope:
      "仅对当前浏览器中的 datus.ai 生效，可随时从页脚重新调整。Datus Studio 的选择单独管理。",
    storage_error: "本次选择已生效，但浏览器未能将其保存到下次访问。",
    brand: "Datus 官网",
  },
};
