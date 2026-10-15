import type { Locale } from "../../../i18n/config";
interface ICookiePolicy {
  title: string;
  lead: string;
  updated: string;
  scope: string;
  sections: { title: string; paragraphs: string[] }[];
  inventoryTitle: string;
  headers: string[];
  rows: string[][];
  settings: string;
  contact: string;
  googleLabel: string;
}
export const cookiePolicy: Record<Locale, ICookiePolicy> = {
  en: {
    title: "Cookie & Local Storage Policy",
    lead: "What Datus stores in your browser, why we use it, and how you can choose.",
    updated: "Last updated: October 15, 2026",
    scope:
      "Applies to datus.ai and Datus Studio. Choices are managed separately on each site and browser.",
    sections: [
      {
        title: "Cookies and Similar Technologies",
        paragraphs: [
          "Cookies are small text files saved by your browser. We also use localStorage and sessionStorage to keep information on your device. This policy covers these technologies by purpose, including necessary uses and optional usage analytics.",
        ],
      },
      {
        title: "Necessary Uses",
        paragraphs: [
          "These support sign-in, identity verification, session security, and your privacy choices. We also remember basic settings you actively select, such as language and theme, solely to provide the corresponding functionality. These settings are independent of analytics and can be changed or reset in the product.",
          "Necessary uses do not have an analytics switch. You may clear or block browser storage, but clearing sign-in cookies can sign you out or prevent authentication. Declining analytics does not stop you from signing in or using core features.",
        ],
      },
      {
        title: "Usage Analytics — Your Choice",
        paragraphs: [
          "With your permission, the website uses Google Analytics to understand visits and traffic sources. Datus Studio uses Google Analytics and first-party usage events to understand page and feature usage. The analytics code and identifiers are not activated before you allow them.",
          "Usage events may include a browser identifier, a tab identifier, page paths, referrers, event times, browser information, and interactions with features. Studio events may also be associated with your signed-in account or project; a randomly generated identifier does not make all associated information anonymous.",
          "Our analytics configuration disables advertising storage, Google signals, and advertising personalization. We do not provide an advertising category in these settings. Necessary security and operational records are assessed separately from optional product analytics.",
        ],
      },
      {
        title: "Manage or Withdraw Your Choice",
        paragraphs: [
          "Choose Reject Non-Essential, Accept All, or manage Usage Analytics in Cookie Settings. Analytics stays off until you allow it. Closing the prompt or settings without saving does not grant permission. Reopen Cookie Settings from the website footer, Studio sign-in page, or Studio settings.",
          "Your choice is saved for 180 days in this browser, on the site where you make it. The website and Studio do not automatically share consent. You can change or withdraw your choice at any time. Withdrawal stops subsequent analytics collection and removes accessible analytics cookies, identifiers, and pending usage event queues. An already-running analytics page may reload to apply the change. This does not automatically erase records already received by servers.",
          "If storage is blocked, your choice applies to the current visit but may not be remembered. New purposes or material policy changes may require a new choice.",
        ],
      },
      {
        title: "Third Parties and Private Deployments",
        paragraphs: [
          "Google Analytics is provided by Google. Google sign-in and enterprise SSO also involve identity providers when those functions are used, and the providers apply their own policies. Private deployments have different configurations: public Google Analytics is disabled, and operators should provide notices appropriate to their deployment.",
        ],
      },
      {
        title: "Contact and Other Information",
        paragraphs: [
          "This policy concerns cookies and browser storage. It does not replace information about other personal data processed by the service, such as account or conversation records. Contact contact@datus.ai with questions about browser storage or your choices.",
        ],
      },
    ],
    inventoryTitle: "Cookies and Browser Storage",
    headers: ["Item / Provider", "Purpose and Scope", "Retention"],
    rows: [
      [
        "_datus_session · Datus",
        "Studio sign-in session. The cookie name and duration can be configured by the deployment.",
        "7 days by default",
      ],
      [
        "datus_oidc_txn / datus_dm_redirect · Datus",
        "Temporary Studio SSO transaction or return path, when the corresponding provider is enabled.",
        "Up to 10 minutes; cleared on callback",
      ],
      [
        "datus_lang · Datus",
        "Studio language selected for the interface. Theme and other requested interface settings also use local storage.",
        "Language cookie: 1 year; other settings until reset or cleared",
      ],
      [
        "datus_website_cookie_consent / datus_studio_cookie_consent · Datus",
        "Necessary local storage of the analytics choice, policy version, and decision time; separate for each site.",
        "180 days",
      ],
      [
        "datus_website_ga* / datus_studio_ga* · Google Analytics",
        "Consent-controlled analytics cookies on the respective host. Older _ga, _ga_*, _gid or _gat cookies may exist from previous visits and are cleared when analytics is declined.",
        "Configured expiration: 180 days; browsers may shorten retention",
      ],
      [
        "datus_tracking_anonymous_id / datus_tracking_session_id · Datus",
        "Consent-controlled Studio browser and tab identifiers for usage events.",
        "Local browser ID until cleared; tab ID for the tab session. Removed on refusal or when expired permission is checked.",
      ],
      [
        "datus_tracking_pending_events:* · Datus",
        "Pending Studio usage events stored locally for delivery while analytics is allowed.",
        "Removed on successful delivery, refusal, or an expired-permission check",
      ],
      [
        "datus:github-stars · Datus",
        "Website cache of the public GitHub star count, without a visitor identifier.",
        "Cache freshness: 6 hours",
      ],
    ],
    settings: "Manage Cookie Settings",
    contact: "Questions? Contact Datus",
    googleLabel: "Google — Data use on partner sites",
  },
  zh: {
    title: "Cookie 与本地存储政策",
    lead: "了解 Datus 在浏览器中保存什么、为什么保存，以及你如何作出选择。",
    updated: "更新于 2026 年 10 月 15 日",
    scope:
      "适用于 datus.ai 与 Datus Studio。两个站点、不同浏览器分别管理选择。",
    sections: [
      {
        title: "Cookie 和类似技术",
        paragraphs: [
          "Cookie 是浏览器保存的小型文本。我们也使用 localStorage 和 sessionStorage 在设备中保存信息。本政策按用途说明这些技术，分为必要用途与可选的使用分析。",
        ],
      },
      {
        title: "必要用途",
        paragraphs: [
          "用于保持登录、完成身份验证、保障会话安全，以及保存隐私选择。我们也会按你的主动操作记住语言、主题等基础设置，仅用于提供对应功能。这些设置独立于使用分析，可以在产品中调整或重置。",
          "必要用途不通过分析开关关闭。你可以在浏览器中清除或阻止存储，但清除登录 Cookie 可能导致退出登录或无法完成身份验证。拒绝使用分析不影响登录与核心功能。",
        ],
      },
      {
        title: "使用分析，由你选择",
        paragraphs: [
          "经你允许，官网使用 Google Analytics 了解访问情况与流量来源；Datus Studio 使用 Google Analytics 和自建使用事件分析，了解页面与功能的使用情况。在允许前，不启用相应分析代码和标识。",
          "使用事件可能包括浏览器标识、标签页标识、页面路径、来源、事件时间、浏览器信息和功能操作。Studio 事件也可能关联已登录账号或项目；随机生成标识不代表所有相关信息均为匿名。",
          "当前分析配置关闭广告存储、Google signals 和广告个性化，设置中不提供广告类别。必要的安全与运行记录按用途单独评估，与可选的产品统计区分。",
        ],
      },
      {
        title: "管理或撤回选择",
        paragraphs: [
          "你可以选择「拒绝非必要」「全部接受」，也可以在「Cookie 设置」中单独调整使用分析。允许前，使用分析保持关闭。关闭提示或未保存退出设置不表示同意。你可以从官网页脚、Studio 登录页或 Studio 设置中重新打开 Cookie 设置。",
          "选择在当前浏览器、作出选择的站点保存 180 天。官网与 Studio 不自动共享同意状态。你可以随时修改或撤回；撤回后将停止后续分析采集，并清理可访问的分析 Cookie、标识和待发使用事件队列。页面可能刷新，以停用已运行的分析代码。这不会自动删除服务器已收到的记录。",
          "如果浏览器禁止保存，选择仅对本次访问生效，下次可能需要重新选择。新增用途或政策发生实质变化时，我们可能重新征求选择。",
        ],
      },
      {
        title: "第三方服务与私有部署",
        paragraphs: [
          "Google Analytics 由 Google 提供。使用 Google 登录或企业 SSO 时，也会涉及身份提供方，其站点适用自身政策。私有部署配置不同：公共 Google Analytics 默认不启用，部署方应提供与实际配置一致的说明。",
        ],
      },
      {
        title: "联系与其他说明",
        paragraphs: [
          "本政策说明 Cookie 与浏览器存储，不替代关于账号、会话记录等其他服务数据的隐私说明。关于浏览器存储或隐私选择的问题，可以通过 contact@datus.ai 联系我们。",
        ],
      },
    ],
    inventoryTitle: "Cookie 与浏览器存储清单",
    headers: ["项目 / 提供方", "用途与范围", "保存时间"],
    rows: [
      [
        "_datus_session · Datus",
        "Studio 登录会话。名称与期限可由部署配置。",
        "默认 7 天",
      ],
      [
        "datus_oidc_txn / datus_dm_redirect · Datus",
        "启用对应 SSO 提供方时，用于临时登录事务或登录后跳转。",
        "最多 10 分钟；回调时清除",
      ],
      [
        "datus_lang · Datus",
        "Studio 界面语言；主题等用户请求的界面设置也使用本地存储。",
        "语言 Cookie 保存 1 年；其他设置至重置或清除",
      ],
      [
        "datus_website_cookie_consent / datus_studio_cookie_consent · Datus",
        "必要本地存储：分析选择、政策版本和选择时间；两站点分别保存。",
        "180 天",
      ],
      [
        "datus_website_ga* / datus_studio_ga* · Google Analytics",
        "各自站点上经同意启用的分析 Cookie。之前访问留下的 _ga、_ga_*、_gid、_gat 等旧 Cookie，会在拒绝分析时清理。",
        "配置过期时间为 180 天；浏览器可能缩短期限",
      ],
      [
        "datus_tracking_anonymous_id / datus_tracking_session_id · Datus",
        "经同意启用的 Studio 浏览器与标签页标识，用于使用事件分析。",
        "浏览器标识保存至清除；标签页标识为标签页会话。拒绝或检查到许可过期时清理。",
      ],
      [
        "datus_tracking_pending_events:* · Datus",
        "允许分析时，在本地等待发送的 Studio 使用事件。",
        "成功发送、拒绝分析或检查到许可过期时清理",
      ],
      [
        "datus:github-stars · Datus",
        "官网缓存公开的 GitHub Star 数量，不包含访客标识。",
        "缓存有效期为 6 小时",
      ],
    ],
    settings: "管理 Cookie 设置",
    contact: "有疑问？联系 Datus",
    googleLabel: "Google — 合作伙伴网站上的数据使用",
  },
};
