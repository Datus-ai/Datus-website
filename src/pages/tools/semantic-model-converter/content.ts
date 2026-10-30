import { UI } from "../../../i18n/ui";
import type { Locale } from '../../../i18n/config';

interface IConverterPageCopy {
  title: string;
  eyebrow: string;
  lead: string;
  free: string;
  overviewTitle: string;
  overview: string;
  importsTitle: string;
  importsIntro: string;
  importArticle: string;
  formatsTitle: string;
  formatsIntro: string;
  stepsTitle: string;
  steps: { title: string; text: string }[];
  boundariesTitle: string;
  boundaries: string[];
  examplesTitle: string;
  examplesIntro: string;
  examples: { name: string; text: string }[];
  relatedTitle: string;
  playground: string;
  examplesArticle: string;
  convertersArticle: string;
  ossie: string;
  studio: string;
}

export const converterPage: Record<Locale, IConverterPageCopy> = {
  en: {
    title: 'Apache Ossie Converter',
    eyebrow: 'Free Developer Tool · Apache Ossie / Dosi',
    lead: 'Convert Cube, dbt, Omni and other supported platform models to Apache Ossie, or export Ossie / Dosi YAML to another format. Try prefilled examples, inspect diagnostics, edit files and download results.',
    free: 'No signup · Sample models included · Offline conversion checks',
    overviewTitle: 'Import to Ossie or Export to Your Platform',
    overview:
      'A semantic model describes datasets, fields, relationships and metrics. Choose Import to Ossie for supported vendor YAML, JSON or BIM bundles, or Export from Ossie for Apache Ossie YAML and supported Dosi extensions. The tool sends a snapshot to Datus for conversion using Apache Ossie converters with compatibility and quality checks. The generated files are a starting point for import into your target platform.',
    importsTitle: 'Supported Imports to Apache Ossie',
    importsIntro:
      'Import support is separate from export support. The live source catalog controls availability. Snowflake Cortex Analyst and Hex are export-only in this tool; there is no general reverse importer for them here.',
    importArticle: 'Convert Cube, dbt and Other Models to Apache Ossie',
    formatsTitle: 'Supported Export Formats',
    formatsIntro:
      'The workbench loads its available targets and required options from the conversion service. Exports cover these formats; available targets depend on the deployed engine version.',
    stepsTitle: 'How to Convert a Semantic Model',
    steps: [
      {
        title: 'Choose a Direction and Load an Example',
        text: 'Select Import to Ossie or Export from Ossie. Each direction opens with a prefilled example. Upload your source files or folder, paste a new definition, or choose a sample bundle. Source files stay editable.',
      },
      {
        title: 'Choose the Source or Target Platform',
        text: 'For import, choose the original platform; the target is Apache Ossie. For export, choose the destination format. Fill in fields marked with an asterisk. Database is optional where offered. A preferred SQL dialect selects an existing expression; it does not translate SQL.',
      },
      {
        title: 'Convert and Review',
        text: 'Click Convert to submit the current input and settings. Success passes the available offline checks. Needs Review includes diagnostics; Blocked results cannot be exported.',
      },
      {
        title: 'Edit and Download',
        text: 'Inspect the generated files in the workbench. Download a single file directly or a multi-file ZIP with relative directories preserved. Downloads include your edits.',
      },
    ],
    boundariesTitle: 'What Conversion Does—and What Still Needs Checking',
    boundaries: [
      'Conversion does not connect to a warehouse, run SQL or DAX, or deploy files to the target platform. Verify import and execution in that platform.',
      'Some source constructs cannot be represented in every target. Read target-specific notes and diagnostics; do not assume every model converts losslessly.',
      'The dbt target exports semantic_manifest.json, not the source YAML files of a runnable dbt project. Microsoft Power BI / Fabric exports offline BIM JSON.',
      'The public tool accepts up to 1 MiB of UTF-8 input (including paths for imports) and up to 50 source files per import, with server-side request limits. Source files is sent to Datus servers when you click Convert. Inputs and generated files are not persisted by the tool; keep downloads before leaving the page.',
    ],
    examplesTitle: 'Try Real Apache Ossie Examples',
    examplesIntro:
      'Import examples are authored test bundles for Cube, Omni, dbt and Power BI. Export examples are unchanged Apache-2.0 fixtures pinned to an upstream revision. Choose a sample in the workbench to prefill the complete input; no signup is needed.',
    examples: [
      {
        name: 'Cube → Ossie',
        text: 'Three YAML files: orders, customers and a commerce view. Demonstrates relationships and a complete multi-file import.',
      },
      {
        name: 'Omni → Ossie',
        text: 'Views, relationships and a sales topic in a four-file bundle, ready to convert.',
      },
      {
        name: 'dbt → Ossie',
        text: 'A compiled semantic_manifest.json test fixture. Raw dbt project YAML is not accepted by this importer.',
      },
      {
        name: 'Power BI → Ossie',
        text: 'An offline model.bim file. Native expressions intentionally demonstrate the Needs Review diagnostic flow.',
      },
      {
        name: 'Omni Sales',
        text: 'ANSI_SQL sales model. Suggested target: Omni, producing multiple YAML files for views, relationships and topics.',
      },
      {
        name: 'NVIDIA Sales',
        text: 'ANSI_SQL and Snowflake expressions, including a ratio metric. Suggested target: dbt MetricFlow Manifest, producing a JSON file.',
      },
      {
        name: 'TPC-DS Retail',
        text: 'A larger ANSI_SQL retail model. Suggested target: Snowflake Cortex Analyst. Expected metadata warnings demonstrate the Needs Review flow.',
      },
    ],
    relatedTitle: 'Continue Exploring',
    playground: 'MetricFlow → OSI Playground',
    examplesArticle: 'Semantic Model Examples and YAML Guide',
    convertersArticle: 'Apache Ossie Conversion Guide',
    ossie: 'Apache Ossie Converter Documentation',
    studio: UI.en.common.tryStudio,
  },
  zh: {
    title: 'Apache Ossie 语义模型转换器',
    eyebrow: '免费开发工具 · Apache Ossie / Dosi',
    lead: '将 Cube、dbt、Omni 等支持的平台模型导入 Apache Ossie，或将 Ossie / Dosi YAML 导出为其他格式。直接试用预填充样例，查看诊断、编辑文件并下载结果。',
    free: '无需注册 · 内置测试样例 · 离线转换检查',
    overviewTitle: '导入 Ossie，或导出为其他平台格式',
    overview:
      '语义模型描述数据集、字段、关系和指标。选择“导入 Ossie”，可使用支持的厂商 YAML、JSON 或 BIM 文件；选择“从 Ossie 导出”，可使用 Apache Ossie YAML 及支持的 Dosi 扩展。工具将内容快照发送至 Datus，通过 Apache Ossie 转换器及兼容适配、质量检查生成目标文件。导出文件可作为目标平台导入的起点。',
    importsTitle: '支持导入 Apache Ossie 的来源格式',
    importsIntro:
      '导入与导出能力分别维护，实际可用来源以服务返回的列表为准。本工具中的 Snowflake Cortex Analyst 和 Hex 仅支持导出，尚无通用反向导入器。',
    importArticle: '将 Cube、dbt 等模型导入 Apache Ossie（英文）',
    formatsTitle: '支持的导出格式',
    formatsIntro:
      '工作台从转换服务读取可用目标及必填参数。导出覆盖以下格式，实际可用目标取决于已部署的引擎版本。',
    stepsTitle: '如何转换语义模型',
    steps: [
      {
        title: '选择转换方向并试用样例',
        text: '选择“导入 Ossie”或“从 Ossie 导出”，两个方向默认均有预填充样例。可以上传文件或文件夹、粘贴新定义或选择样例文件组，输入内容可以继续编辑。',
      },
      {
        title: '选择来源或目标平台',
        text: '导入时选择原平台，目标固定为 Apache Ossie；导出时选择目标格式，并填写标有星号的必填项。Database 为可选参数。优先 SQL 方言用于选择已有表达式，不进行 SQL 翻译。',
      },
      {
        title: '转换并查看诊断',
        text: '点击转换，提交当前输入和配置。“成功”表示通过已有离线检查；“需要检查”包含诊断信息；“已阻止”的结果无法导出。',
      },
      {
        title: '编辑并下载',
        text: '在工作台查看、编辑生成文件。单文件直接下载，多文件打包 ZIP 并保留相对目录，下载内容包含当前编辑。',
      },
    ],
    boundariesTitle: '转换的能力与验证范围',
    boundaries: [
      '转换不会连接数据仓库、运行 SQL 或 DAX，也不会将文件部署到目标平台。请在目标平台验证导入及实际执行。',
      '部分源模型结构无法在所有目标中表达。请阅读格式说明和诊断，不要假设所有模型均可无损转换。',
      'dbt 目标导出 semantic_manifest.json，并非可运行 dbt 项目的原始 YAML 文件；Microsoft Power BI / Fabric 目标导出离线 BIM JSON。',
      '公共工具接受最多 1 MiB 的 UTF-8 输入，导入时包含路径大小，每次导入最多 50 个文件，并有服务端请求频率限制。点击转换时，源文件 会发送至 Datus 服务器。工具不持久保存输入和生成文件，请在离开页面前下载所需内容。',
    ],
    examplesTitle: '试用真实的 Apache Ossie 样例',
    examplesIntro:
      '导入样例为编写的 Cube、Omni、dbt 和 Power BI 测试定义；导出样例来自固定版本的上游 Apache-2.0 文件，内容保持不变。在工作台选择样例即可填充完整输入，无需注册。',
    examples: [
      {
        name: 'Cube → Ossie',
        text: '订单、客户和电商视图共三个 YAML 文件，展示关联关系与完整的多文件导入。',
      },
      {
        name: 'Omni → Ossie',
        text: '包含视图、关联关系和销售主题的四文件样例，可直接转换。',
      },
      {
        name: 'dbt → Ossie',
        text: '已编译的 semantic_manifest.json 测试文件，此导入器不接受 dbt 项目原始 YAML。',
      },
      {
        name: 'Power BI → Ossie',
        text: '离线 model.bim 文件，原生表达式用于展示“需检查”的诊断流程。',
      },
      {
        name: 'Omni Sales',
        text: 'ANSI_SQL 销售模型。建议目标为 Omni，生成视图、关系和主题等多个 YAML 文件。',
      },
      {
        name: 'NVIDIA Sales',
        text: '包含 ANSI_SQL、Snowflake 表达式及比率指标。建议目标为 dbt MetricFlow Manifest，生成 JSON 文件。',
      },
      {
        name: 'TPC-DS Retail',
        text: '较大的 ANSI_SQL 零售模型。建议目标为 Snowflake Cortex Analyst，预期的元数据警告可用于体验“需要检查”流程。',
      },
    ],
    relatedTitle: '继续探索',
    playground: 'MetricFlow → OSI 试验工具',
    examplesArticle: '语义模型样例与 YAML 指南',
    convertersArticle: 'Apache Ossie 转换指南（英文）',
    ossie: 'Apache Ossie 转换器文档',
    studio: UI.zh.common.tryStudio,
  },
};

export const TARGET_FORMATS = [
  'Snowflake Cortex Analyst',
  'dbt MetricFlow Manifest',
  'Cube',
  'Omni',
  'Microsoft Power BI / Fabric',
  'Sigma',
  'WisdomAI',
  'Hex',
  'Holistics AML',
  'Honeydew',
  'ThoughtSpot TML',
  'GoodData LDM',
  'NVIDIA Auto Ontology',
  'OrionBelt OBML',
];

export const IMPORT_FORMATS = [
  'Cube',
  'Omni',
  'dbt MetricFlow (compiled manifest)',
  'Microsoft Power BI / Fabric (BIM)',
  'Sigma',
  'WisdomAI',
  'Holistics (compiled AML JSON)',
  'Honeydew',
  'ThoughtSpot (Model + TML)',
  'GoodData LDM',
  'NVIDIA Auto Ontology',
  'OrionBelt OBML',
];
