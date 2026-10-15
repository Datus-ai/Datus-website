import { useMemo } from 'react';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { FileCode2, Folder } from 'lucide-react';
import type { IArtifact } from '../../contracts';
import { useConverterCopy } from '../../copy';
import { ConverterEditor } from '../editor';

function sortNodes(nodes: DataNode[]): DataNode[] {
  nodes.sort(
    (left, right) =>
      Number(Boolean(left.isLeaf)) - Number(Boolean(right.isLeaf)) ||
      String(left.title).localeCompare(String(right.title)),
  );

  for (const node of nodes) {
    if (node.children) {
      sortNodes(node.children);
    }
  }

  return nodes;
}

function fileTree(artifacts: IArtifact[]): DataNode[] {
  const roots: DataNode[] = [];
  const directories = new Map<string, DataNode>();

  for (const file of artifacts) {
    const parts = file.path.split('/');
    let siblings = roots;

    parts.forEach((name, index) => {
      const key = parts.slice(0, index + 1).join('/');
      const directory = index < parts.length - 1;
      let node = directory ? directories.get(key) : undefined;

      if (!node) {
        node = {
          key,
          title: name,
          isLeaf: !directory,
          selectable: !directory,
          icon: directory ? <Folder size={13} /> : <FileCode2 size={12} />,
          ...(directory ? { children: [] } : {}),
        };
        siblings.push(node);

        if (directory) {
          directories.set(key, node);
        }
      }

      siblings = node.children ?? [];
    });
  }

  return sortNodes(roots);
}

export function ResultFiles({
  artifacts,
  selectedPath,
  modelRoot,
  readOnly,
  onSelect,
  onChange,
}: {
  artifacts: IArtifact[];
  selectedPath: string | null;
  modelRoot: string;
  readOnly: boolean;
  onSelect: (path: string) => void;
  onChange: (path: string, value: string) => void;
}) {
  const t = useConverterCopy();
  const nodes = useMemo(() => fileTree(artifacts), [artifacts]);
  const selected = artifacts.find((file) => file.path === selectedPath);
  const editor = (
    <div className="sc-file-editor">
      {selected ? (
        <>
          <div className="sc-file-path">
            <span title={selected.path}>{selected.path}</span>
          </div>
          <div className="sc-output-editor">
            <ConverterEditor
              path={`${modelRoot}/${selected.path}`}
              label={selected.path}
              value={selected.content}
              onChange={(value) => onChange(selected.path, value)}
              readOnly={readOnly}
              language={
                ['json', 'bim'].includes(selected.format)
                  ? 'json'
                  : ['yaml', 'tml'].includes(selected.format)
                    ? 'yaml'
                    : selected.path.endsWith('.sql')
                      ? 'sql'
                      : 'plaintext'
              }
            />
          </div>
        </>
      ) : (
        <div className="sc-empty">{t.no_files}</div>
      )}
    </div>
  );

  return (
    <div className="sc-file-layout">
      {artifacts.length > 1 ? (
        <Allotment proportionalLayout={false}>
          <Allotment.Pane preferredSize={180} minSize={100}>
            <div className="sc-file-tree">
              <div className="sc-files-title">{t.files}</div>
              <Tree
                aria-label={t.files}
                treeData={nodes}
                defaultExpandAll
                showIcon
                blockNode
                selectedKeys={selectedPath ? [selectedPath] : []}
                onSelect={(keys) => {
                  if (keys[0]) {
                    onSelect(String(keys[0]));
                  }
                }}
              />
            </div>
          </Allotment.Pane>
          <Allotment.Pane minSize={200}>{editor}</Allotment.Pane>
        </Allotment>
      ) : (
        editor
      )}
    </div>
  );
}
