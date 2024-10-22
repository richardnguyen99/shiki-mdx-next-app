"use client";
import * as React from "react";

interface Props {
  content: string;
}

const CopyButton: React.FC<Props> = ({ content }) => {
  const [title, setTitle] = React.useState("Copy");
  const [timerId, setTimerId] = React.useState<NodeJS.Timeout | null>(null);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setTitle("Copied!");

      if (timerId) {
        clearTimeout(timerId);
        setTimerId(null);
      }

      setTimerId(
        setTimeout(() => {
          setTitle("Copy");
        }, 2000)
      );
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-2 py-1 rounded-lg bg-slate-500/20 hover:bg-slate-500/40 hover:cursor-pointer"
    >
      {title}
    </button>
  );
};

export default CopyButton;
