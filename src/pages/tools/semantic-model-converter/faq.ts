import type { Locale } from '../../../i18n/config';
import type { FaqItem } from '../../../components/FAQ';

export const converterFaq: Record<Locale, FaqItem[]> = {
  en: [
    {
      q: 'What input does the semantic model converter accept?',
      a: 'Choose Import to Ossie for supported vendor models, including Cube YAML bundles, Omni project files, compiled dbt semantic_manifest.json and offline Power BI model.bim JSON. Choose Export from Ossie for Apache Ossie YAML and supported Dosi extensions. Imports accept up to 50 files and 1 MiB total UTF-8 content including paths. Each direction includes prefilled examples; the deployed catalog determines available formats.',
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
      a: 'The browser holds your editable input and output, but conversion runs on Datus servers. Clicking Convert submits a snapshot of all current source files and settings. No account is required. The tool does not persist source models or results; refresh or close the page to clear them, and download files you want to keep.',
    },
    {
      q: 'Why do some results show Needs Review or Blocked?',
      a: 'Needs Review means files were generated with warnings, such as metadata that the target cannot preserve. Read the diagnostics before downloading or importing them. Blocked means a conversion or quality problem prevents export. Correct the source or required settings and convert again; selecting a different target can change which constructs are supported.',
    },
  ],
  zh: [
    {
      q: '语义模型转换器接受什么输入？',
      a: '“导入 Ossie”接受支持的厂商模型，包括 Cube YAML 文件组、Omni 项目文件、已编译的 dbt semantic_manifest.json 和离线 Power BI model.bim JSON；“从 Ossie 导出”接受 Apache Ossie YAML 及支持的 Dosi 扩展。导入最多支持 50 个文件，UTF-8 内容与路径合计不超过 1 MiB。两个方向均提供预填充样例，实际可用格式以已部署服务的列表为准。',
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
      a: '浏览器保留可编辑的输入与输出，但实际转换在 Datus 服务器执行。点击转换时，会提交所有当前源文件和配置的内容快照，无需注册。工具不持久保存源模型或结果；刷新或关闭页面后清除，请下载需要保留的文件。',
    },
    {
      q: '为什么有些结果显示“需要检查”或“已阻止”？',
      a: '“需要检查”表示已生成文件，但存在目标平台无法保留的元数据等警告。下载或导入前请阅读诊断。“已阻止”表示转换或质量问题导致无法导出，请修正输入或必填参数后再转换。不同目标对源模型结构的支持也可能不同。',
    },
  ],
};
