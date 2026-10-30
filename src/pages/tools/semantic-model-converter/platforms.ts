import type { Locale } from '../../../i18n/config';
import type { FaqItem } from '../../../components/FAQ';

interface PlatformCopy {
  description: string;
  faq: FaqItem[];
  guide: string;
}

export const platformUi: Record<Locale, {
  directory: string; intro: string; format: string; input: string; output: string;
  checks: string; steps: string; resources: string; guide: string; all: string;
}> = {
  en: {
    directory: 'Choose a Conversion', intro: 'Open a source-to-target converter with the right direction, format and editable example already selected.',
    format: 'What This Converter Does', input: 'Source Format', output: 'Generated Output',
    checks: 'Review Before Using the Output', steps: 'Conversion Steps', resources: 'Continue Exploring', guide: 'Read the conversion guide', all: 'All Apache Ossie converters',
  },
  zh: {
    directory: '按转换方向选择工具', intro: '直接打开对应转换器，预选方向与格式，并加载可编辑样例。',
    format: '此转换器的用途', input: '来源格式', output: '生成产物',
    checks: '使用产物前需要检查的事项', steps: '转换步骤', resources: '继续探索', guide: '阅读转换指南（英文）', all: '全部 Apache Ossie 转换器',
  },
};

export const platformCopy: Record<Locale, Record<string, PlatformCopy>> = {
  en: {
    cube: {
      description: 'Convert Cube YAML bundles to Apache Ossie, or export Ossie models for Cube. Try a three-file example, review diagnostics, edit and download the output.',
      faq: [
        { q: 'Can I import a Cube project folder?', a: 'You can upload a folder containing the supported model definitions while preserving relative paths. Import accepts up to 50 files and 1 MiB of UTF-8 content including paths. Supply the relevant YAML bundle rather than an entire application repository.' },
        { q: 'Does this convert arbitrary Cube JavaScript models?', a: 'This page provides a Cube YAML example and accepts the formats exposed by the deployed source catalog. It is not an arbitrary JavaScript execution environment; use supported model definitions and review the resulting diagnostics.' },
        { q: 'Can I also export Apache Ossie to Cube?', a: 'Yes, select Export from Ossie and choose Cube when that target is available in the catalog. The output needs destination-side import and execution checks before production use.' },
      ],
      guide: '/blog/convert-semantic-models-to-ossie/',
    },
    dbt: {
      description: 'Convert a compiled dbt semantic_manifest.json to Apache Ossie, or export an Ossie model as a MetricFlow manifest. Review and download editable results.',
      faq: [
        { q: 'Can I upload raw dbt YAML?', a: 'The dbt importer expects a compiled semantic_manifest.json. Compile through your dbt workflow first; raw project YAML is not accepted as the equivalent semantic input.' },
        { q: 'Does Ossie export create a complete dbt project?', a: 'No. The dbt target exports a MetricFlow semantic_manifest.json. Retain or separately author the project YAML, model SQL, connection configuration and other files needed to run a dbt project.' },
        { q: 'Does a successful conversion validate my dbt metrics?', a: 'Success reports the offline checks available to the converter. Execute and compare the intended metrics in your own environment before relying on the generated definition.' },
      ],
      guide: '/blog/apache-ossie-converters/',
    },
    omni: {
      description: 'Import Omni views, relationships and topics into Apache Ossie, or export Ossie YAML for Omni. Try a four-file sales bundle and review generated files.',
      faq: [
        { q: 'Which Omni files should I include?', a: 'Supply the related supported views, relationships and topics required by the model. The included example has four files; folder uploads preserve relative paths, subject to the public input limits.' },
        { q: 'Can I choose a particular Omni view or topic?', a: 'Source-specific configuration fields come from the deployed catalog. When view or topic options are available, use them to select the definition you intend to convert.' },
        { q: 'Why does an Omni export contain multiple files?', a: 'The target can separate views, relationships and topics into multiple definitions. A ZIP download preserves those relative paths and includes your current edits.' },
      ],
      guide: '/blog/convert-semantic-models-to-ossie/',
    },
    'power-bi': {
      description: 'Convert offline Power BI BIM JSON to Apache Ossie, or export Ossie definitions as BIM. Inspect native-expression diagnostics before using the output.',
      faq: [
        { q: 'Can I upload a Power BI PBIX report?', a: 'The supported example and input contract use offline BIM JSON. The browser tool does not unpack an arbitrary PBIX file or log in to a live Power BI or Fabric workspace.' },
        { q: 'Will DAX be translated into SQL?', a: 'No general DAX execution or DAX-to-SQL translation is promised. Inspect native-expression diagnostics and verify the intended semantics in your destination runtime.' },
        { q: 'Does this publish a model to Microsoft Fabric?', a: 'No. The export is an offline BIM JSON definition. Configure any required target metadata and validate the file in your destination workflow; the converter does not publish or refresh a live model.' },
      ],
      guide: '/blog/convert-semantic-models-to-ossie/',
    },
    snowflake: {
      description: 'Export Apache Ossie YAML for Snowflake Cortex Analyst. Try the TPC-DS Retail example, inspect metadata diagnostics and download the generated YAML.',
      faq: [
        { q: 'Can I convert a Snowflake Cortex Analyst model back to Ossie?', a: 'There is no general reverse importer for Snowflake Cortex Analyst in this tool. The supported workflow on this page exports Apache Ossie YAML to the Snowflake target.' },
        { q: 'Does this generate CREATE SEMANTIC VIEW SQL?', a: 'This target produces the supported Cortex Analyst YAML representation. It is not a promise to generate or deploy a native Snowflake semantic view through SQL DDL.' },
        { q: 'Why can the Retail example need review?', a: 'Some metadata and model constructs cannot be preserved by every target. Read the reported diagnostics and validate the result in Snowflake before using it.' },
      ],
      guide: '/blog/apache-ossie-converters/',
    },
  },
  zh: {
    cube: {
      description: '将 Cube YAML 文件组导入 Apache Ossie，或将 Ossie 模型导出为 Cube 格式。内置三个文件的样例，支持诊断、编辑与下载。',
      faq: [
        { q: '能否直接上传 Cube 项目文件夹？', a: '可以上传包含受支持模型定义的文件夹，并保留相对路径。每次导入最多 50 个文件，UTF-8 内容与路径合计不超过 1 MiB。请提供相关 YAML 文件组，而不是整个应用代码仓库。' },
        { q: '是否支持任意 Cube JavaScript 模型？', a: '此页提供 Cube YAML 样例，实际接受格式以来源目录为准。工具不是任意 JavaScript 执行环境，请提供支持的模型定义并检查诊断。' },
        { q: '也能从 Apache Ossie 导出为 Cube 吗？', a: '可以切换到“从 Ossie 导出”，在目录提供该目标时选择 Cube。用于生产前，仍需在目标平台验证导入和执行。' },
      ], guide: '/blog/convert-semantic-models-to-ossie/',
    },
    dbt: {
      description: '将已编译的 dbt semantic_manifest.json 导入 Apache Ossie，或将 Ossie 模型导出为 MetricFlow manifest。支持检查、编辑与下载。',
      faq: [
        { q: '可以上传原始 dbt YAML 吗？', a: 'dbt 导入器需要已编译的 semantic_manifest.json。请先通过自己的 dbt 流程编译；原始项目 YAML 不能作为同等的语义输入。' },
        { q: '从 Ossie 导出会创建完整 dbt 项目吗？', a: '不会。dbt 目标导出 MetricFlow semantic_manifest.json。可运行项目所需的 YAML、模型 SQL、连接配置等文件，需要另行保留或编写。' },
        { q: '转换成功是否证明 dbt 指标正确？', a: '成功仅表示通过转换器提供的离线检查。使用生成定义前，请在自己的环境执行并比较所需指标。' },
      ], guide: '/blog/apache-ossie-converters/',
    },
    omni: {
      description: '将 Omni 视图、关联和主题导入 Apache Ossie，或导出为 Omni 模型文件。内置四文件销售样例，支持诊断和多文件下载。',
      faq: [
        { q: '应该提供哪些 Omni 文件？', a: '提供模型所需、且受支持的视图、关联和主题定义。内置样例包含四个文件；文件夹上传保留相对路径，并受公共输入限额约束。' },
        { q: '可以指定某个 Omni view 或 topic 吗？', a: '来源配置字段来自已部署的目录。目录提供 view 或 topic 选项时，可用它们选择准备转换的定义。' },
        { q: '为什么 Omni 导出包含多个文件？', a: '目标可能将视图、关联和主题拆成独立定义。ZIP 下载保留这些相对路径，并包含当前编辑。' },
      ], guide: '/blog/convert-semantic-models-to-ossie/',
    },
    'power-bi': {
      description: '将离线 Power BI BIM JSON 导入 Apache Ossie，或将 Ossie 定义导出为 BIM。使用产物前检查原生表达式诊断与目标平台语义。',
      faq: [
        { q: '可以上传 Power BI PBIX 报表吗？', a: '支持的样例和输入约定使用离线 BIM JSON。浏览器工具不会解包任意 PBIX 文件，也不会登录在线 Power BI 或 Fabric 工作区。' },
        { q: 'DAX 会自动翻译为 SQL 吗？', a: '工具不承诺通用的 DAX 执行或 DAX 转 SQL。请检查原生表达式诊断，并在目标运行时验证语义。' },
        { q: '会把模型发布到 Microsoft Fabric 吗？', a: '不会。导出结果是离线 BIM JSON 定义。请配置目标所需元数据，并在自己的流程中验证文件；转换器不会发布或刷新在线模型。' },
      ], guide: '/blog/convert-semantic-models-to-ossie/',
    },
    snowflake: {
      description: '将 Apache Ossie YAML 导出为 Snowflake Cortex Analyst 格式。试用 TPC-DS Retail 样例，检查元数据诊断并下载生成的 YAML。',
      faq: [
        { q: '能将 Snowflake Cortex Analyst 模型反向导入 Ossie 吗？', a: '此工具没有 Snowflake Cortex Analyst 的通用反向导入器。本页支持的流程是将 Apache Ossie YAML 导出为 Snowflake 目标格式。' },
        { q: '会生成 CREATE SEMANTIC VIEW SQL 吗？', a: '此目标生成支持的 Cortex Analyst YAML，不承诺通过 SQL DDL 创建或部署原生 Snowflake semantic view。' },
        { q: '为什么 Retail 样例可能需要检查？', a: '部分目标无法保留所有元数据与模型结构。请阅读诊断，并在 Snowflake 中验证产物后再使用。' },
      ], guide: '/blog/apache-ossie-converters/',
    },
  },
};
