import { parseDocument } from 'yaml';

export const MAX_SOURCE_BYTES = 1_048_576;

interface ISourceInfo {
  models: string[];
  datasets: string[];
  dialects: string[];
}

export function inspectSource(source: string, modelName?: string): ISourceInfo {
  const empty = {
    models: [] as string[],
    datasets: [] as string[],
    dialects: [] as string[],
  };

  if (new TextEncoder().encode(source).length > MAX_SOURCE_BYTES) {
    return empty;
  }

  try {
    const root = parseDocument(source).toJS({ maxAliasCount: 0 });
    const wrapped = root?.semantic_model;
    const models = wrapped
      ? Array.isArray(wrapped)
        ? wrapped
        : [wrapped]
      : [root];
    const model =
      models.find((item) => item?.name === modelName) ??
      (models.length === 1 ? models[0] : null);
    const datasets = Array.isArray(model?.datasets) ? model.datasets : [];
    const expressions = [
      ...datasets.flatMap((item: any) => item.fields ?? []),
      ...(model?.metrics ?? []),
    ];

    return {
      models: models
        .map((item) => item?.name)
        .filter((name): name is string => typeof name === 'string'),
      datasets: datasets
        .map((item: any) => item.name)
        .filter((name: unknown): name is string => typeof name === 'string'),
      dialects: [
        ...new Set<string>(
          expressions
            .flatMap((item: any) =>
              (item.expression?.dialects ?? []).map(
                (entry: any) => entry.dialect,
              ),
            )
            .filter(
              (name: unknown): name is string => typeof name === 'string',
            ),
        ),
      ],
    };
  } catch {
    // Backend returns structured diagnostics for invalid/ambiguous documents.
    return empty;
  }
}
