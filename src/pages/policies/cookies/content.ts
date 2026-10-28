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
    updated: "Last updated: October 26, 2026",
    scope:
      "Applies to datus.ai and Datus Studio. Analytics choices are managed separately on each site and browser. On the website, the choice also controls temporary campaign-source storage. The Studio product-event collection described below applies only to Datus Studio, not the website.",
    sections: [
      {
        title: "Cookies and Similar Technologies",
        paragraphs: [
          "Cookies are small text files saved by your browser. We also use localStorage and sessionStorage to keep information on your device. This policy covers these technologies by purpose, including necessary uses and usage analytics.",
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
        title: "Google Analytics — Your Choice",
        paragraphs: [
          "Before you make a choice, the website and cloud-hosted Datus Studio load Google Analytics with analytics storage denied. Google can receive limited page, configured event, and consent measurements without reading or writing analytics cookies. These requests may include page information, timestamps, referrers, browser information, and network information such as the IP address used to connect to Google. Cookieless measurement is not anonymous or zero collection. Accept All enables analytics cookies and regular Google Analytics measurement. On datus.ai, the usage-analytics choice also controls temporary campaign-source storage; Studio manages its own choices separately.",
          "Our analytics configuration disables advertising storage, Google signals, and advertising personalization in all three states. We do not provide an advertising category in these settings. Necessary security and operational records are assessed separately from product analytics.",
        ],
      },
      {
        title: "Manage or Withdraw Your Choice",
        paragraphs: [
          "Choose Reject Non-Essential, Accept All, or adjust usage analytics in the website Cookie Settings. Studio manages Google Analytics separately. Before you choose, limited cookieless Google Analytics measurement runs. Accept All enables regular Google Analytics. Reject Non-Essential, or saving with usage analytics off, stops subsequent Google Analytics measurement, including cookieless measurement, and clears the website campaign cache. Closing the prompt or settings without saving leaves the current state unchanged; it is not acceptance. Reopen Cookie Settings from the website footer, Studio sign-in page, or Studio settings.",
          "Your choice is saved for 180 days in this browser, on the site where you make it. The website and Studio do not automatically share consent. You can change or withdraw your choice at any time. Rejection or withdrawal stops subsequent Google Analytics measurement and removes accessible Google Analytics cookies. Datus Studio product events, identifiers, and pending event queues are unaffected. A running Google Analytics SDK is disabled in the current page using Google's measurement-disable setting; changing your choice does not reload the page or discard unsaved input. When a choice expires, limited cookieless measurement resumes and the prompt appears again. This does not erase records already received by servers.",
          "If storage is blocked, your choice applies to the current visit but may not be remembered. An already-loaded GA SDK is disabled in place. New purposes or material policy changes may require a new choice.",
        ],
      },
      {
        title: "Website Campaign Parameters",
        paragraphs: [
          "Tagged Studio links can carry incoming utm_source, utm_medium, and utm_campaign values along with the website button's own utm_content. Without explicit UTM, a recognized search-engine referrer supplies a source and organic medium, without inventing a campaign. When no valid campaign is available, links use utm_source=datus.ai without adding a medium or campaign; this fallback is not stored. Partial external UTM sets remain unchanged. Only these three source fields are forwarded, with at most 100 characters per field. Complete referrer URLs, search terms, sign-in codes, and other query parameters are not copied. No visitor identifier or new collection endpoint is added.",
          "After you accept usage analytics, the website keeps these campaign fields and their capture time in sessionStorage for up to 30 minutes in the current tab. This lets them accompany a Studio link after you browse another marketing page. A new URL containing campaign fields, or a newly recognized search referrer, replaces the previous set rather than combining campaigns. Explicit UTM takes priority; known advertising-click identifiers prevent organic inference. Rejecting, withdrawing, or allowing consent to expire clears this storage. Without acceptance, or if browser storage is blocked, only current URL values or a recognized current search referrer can accompany a Studio link. Separately opened tabs do not share this storage; browsers may copy it when opening a tab from an existing one.",
        ],
      },
      {
        title: "Datus Studio Product Events",
        paragraphs: [
          "Datus Studio collects first-party feature-use events by default to understand product usage and improve the service. These events are sent to Datus and are separate from Google Analytics. Accepting, rejecting, withdrawing, or allowing the Google Analytics choice to expire does not stop these events or clear their identifiers and queues. This collection does not run on datus.ai.",
          "Studio events may include browser and tab identifiers, page paths, referrers, event times, browser information, IP address, feature interactions, and account, workspace, or project context. The server can identify a signed-in user through the existing login session. Browser and tab identifiers use localStorage and sessionStorage; pending events are buffered locally for delivery and retry. Random identifiers do not make all associated information anonymous. The storage inventory identifies these Studio-specific items. Contact contact@datus.ai with questions or requests about product-event data.",
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
        "Analytics cookies used after acceptance on the respective host; no analytics-cookie access before a choice. Older _ga, _ga_*, _gid or _gat cookies may remain from previous visits and are cleared before a choice or when analytics is declined.",
        "Configured expiration: 180 days; browsers may shorten retention",
      ],
      [
        "datus_tracking_anonymous_id / datus_tracking_session_id · Datus",
        "Studio-only browser and tab identifiers for default first-party product events; independent of the Google Analytics choice.",
        "Local browser ID until cleared; tab ID for the tab session. Rejecting Google Analytics does not remove them.",
      ],
      [
        "datus_tracking_pending_events:* · Datus",
        "Studio-only first-party product events buffered locally for delivery and retry, regardless of the Google Analytics choice.",
        "Until successful delivery, queue eviction, or browser storage is cleared",
      ],
      [
        "datus_website_campaign · Datus",
        "Website-only sessionStorage of utm_source, utm_medium, utm_campaign, and capture time, after accepting usage analytics. Used to pass campaign context to tagged Studio links; no visitor ID.",
        "30 minutes from capture; also cleared on refusal or withdrawal. Browser tab-session rules apply.",
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
    updated: "更新于 2026 年 10 月 26 日",
    scope:
      "适用于 datus.ai 与 Datus Studio。两个站点、不同浏览器分别管理使用分析选择；官网的选择还控制推广来源参数的临时保存。下文的 Studio 功能使用事件仅适用于 Datus Studio，官网没有这套自建埋点。",
    sections: [
      {
        title: "Cookie 和类似技术",
        paragraphs: [
          "Cookie 是浏览器保存的小型文本。我们也使用 localStorage 和 sessionStorage 在设备中保存信息。本政策按用途说明这些技术，分为必要用途与使用分析。",
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
        title: "Google Analytics，由你选择",
        paragraphs: [
          "作出选择前，官网与云端 Datus Studio 会在拒绝分析存储的模式下加载 Google Analytics。Google 可在不读写分析 Cookie 的情况下接收页面、已配置事件及同意状态的有限测量，请求可能包含页面信息、时间、来源、浏览器信息，以及连接 Google 时的 IP 地址等网络信息。无 Cookie 测量不代表匿名或零采集。「全部接受」会开启分析 Cookie 和常规 Google Analytics 测量；在 datus.ai 上，使用分析选择还控制推广来源参数的临时保存。Studio 单独管理自己的选择。",
          "三个状态下均关闭广告存储、Google signals 和广告个性化，设置中不提供广告类别。必要的安全与运行记录按用途单独评估，与产品统计区分。",
        ],
      },
      {
        title: "管理或撤回选择",
        paragraphs: [
          "你可以选择「拒绝非必要」「全部接受」，也可以在官网「Cookie 设置」中调整使用分析；Studio 单独管理 Google Analytics。未选择时运行有限的无分析 Cookie 测量；「全部接受」开启常规 Google Analytics；「拒绝非必要」或保持使用分析关闭并保存，会停止后续 Google Analytics 测量，包括无 Cookie 测量，并清理官网保存的推广来源参数。关闭提示或未保存退出设置不会改变当前状态，也不表示接受。你可以从官网页脚、Studio 登录页或 Studio 设置中重新打开 Cookie 设置。",
          "选择在当前浏览器、作出选择的站点保存 180 天。官网与 Studio 不自动共享同意状态。你可以随时修改或撤回；拒绝或撤回后停止后续 Google Analytics 测量，并清理可访问的 Google Analytics Cookie；不会停用 Datus Studio 功能使用事件，也不会清理其标识和待发队列。已运行的 Google Analytics SDK 会通过 Google 的测量禁用设置在当前页面停用；修改选择不会刷新页面或丢弃未保存的输入。选择到期后恢复有限的无 Cookie 测量，并重新显示提示。这不会删除服务器已收到的记录。",
          "如果浏览器禁止保存，选择仅对本次访问生效，下次可能需要重新选择。已加载的 GA SDK 会在当前页面内停用。新增用途或政策发生实质变化时，我们可能重新征求选择。",
        ],
      },
      {
        title: "官网推广来源参数",
        paragraphs: [
          "已标记的 Studio 链接可携带传入的 utm_source、utm_medium 和 utm_campaign，以及官网按钮自己的 utm_content。没有显式 UTM 时，可根据可识别的搜索引擎来源生成 source 与 organic medium，不编造 campaign。没有有效推广来源时，链接使用 utm_source=datus.ai，不额外生成 medium 或 campaign，也不保存这个默认值；外部 UTM 只有部分字段时仍保持原样。只转发这三个来源字段，每个字段最多 100 个字符；完整来源 URL、搜索词、登录验证码和其他查询参数不会被复制。此功能不添加访客标识，也不新增数据采集接口。",
          "接受使用分析后，官网会在当前标签页的 sessionStorage 中临时保存这些推广参数和获取时间，最多 30 分钟，以便浏览其他营销页面后仍能随 Studio 链接传递。新的 URL 带来推广参数，或识别到新的自然搜索来源时，整体替换之前的一组，不混合不同活动。显式 UTM 优先；出现已知广告点击标识时，不推断为自然搜索。拒绝、撤回或同意到期后清理保存内容。未接受或浏览器禁止存储时，只传递当前 URL 参数或当前可识别的搜索引擎来源。独立打开的标签页不共享这项存储；从已有标签页打开新页时，浏览器可能复制其内容。",
        ],
      },
      {
        title: "Datus Studio 功能使用事件",
        paragraphs: [
          "Datus Studio 默认采集自建功能使用事件，用于了解产品使用情况并改进服务。事件发送至 Datus，与 Google Analytics 分别处理。接受、拒绝、撤回或 Google Analytics 选择到期，都不会停用这些事件，也不会清理其标识和待发队列。datus.ai 官网不运行这套自建埋点。",
          "Studio 事件可能包括浏览器与标签页标识、页面路径、来源、事件时间、浏览器信息、IP 地址、功能操作，以及账号、工作区或项目上下文。服务端可通过已有登录会话识别已登录用户。浏览器与标签页标识使用 localStorage 和 sessionStorage，待发事件在本地缓冲并重试。随机标识不代表所有相关信息均为匿名。存储清单中已标明这些 Studio 专属项目。关于功能使用事件数据的问题或请求，可以通过 contact@datus.ai 联系我们。",
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
        "必要本地存储：使用分析选择、政策版本和选择时间；两站点分别保存。",
        "180 天",
      ],
      [
        "datus_website_ga* / datus_studio_ga* · Google Analytics",
        "各自站点上接受后启用的分析 Cookie；作出选择前不读写分析 Cookie。之前访问留下的 _ga、_ga_*、_gid、_gat 等旧 Cookie，会在未选择或拒绝分析时清理。",
        "配置过期时间为 180 天；浏览器可能缩短期限",
      ],
      [
        "datus_tracking_anonymous_id / datus_tracking_session_id · Datus",
        "仅用于 Studio 默认功能使用事件的浏览器与标签页标识，独立于 Google Analytics 选择。",
        "浏览器标识保存至清除；标签页标识为标签页会话。拒绝 Google Analytics 不会清理这些标识。",
      ],
      [
        "datus_tracking_pending_events:* · Datus",
        "仅用于 Studio 的自建功能使用事件，在本地等待发送或重试，不受 Google Analytics 选择影响。",
        "至成功发送、队列淘汰或清除浏览器存储",
      ],
      [
        "datus_website_campaign · Datus",
        "仅用于官网：接受使用分析后，以 sessionStorage 临时保存 utm_source、utm_medium、utm_campaign 和获取时间，供已标记的 Studio 链接传递推广来源，不含访客标识。",
        "获取后 30 分钟失效；拒绝或撤回时清理，另受浏览器标签页会话规则约束。",
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
