import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React from "react";
import rehypeShikiFromHighlighter, {
  type RehypeShikiCoreOptions,
} from "@shikijs/rehype/core";
import { inspect } from "util";

import shikiHighlighter from "../lib/shiki";
import CustomPre from "./custom-pre";

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  pre: (props) => {
    return <CustomPre {...props} />;
  },
  Table,
};

interface MetaValue {
  name: string;
  regex: RegExp;
}

export interface MetaMap {
  title: string;
  displayLineNumbers: boolean | undefined;
  allowCopy: boolean | undefined;
  lang: string | undefined;
  rawCode: string;
}

/**
 * Custom meta string values
 */
const metaValues: MetaValue[] = [
  {
    name: "title",
    regex: /title="(?<value>[^"]*)"/,
  },
  {
    name: "displayLineNumbers",
    regex: /displayLineNumbers="(?<value>true|false)"/,
  },
  {
    name: "allowCopy",
    regex: /allowCopy="(?<value>true|false)"/,
  },
];

export async function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          format: "mdx",
          rehypePlugins: [
            [
              rehypeShikiFromHighlighter,
              await shikiHighlighter,
              {
                themes: {
                  dark: "github-dark",
                  light: "github-light",
                },
                parseMetaString(metaString) {
                  const map: MetaMap = {
                    title: "",
                    displayLineNumbers: undefined,
                    allowCopy: undefined,
                    lang: "txt",
                    rawCode: "",
                  };

                  for (const value of metaValues) {
                    const result = value.regex.exec(metaString);

                    if (result && value.name === "title") {
                      map.title = result?.groups?.value || "";
                    }

                    if (result && value.name === "displayLineNumbers") {
                      map.displayLineNumbers = result.groups?.value === "true";
                    }

                    if (result && value.name === "allowCopy") {
                      map.allowCopy = result.groups?.value === "true";
                    }
                  }

                  return map;
                },
                transformers: [
                  {
                    preprocess(code, options) {
                      const optionsMeta = options.meta as MetaMap;

                      optionsMeta.lang = options.lang || "txt";
                    },
                    line(node, line) {
                      node.properties[
                        "class"
                      ] = `${node.properties["class"]} has-line-number`;
                    },
                  },
                ],
              } as RehypeShikiCoreOptions,
            ],
          ],
        },
      }}
    />
  );
}
