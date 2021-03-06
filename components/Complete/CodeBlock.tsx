import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import vsDarkTheme from "prism-react-renderer/themes/vsDark";
import styled from "styled-components";
import rangeParser from "parse-numeric-range";

const calculateLinesToHighlight = (meta: string) => {
  const RE = /{([\d,-]+)}/;
  if (RE.test(meta)) {
    const strlineNumbers = RE.exec(meta)![1];
    const lineNumbers = rangeParser(strlineNumbers);
    return (index: any) => lineNumbers.includes(index + 1);
  } else {
    return () => false;
  }
};

//USE default JS TEMPLATE
const defaultClassName = "js";

const PrismWrapper: React.FC<any> = (props) => {
  const { className, metastring } = props.children.props;

  const language = className ? className.split("-")[1] : defaultClassName;
  const shouldHighlightLine = calculateLinesToHighlight(metastring);

  return (
    <Highlight
      {...defaultProps}
      code={props.children.props.children.trim()}
      language={language}
      theme={vsDarkTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        return (
          <Pre className={className} style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({
                line,
                key: i,
              });
              if (shouldHighlightLine(i)) {
                lineProps.className = `${lineProps.className} highlight-line`;
              }
              return (
                <Line key={i} {...lineProps}>
                  <LineNo>{i + 1}</LineNo>
                  <LineContent>
                    {line.map((token, key) => (
                      <span
                        {...getTokenProps({
                          token,
                          key,
                        })}
                      />
                    ))}
                  </LineContent>
                </Line>
              );
            })}
          </Pre>
        );
      }}
    </Highlight>
  );
};
const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;
  overflow-x: auto;
  border-radius: var(--radius);

   .highlight-line {
     background-color: rgb(53, 59, 69);
   }

   
   &::-webkit-scrollbar {
     height: 8px;
   }
   &::-webkit-scrollbar-thumb {
     background: rgba(255,255,255,.4);
     border-radius: 4px;
   }
`;

const Line = styled.div`
  display: table-row;
`;

const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`;

const LineContent = styled.span`
  display: table-cell;
`;
export default PrismWrapper;
