import type { CSSProperties, ReactNode } from "react";

type Props = {
  dataKey: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Marks a section image as editable in the visual editor (not project CMS photos). */
export default function EditableMedia({
  dataKey,
  className,
  style,
  children,
}: Props) {
  return (
    <div
      className={className}
      style={style}
      data-key={dataKey}
      data-editable="image"
    >
      {children}
    </div>
  );
}
