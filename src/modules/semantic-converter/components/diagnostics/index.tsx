import type { IIssue } from '../../contracts';
import { ConverterTips } from '../tips';

export function Diagnostics({ issues }: { issues: IIssue[] }) {
  return (
    <div className="sc-diagnostics">
      {issues.map((issue, index) => (
        <ConverterTips key={`${issue.code}-${index}`} type={issue.severity}>
          <p>{issue.message}</p>
          <code>{issue.location || issue.code}</code>
          {issue.remedy && <p>{issue.remedy}</p>}
        </ConverterTips>
      ))}
    </div>
  );
}
