import type { Locale } from '../../../i18n/config';
import type { FaqItem } from '../../../components/FAQ';
import { platformCopy } from './platforms';

interface FlowCopy { title: string; description: string; faq: FaqItem[] }
export const flowCopy: Record<Locale, Record<string, FlowCopy>> = {
  en: {
    'cube-to-ossie': {
      title: 'Cube to Apache Ossie Converter',
      description: 'Import Cube YAML models into Apache Ossie. Start with a three-file commerce bundle, review model diagnostics, edit and download the generated definition.',
      faq: platformCopy.en.cube.faq,
    },
    'ossie-to-cube': {
      title: 'Apache Ossie to Cube Converter',
      description: 'Export Apache Ossie YAML as Cube model definitions. Inspect joins, dimensions and measures, edit generated files and download a model bundle for review.',
      faq: [
        { q: 'What source does the Ossie-to-Cube converter accept?', a: 'Start with an Apache Ossie YAML model, including supported Dosi extensions. The prefilled sales fixture lets you inspect the source before uploading your own definition. The deployed target catalog determines available output options.' },
        { q: 'Does a Cube export include serving and caching configuration?', a: 'The tool converts supported semantic definitions. It does not configure Cube serving, caching, connection credentials or deployment. Review the output, add the environment configuration your Cube project requires and verify representative queries.' },
        { q: 'How do I download multiple generated Cube files?', a: 'Use Download Locally for a ZIP that preserves relative paths and includes your current edits. Review the diagnostics and the destination model before replacing existing Cube definitions.' },
      ],
    },
    'dbt-to-ossie': {
      title: 'dbt to Apache Ossie Converter',
      description: 'Import a compiled dbt semantic_manifest.json into Apache Ossie. Try an editable manifest fixture, review conversion diagnostics and download Ossie YAML.',
      faq: platformCopy.en.dbt.faq,
    },
    'ossie-to-dbt': {
      title: 'Apache Ossie to dbt MetricFlow Converter',
      description: 'Export Apache Ossie YAML as a dbt MetricFlow semantic_manifest.json. Try the NVIDIA Sales fixture and inspect the generated manifest before using it.',
      faq: [
        { q: 'Which file does the Ossie-to-dbt target generate?', a: 'The dbt MetricFlow Manifest target produces semantic_manifest.json. It does not generate the original YAML files, SQL models or connection configuration of a runnable dbt project.' },
        { q: 'Can the NVIDIA Sales example be exported to a dbt manifest?', a: 'The workbench provides it as an Apache Ossie export fixture with ANSI_SQL and Snowflake expressions and a ratio metric. Convert the current snapshot, then inspect the target diagnostics and generated JSON.' },
        { q: 'Will exporting a manifest run MetricFlow?', a: 'No. Conversion performs the available offline checks without starting dbt or MetricFlow or querying a warehouse. Validate the manifest against the versions and metric workflows in your own environment.' },
      ],
    },
    'omni-to-ossie': {
      title: 'Omni to Apache Ossie Converter',
      description: 'Import Omni views, relationships and topics into Apache Ossie. Try the four-file sales example, keep relative paths and review the converted model.',
      faq: platformCopy.en.omni.faq,
    },
    'ossie-to-omni': {
      title: 'Apache Ossie to Omni Converter',
      description: 'Export Apache Ossie YAML as Omni views, relationships and topics. Try the Omni Sales fixture, inspect multi-file output and download an editable ZIP.',
      faq: [
        { q: 'What does an Ossie-to-Omni export contain?', a: 'The target can produce separate view, relationship and topic files. The included Omni Sales source is an Apache Ossie model; inspect the generated file tree and diagnostics to see the output contract for your model.' },
        { q: 'Does exporting an Omni model publish it to my account?', a: 'No. The tool generates downloadable model files without authenticating to Omni or publishing a project. Apply the files through your own destination workflow and verify the resulting model.' },
        { q: 'How should I review SQL in an Omni export?', a: 'Inspect the expressions available in the source model and select a preferred existing dialect where offered. Conversion does not translate warehouse SQL, so verify the generated definitions and representative queries against your warehouse.' },
      ],
    },
    'power-bi-to-ossie': {
      title: 'Power BI to Apache Ossie Converter',
      description: 'Import offline Power BI model.bim JSON into Apache Ossie. Try a BIM fixture and review native-expression diagnostics before using the generated YAML.',
      faq: platformCopy.en['power-bi'].faq,
    },
    'ossie-to-power-bi': {
      title: 'Apache Ossie to Power BI Converter',
      description: 'Export Apache Ossie definitions as offline Power BI / Microsoft Fabric BIM JSON. Review target metadata, inspect generated files and validate the model.',
      faq: [
        { q: 'What format does the Ossie-to-Power-BI converter export?', a: 'The Microsoft Power BI / Fabric target exports offline BIM JSON. It does not create a PBIX report or publish a live Fabric semantic model.' },
        { q: 'Which Power BI target settings are required?', a: 'The deployed target catalog supplies the required fields. Fill in the metadata shown by the workbench before converting, then check the generated model against your destination environment.' },
        { q: 'Does a BIM export prove native measures are equivalent?', a: 'No. Review any expression and compatibility diagnostics, validate the BIM definition in your target workflow and compare representative measures. The converter does not execute DAX or refresh the model.' },
      ],
    },
    'ossie-to-snowflake': {
      title: 'Apache Ossie to Snowflake Converter',
      description: platformCopy.en.snowflake.description,
      faq: platformCopy.en.snowflake.faq,
    },
  },
  zh: {
    'cube-to-ossie': { title: 'Cube 转 Apache Ossie 语义模型转换器', description: '将 Cube YAML 模型导入 Apache Ossie。试用三个文件的电商样例，检查模型诊断，编辑并下载生成的定义。', faq: platformCopy.zh.cube.faq },
    'ossie-to-cube': {
      title: 'Apache Ossie 转 Cube 语义模型转换器', description: '将 Apache Ossie YAML 导出为 Cube 模型定义。检查关联、维度和度量，编辑生成文件并下载模型文件组。',
      faq: [
        { q: 'Ossie 转 Cube 接受什么来源文件？', a: '以 Apache Ossie YAML 模型为输入，可包含支持的 Dosi 扩展。预填充销售样例便于先检查输入，再上传自己的定义。实际输出选项由已部署的目标目录决定。' },
        { q: 'Cube 导出是否包含服务与缓存配置？', a: '工具转换支持的语义定义，不会配置 Cube 服务、缓存、连接凭据或部署。请检查产物，补充自己的 Cube 项目所需环境配置，并验证代表性查询。' },
        { q: '如何下载生成的多个 Cube 文件？', a: '选择“下载到本地”，通过 ZIP 保留相对路径和当前编辑。替换现有 Cube 定义前，请检查诊断与目标模型。' },
      ],
    },
    'dbt-to-ossie': { title: 'dbt 转 Apache Ossie 语义模型转换器', description: '将已编译的 dbt semantic_manifest.json 导入 Apache Ossie。试用可编辑 manifest 样例，检查诊断并下载 Ossie YAML。', faq: platformCopy.zh.dbt.faq },
    'ossie-to-dbt': {
      title: 'Apache Ossie 转 dbt MetricFlow 转换器', description: '将 Apache Ossie YAML 导出为 dbt MetricFlow semantic_manifest.json。试用 NVIDIA Sales 样例，并在使用前检查生成的 manifest。',
      faq: [
        { q: 'Ossie 转 dbt 目标会生成什么文件？', a: 'dbt MetricFlow Manifest 目标生成 semantic_manifest.json，不会生成可运行 dbt 项目所需的原始 YAML、SQL 模型或连接配置。' },
        { q: 'NVIDIA Sales 样例能导出为 dbt manifest 吗？', a: '工作台提供该 Apache Ossie 导出样例，包含 ANSI_SQL、Snowflake 表达式和比率指标。请转换当前快照，再检查目标诊断与生成的 JSON。' },
        { q: '导出 manifest 会运行 MetricFlow 吗？', a: '不会。转换执行已有离线检查，不启动 dbt 或 MetricFlow，也不查询数仓。请针对自己环境的版本与指标流程验证 manifest。' },
      ],
    },
    'omni-to-ossie': { title: 'Omni 转 Apache Ossie 语义模型转换器', description: '将 Omni 视图、关联和主题导入 Apache Ossie。试用四文件销售样例，保留相对路径并检查转换后的模型。', faq: platformCopy.zh.omni.faq },
    'ossie-to-omni': {
      title: 'Apache Ossie 转 Omni 语义模型转换器', description: '将 Apache Ossie YAML 导出为 Omni 视图、关联和主题。试用 Omni Sales 样例，检查多文件结果并下载可编辑 ZIP。',
      faq: [
        { q: 'Ossie 转 Omni 的结果包含什么？', a: '目标可以生成独立的视图、关联和主题文件。内置 Omni Sales 来源是 Apache Ossie 模型，请查看生成文件树与诊断，了解当前模型的输出结构。' },
        { q: '导出 Omni 模型会发布到我的账号吗？', a: '不会。工具生成可下载的模型文件，不登录 Omni，也不发布项目。请通过自己的目标流程应用文件并验证结果。' },
        { q: '如何检查 Omni 导出中的 SQL？', a: '检查来源已有的表达式，并在提供方言选项时选择所需表达式。转换不进行数仓 SQL 翻译，请在自己的数仓验证生成定义与代表性查询。' },
      ],
    },
    'power-bi-to-ossie': { title: 'Power BI 转 Apache Ossie 语义模型转换器', description: '将离线 Power BI model.bim JSON 导入 Apache Ossie。试用 BIM 样例，并在使用生成 YAML 前检查原生表达式诊断。', faq: platformCopy.zh['power-bi'].faq },
    'ossie-to-power-bi': {
      title: 'Apache Ossie 转 Power BI 语义模型转换器', description: '将 Apache Ossie 定义导出为离线 Power BI / Microsoft Fabric BIM JSON。检查目标元数据、生成文件并验证模型。',
      faq: [
        { q: 'Ossie 转 Power BI 会导出什么格式？', a: 'Microsoft Power BI / Fabric 目标导出离线 BIM JSON，不会创建 PBIX 报表或发布在线 Fabric 语义模型。' },
        { q: '哪些 Power BI 目标配置是必填项？', a: '已部署的目标目录提供必填字段。请先填写工作台显示的元数据，再执行转换，并针对目标环境核对生成模型。' },
        { q: 'BIM 导出能证明原生度量语义一致吗？', a: '不能。请阅读表达式与兼容性诊断，在目标流程验证 BIM 定义，并比较代表性度量。转换器不会执行 DAX 或刷新模型。' },
      ],
    },
    'ossie-to-snowflake': { title: 'Apache Ossie 转 Snowflake 语义模型转换器', description: platformCopy.zh.snowflake.description, faq: platformCopy.zh.snowflake.faq },
  },
};
