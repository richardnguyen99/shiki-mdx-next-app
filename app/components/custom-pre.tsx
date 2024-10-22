import * as React from "react";

import CopyButton from "./copy-button";

export interface MetaMap {
  title: string;
  lang: string | undefined;
  rawCode: string;
}

type BlogCodeProps = React.PropsWithChildren<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  > &
    MetaMap
>;

const CustomPre: React.FC<BlogCodeProps> = ({
  title,
  children,
  lang,
  rawCode,
  ...rest
}) => {
  return (
    <pre {...rest}>
      <div className="flex items-center justify-between ">
        <div>{title && title.length > 0 ? title : lang}</div>
        <CopyButton content={rawCode} />
      </div>
      <div className="w-full overflow-x-auto">{children}</div>
    </pre>
  );
};

export default CustomPre;
