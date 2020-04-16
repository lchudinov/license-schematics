import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';

const eol = '\r\n';

const licenseLines = [
  `  This program and the accompanying materials are`,
  `  made available under the terms of the Eclipse Public License v2.0 which accompanies`,
  `  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html`,
  ``,
  `  SPDX-License-Identifier: EPL-2.0`,
  ``,
  `  Copyright Contributors to the Zowe Project.`,
];

const license2Lines = [
  `  This program and the accompanying materials are`,
  `  made available under the terms of the Eclipse Public License v2.0 which accompanies`,
  `  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html`,
  `  `,
  `  SPDX-License-Identifier: EPL-2.0`,
  `  `,
  `  Copyright Contributors to the Zowe Project.`,
];


export function license(_options: any): Rule {
  return chain([
    (tree: Tree, _context: SchematicContext) => {
      if (typeof _options.sourceDir !== 'string') {
        console.error('--sourceDir argument is missing');
        return;
      }
      tree.getDir(_options.sourceDir)
        .visit(filePath => {
          if (!filePath.endsWith('.ts') && !filePath.endsWith('.css') && !filePath.endsWith('.scss') && !filePath.endsWith('.html') && !filePath.endsWith('.yaml')) {
            return;
          }
          const content = tree.read(filePath);
          if (!content) {
            return;
          }

          if (filePath.endsWith('.yaml')) {
            const licenseText = licenseLines.map(line => `#${line}`).join(eol);
            const license2Text = license2Lines.map(line => `#${line}`).join(eol);
            if (content.indexOf(licenseText) == -1 && content.indexOf(license2Text) == -1) {
              const license = licenseText + eol;
              tree.overwrite(
                filePath,
                license + eol + content + eol + eol + license
              );
            }
          } else {
            const licenseText = licenseLines.join(eol);
            const license2Text = license2Lines.join(eol);
            if (content.indexOf(licenseText) == -1 && content.indexOf(license2Text) == -1) {
              let beginComment = '/*'
              let endComment = '*/'
              if (filePath.endsWith('.html')) {
                beginComment = '<!--';
                endComment = '-->';
              }
              const license = beginComment + eol + licenseText + eol + endComment + eol;
              tree.overwrite(
                filePath,
                license + eol + content + eol + eol + license
              );
            }
          }
        });
      return tree;
    },
  ]);
}
