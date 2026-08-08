import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useFormspree } from "../../hooks/useFormspree";

/* ── 微信公众号专属移动落地页 ──────────────────────────────────────────
   浅色 + 紫主题，视觉延续 /datafun 会场落地页（#6051F5 → #7B6EF7）。
   针对微信内置浏览器（WeChat WebView）优化：
   - 不引用 Google Fonts / Google Analytics（大陆网络会挂起，拖慢首屏），
     改用系统中文字体栈（PingFang SC / 微信自带思源黑体）。
   - 读者已在微信内，不再使用「扫码」文案，改为「填写表单预约」。
   提交沿用站点现有 Formspree 接口（useFormspree），来源标记为公众号。
   注意：全站 site.css 把 body 设为深色背景，本页用整屏白底容器覆盖之。 */

const C = {
  brand: "#6051F5",
  brandBright: "#7B6EF7",
  ink: "#151515",
  inkMid: "#404040",
  inkDim: "#5c5c62",
  line: "#E8E7F2",
  cardTop: "#FAFAFC",
  cardBottom: "#F1F0FB",
};

// 系统中文字体栈 —— 微信内置浏览器无法可靠加载 Google Fonts，
// 依赖设备原生字体（iOS PingFang SC / Android 思源黑体 / Windows 微软雅黑）。
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Source Han Sans SC','Noto Sans CJK SC','Helvetica Neue',Helvetica,Arial,sans-serif";

const CONTACT_EMAIL = "contact@datus.ai";

const VALUE_POINTS: { title: string; body: string }[] = [
  {
    title: "构建指标体系",
    body: "把散落的口径、语义模型与参考 SQL 统一沉淀、版本化、复用，构建 OSI 标准指标体系。",
  },
  {
    title: "自动生成报表和问数服务",
    body: "从指标出发自动生成 Dashboard 与报告，并对外提供自然语言问数服务。",
  },
  {
    title: "安全可控地提升数据开发效率",
    body: "Permission Mode 管理工具权限，Subagent 级模型切换降本，Validation Loop 保证质量交付。",
  },
];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13.5,
  fontWeight: 600,
  color: C.ink,
  marginBottom: 7,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "0 14px",
  borderRadius: 12,
  background: "#fff",
  border: `1px solid ${C.line}`,
  color: C.ink,
  fontSize: 16, // ≥16px 防止 iOS 聚焦时自动放大
  fontFamily: FONT,
  outline: "none",
  boxSizing: "border-box",
};

function focusRing(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = C.brand;
  e.currentTarget.style.boxShadow = `0 0 0 3px rgba(96,81,245,0.14)`;
}
function blurRing(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = C.line;
  e.currentTarget.style.boxShadow = "none";
}

export default function WechatPage() {
  const { status, error, submit } = useFormspree();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    role: "",
    message: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      role: form.role.trim(),
      message: form.message.trim(),
      source: "datus.ai WeChat — 公众号 mobile landing",
      event: "WeChat 公众号",
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#ffffff",
        color: C.inkMid,
        fontFamily: FONT,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* 顶部装饰光晕 */}
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -120,
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, rgba(96,81,245,0.16), transparent 62%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 480,
          margin: "0 auto",
          padding: "26px 20px 48px",
        }}
      >
        {/* 品牌条 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            Datus
          </span>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: C.brand,
              background: "rgba(96,81,245,0.10)",
              padding: "6px 12px",
              borderRadius: 999,
            }}
          >
            开源数据工程 Agent
          </span>
        </div>

        {/* Hero */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.brand,
            marginBottom: 14,
          }}
        >
          Datus Studio · AI-native 数据开发平台
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 8vw, 36px)",
            fontWeight: 900,
            lineHeight: 1.32,
            letterSpacing: "-0.01em",
            color: C.ink,
          }}
        >
          把完整数据工程流程，
          <br />
          压缩进一个{" "}
          <em style={{ fontStyle: "italic", fontWeight: 700, color: C.brand }}>
            Agent
          </em>{" "}
          工作流。
        </h1>
        <p
          style={{
            margin: "18px 0 0",
            fontSize: 15.5,
            lineHeight: 1.7,
            color: C.inkDim,
          }}
        >
          从原始数据出发，完成数据探索、数仓建模、质量校验、指标定义、Dashboard
          生成、报告交付与数据问答。
          <span style={{ color: C.brand, fontWeight: 700 }}>
            {" "}
            填写下方表单，预约 1 周快速 POC。
          </span>
        </p>

        {/* 3 个价值点 */}
        <div style={{ marginTop: 26, display: "grid", gap: 12 }}>
          {VALUE_POINTS.map((v, i) => (
            <div
              key={i}
              style={{
                background: `linear-gradient(180deg, ${C.cardTop}, ${C.cardBottom})`,
                border: `1px solid ${C.line}`,
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: C.ink,
                  marginBottom: 6,
                }}
              >
                {v.title}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkDim }}>
                {v.body}
              </div>
            </div>
          ))}
        </div>

        {/* 预约表单 */}
        <div
          id="poc"
          style={{
            marginTop: 30,
            background: "#fff",
            border: `1px solid ${C.line}`,
            borderRadius: 20,
            padding: "24px 20px",
            boxShadow: "0 20px 44px rgba(96,81,245,0.10)",
          }}
        >
          {status === "success" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "12px 0",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(96,81,245,0.10)",
                  marginBottom: 16,
                }}
              >
                <CheckCircle2 size={30} style={{ color: C.brand }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: C.ink }}>
                预约成功，感谢关注 Datus！
              </h3>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: C.inkDim,
                }}
              >
                我们通常会在一个工作日内与你联系。也可直接邮件{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  style={{ color: C.brand, textDecoration: "none", fontWeight: 600 }}
                >
                  {CONTACT_EMAIL}
                </a>
                。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  margin: "0 0 6px",
                  color: C.ink,
                }}
              >
                预约 1 周快速 POC
              </h2>
              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: C.inkDim,
                }}
              >
                留下联系方式，我们会在一个工作日内与你联系，安排 Datus Studio
                体验与 POC。
              </p>

              <div style={{ display: "grid", gap: 15 }}>
                <div>
                  <label htmlFor="wx-name" style={labelStyle}>
                    姓名 <span style={{ color: C.brand }}>*</span>
                  </label>
                  <input
                    id="wx-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    onFocus={focusRing}
                    onBlur={blurRing}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="wx-phone" style={labelStyle}>
                    手机 / 微信 <span style={{ color: C.brand }}>*</span>
                  </label>
                  <input
                    id="wx-phone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="方便我们尽快联系你"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    onFocus={focusRing}
                    onBlur={blurRing}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="wx-company" style={labelStyle}>
                    公司 <span style={{ color: C.brand }}>*</span>
                  </label>
                  <input
                    id="wx-company"
                    type="text"
                    required
                    autoComplete="organization"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    onFocus={focusRing}
                    onBlur={blurRing}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label htmlFor="wx-email" style={labelStyle}>
                      邮箱
                    </label>
                    <input
                      id="wx-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      onFocus={focusRing}
                      onBlur={blurRing}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="wx-role" style={labelStyle}>
                      职位
                    </label>
                    <input
                      id="wx-role"
                      type="text"
                      autoComplete="organization-title"
                      value={form.role}
                      onChange={(e) => set("role", e.target.value)}
                      onFocus={focusRing}
                      onBlur={blurRing}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="wx-message" style={labelStyle}>
                    你想解决什么数据问题？（选填）
                  </label>
                  <textarea
                    id="wx-message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    onFocus={focusRing}
                    onBlur={blurRing}
                    placeholder="数据栈、规模、场景，任何想让我们了解的信息…"
                    style={{
                      ...inputStyle,
                      minHeight: 92,
                      padding: "12px 14px",
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                  />
                </div>
              </div>

              {status === "error" && error && (
                <p style={{ marginTop: 14, marginBottom: 0, fontSize: 13, color: "#d64545" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                style={{
                  marginTop: 22,
                  width: "100%",
                  minHeight: 54,
                  borderRadius: 14,
                  border: "none",
                  background:
                    status === "submitting"
                      ? "rgba(96,81,245,0.55)"
                      : `linear-gradient(180deg, ${C.brand}, ${C.brandBright})`,
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 700,
                  fontFamily: FONT,
                  cursor: status === "submitting" ? "wait" : "pointer",
                  boxShadow: "0 12px 26px rgba(96,81,245,0.32)",
                }}
              >
                {status === "submitting" ? "提交中…" : "立即预约 POC"}
              </button>

              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: C.inkDim,
                  textAlign: "center",
                }}
              >
                我们仅将你的信息用于本次 POC 联系，不作他用。
              </p>
            </form>
          )}
        </div>

        {/* 页脚 */}
        <div
          style={{
            marginTop: 34,
            paddingTop: 20,
            borderTop: `1px solid ${C.line}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 14,
              fontSize: 13,
              fontWeight: 600,
              color: C.brand,
              marginBottom: 12,
            }}
          >
            <span>studio.datus.ai</span>
            <span style={{ color: "#c7c4e0" }}>·</span>
            <span>datus.ai</span>
            <span style={{ color: "#c7c4e0" }}>·</span>
            <span>docs.datus.ai</span>
          </div>
          <div style={{ fontSize: 12, color: C.inkDim }}>
            © 2026 Datus · AI-native data engineering, made simple.
          </div>
        </div>
      </div>
    </div>
  );
}
