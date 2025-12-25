import { RenderLeafProps } from "slate-react";

interface SlateLeafProps extends RenderLeafProps {
  accentColor?: string;
}

const SlateLeaf = ({ attributes, children, leaf, accentColor = "#2563eb" }: SlateLeafProps) => {
  let styledChildren = children;

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }

  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }

  if (leaf.accent) {
    styledChildren = (
      <span style={{ color: accentColor }}>
        {styledChildren}
      </span>
    );
  }

  if (leaf.muted) {
    styledChildren = (
      <span className="text-gray-500">
        {styledChildren}
      </span>
    );
  }

  return (
    <span 
      {...attributes}
      style={{
        direction: "ltr",
        textAlign: "left",
        unicodeBidi: "embed",
      }}
    >
      {styledChildren}
    </span>
  );
};

export default SlateLeaf;
