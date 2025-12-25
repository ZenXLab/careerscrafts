import { RenderElementProps } from "slate-react";
import { BULLET_STYLES, TYPOGRAPHY } from "@/types/slate";

interface SlateElementProps extends RenderElementProps {
  accentColor?: string;
}

const SlateElement = ({ attributes, children, element, accentColor = "#2563eb" }: SlateElementProps) => {
  const baseTextStyle: React.CSSProperties = {
    direction: "ltr",
    textAlign: "left",
    unicodeBidi: "embed",
  };

  switch (element.type) {
    case "header":
      return (
        <h1
          {...attributes}
          style={{
            ...baseTextStyle,
            ...TYPOGRAPHY.name,
            color: "#111827",
            marginBottom: "4px",
          }}
        >
          {children}
        </h1>
      );

    case "section-title":
      return (
        <h2
          {...attributes}
          style={{
            ...baseTextStyle,
            ...TYPOGRAPHY.section,
            color: accentColor,
            borderBottom: `2px solid ${accentColor}`,
            paddingBottom: "4px",
            marginBottom: "8px",
            letterSpacing: "0.05em",
          }}
        >
          {children}
        </h2>
      );

    case "paragraph":
      return (
        <p
          {...attributes}
          style={{
            ...baseTextStyle,
            ...TYPOGRAPHY.body,
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          {children}
        </p>
      );

    case "bullet-list":
      return (
        <ul
          {...attributes}
          style={{
            ...baseTextStyle,
            listStyle: "none",
            padding: 0,
            margin: "4px 0",
          }}
        >
          {children}
        </ul>
      );

    case "bullet":
      const bulletChar = BULLET_STYLES[element.bulletStyle] || BULLET_STYLES.dot;
      return (
        <li
          {...attributes}
          style={{
            ...baseTextStyle,
            ...TYPOGRAPHY.bullet,
            color: "#374151",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <span
            contentEditable={false}
            style={{
              color: accentColor,
              flexShrink: 0,
              userSelect: "none",
            }}
          >
            {bulletChar}
          </span>
          <span style={{ flex: 1 }}>{children}</span>
        </li>
      );

    case "experience-entry":
      return (
        <div
          {...attributes}
          style={{
            ...baseTextStyle,
            marginBottom: "12px",
          }}
        >
          {children}
        </div>
      );

    case "experience-role":
      return (
        <div
          {...attributes}
          style={{
            ...baseTextStyle,
            fontWeight: 700,
            fontSize: "12px",
            color: "#111827",
          }}
        >
          {children}
        </div>
      );

    case "experience-company":
      return (
        <div
          {...attributes}
          style={{
            ...baseTextStyle,
            fontWeight: 500,
            fontSize: "11px",
            color: "#374151",
          }}
        >
          {children}
        </div>
      );

    case "experience-date":
      return (
        <span
          {...attributes}
          style={{
            ...baseTextStyle,
            fontSize: "9px",
            color: "#6B7280",
            fontWeight: 500,
          }}
        >
          {children}
        </span>
      );

    case "experience-location":
      return (
        <span
          {...attributes}
          style={{
            ...baseTextStyle,
            fontSize: "9px",
            color: "#6B7280",
          }}
        >
          {children}
        </span>
      );

    case "skill-group":
      return (
        <div
          {...attributes}
          style={{
            ...baseTextStyle,
            marginBottom: "8px",
          }}
        >
          <span
            contentEditable={false}
            style={{
              fontWeight: 600,
              fontSize: "9px",
              color: "#374151",
              minWidth: "80px",
              display: "inline-block",
            }}
          >
            {element.title}:
          </span>
          <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "4px" }}>
            {children}
          </span>
        </div>
      );

    case "skill-item":
      return (
        <span
          {...attributes}
          style={{
            ...baseTextStyle,
            padding: "2px 8px",
            fontSize: "8px",
            borderRadius: "4px",
            backgroundColor: `${accentColor}15`,
            color: "#374151",
          }}
        >
          {children}
        </span>
      );

    case "education-entry":
      return (
        <div
          {...attributes}
          style={{
            ...baseTextStyle,
            fontSize: "10px",
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          {children}
        </div>
      );

    case "section":
      return (
        <section
          {...attributes}
          style={{
            ...baseTextStyle,
            marginBottom: "16px",
          }}
          data-section-type={element.sectionType}
        >
          {children}
        </section>
      );

    default:
      return (
        <p {...attributes} style={baseTextStyle}>
          {children}
        </p>
      );
  }
};

export default SlateElement;
