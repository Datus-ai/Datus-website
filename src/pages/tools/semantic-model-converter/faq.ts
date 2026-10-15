import type { Locale } from '../../../i18n/config';
import type { FaqItem } from '../../../components/FAQ';

export const converterFaq: Record<Locale, FaqItem[]> = {
  en: [
    {
      q: 'What input does the semantic model converter accept?',
      a: 'The tool accepts Apache Ossie semantic model YAML and supported Dosi extensions, up to 1 MiB of UTF-8 text. Paste a model, upload a .yml or .yaml file, or load an included upstream example. It does not accept an arbitrary vendor configuration as the source; use the separate OSI Playground for its MetricFlow-to-OSI workflow.',
    },
    {
      q: 'Is this a YAML-to-YAML formatter?',
      a: 'No. Conversion maps semantic datasets, fields, relationships and metrics into a target platform’s model format. Output can be YAML, JSON, BIM, AML or TML, depending on the target. Unsupported constructs and possible loss of metadata are reported as diagnostics rather than treated as a formatting change.',
    },
    {
      q: 'Does Success mean the output will run in the target platform?',
      a: 'Success means the available offline conversion and quality checks passed. The tool does not connect to your warehouse, execute SQL or DAX, or deploy to the destination. Import the files into the target platform, configure any required connections, and verify metric results before using the model in production.',
    },
    {
      q: 'Are my YAML files processed in the browser?',
      a: 'The browser holds your editable input and output, but conversion runs on Datus servers. Clicking Convert submits a snapshot of the current YAML and settings. No account is required. The tool does not persist source models or results; refresh or close the page to clear them, and download files you want to keep.',
    },
    {
      q: 'Why do some results show Needs Review or Blocked?',
      a: 'Needs Review means files were generated with warnings, such as metadata that the target cannot preserve. Read the diagnostics before downloading or importing them. Blocked means a conversion or quality problem prevents export. Correct the source or required settings and convert again; selecting a different target can change which constructs are supported.',
    },
  ],
  zh: [
    {
      q: '语义模型转换器接受什么输入？',
      a: '工具接受 Apache Ossie 语义模型 YAML 及支持的 Dosi 扩展，输入最多为 1 MiB UTF-8 文本。可以粘贴模型、上传 .yml 或 .yaml 文件，或加载内置上游样例。工具不接受任意厂商配置作为源文件；MetricFlow 转 OSI 请使用单独的 OSI 试验工具。',
    },
    {
      q: '这只是 YAML 格式化工具吗？',
      a: '不是。转换会将语义数据集、字段、关系和指标映射为目标平台的模型格式。根据目标不同，产物可能为 YAML、JSON、BIM、AML 或 TML。不支持的结构及可能丢失的元数据会通过诊断说明，而不是当作普通格式调整处理。',
    },
    {
      q: '“成功”是否表示产物可以在目标平台直接运行？',
      a: '“成功”表示通过已有离线转换及质量检查。工具不会连接数据仓库、执行 SQL 或 DAX，也不会部署到目标平台。请导入文件、配置目标平台所需连接，并验证指标结果后再用于生产。',
    },
    {
      q: 'YAML 是否完全在浏览器中处理？',
      a: '浏览器保留可编辑的输入与输出，但实际转换在 Datus 服务器执行。点击转换时，会提交当前 YAML 和配置的内容快照，无需注册。工具不持久保存源模型或结果；刷新或关闭页面后清除，请下载需要保留的文件。',
    },
    {
      q: '为什么有些结果显示“需要检查”或“已阻止”？',
      a: '“需要检查”表示已生成文件，但存在目标平台无法保留的元数据等警告。下载或导入前请阅读诊断。“已阻止”表示转换或质量问题导致无法导出，请修正输入或必填参数后再转换。不同目标对源模型结构的支持也可能不同。',
    },
  ],
};
