import { useCallback, useEffect, useRef } from "react";
import "./code-theme.css";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

export default function CodeView({
  code,
  lang,
}: {
  code: string;
  lang: string;
}) {
  const codeRef = useRef<HTMLElement>(null);

  const highlight = useCallback(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, []);

  useEffect(() => {
    highlight();
    // eslint-disable-next-line react-compiler/react-compiler
  }, [code, lang, highlight]);

  return (
    <pre className="p-4 bg-transparent border-none rounded-none m-0 text-sm leading-relaxed">
      <code ref={codeRef} className={`language-${lang} text-sm`}>
        {code}
      </code>
    </pre>
  );
}
