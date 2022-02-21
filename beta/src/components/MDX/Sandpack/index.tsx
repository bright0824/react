/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import {createFileMap} from './utils';

const SandpackRoot = dynamic(() => import('./SandpackRoot'), {suspense: true});

const SandpackGlimmer = ({code}: {code: string}) => (
  <div className="sandpack-container my-8">
    <div className="shadow-lg dark:shadow-lg-dark rounded-lg">
      <div className="bg-wash h-10 dark:bg-card-dark flex justify-between items-center relative z-10 border-b border-border dark:border-border-dark rounded-t-lg rounded-b-none">
        <div className="px-4 lg:px-6">
          <div className="sp-tabs"></div>
        </div>
        <div className="px-3 flex items-center justify-end grow text-right"></div>
      </div>
      <div className="sp-wrapper">
        <div className="sp-layout sp-custom-layout min-h-[216px]">
          <div className="sp-stack max-h-[406px] h-auto">
            <div className="sp-code-editor">
              <div className="sp-cm sp-pristine overflow-auto">
                <div className="cm-editor">
                  <div>
                    <div className="cm-gutters pl-9 sticky min-h-[192px]">
                      <div className="cm-gutter cm-lineNumbers whitespace-pre sp-pre-placeholder">
                        {code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sp-stack order-last xl:order-2 max-h-[406px] h-auto">
            <div className="p-0 sm:p-2 md:p-4 lg:p-8 bg-card dark:bg-wash-dark h-full relative rounded-b-lg lg:rounded-b-none overflow-auto"></div>
          </div>
          {code.split('\n').length > 16 && (
            <div className="flex h-[42px] text-base justify-between dark:border-card-dark bg-wash dark:bg-card-dark items-center z-10 rounded-t-none p-1 w-full order-2 xl:order-last border-b-1 relative top-0"></div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default React.memo(function SandpackWrapper(props: any): any {
  const codeSnippet = createFileMap(React.Children.toArray(props.children));

  // To set the active file in the fallback we have to find the active file first.
  // If there are no active files we fallback to App.js as default.
  let activeCodeSnippet = Object.keys(codeSnippet).filter(
    (fileName) =>
      codeSnippet[fileName]?.active === true &&
      codeSnippet[fileName]?.hidden === false
  );
  let activeCode;
  if (!activeCodeSnippet.length) {
    activeCode = codeSnippet['/App.js'].code;
  } else {
    activeCode = codeSnippet[activeCodeSnippet[0]].code;
  }

  return (
    <React.Suspense fallback={<SandpackGlimmer code={activeCode} />}>
      <SandpackRoot {...props} />
    </React.Suspense>
  );
});
