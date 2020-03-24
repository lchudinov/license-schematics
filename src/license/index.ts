import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';

const eol = '\r\n';

const licenseText = [
  `  This program and the accompanying materials are`,
  `  made available under the terms of the Eclipse Public License v2.0 which accompanies`,
  `  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html`,
  ``,
  `  SPDX-License-Identifier: EPL-2.0`,
  ``,
  `  Copyright Contributors to the Zowe Project.`,
].join(eol);

const license2Text = [
  `  This program and the accompanying materials are`,
  `  made available under the terms of the Eclipse Public License v2.0 which accompanies`,
  `  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html`,
  `  `,
  `  SPDX-License-Identifier: EPL-2.0`,
  `  `,
  `  Copyright Contributors to the Zowe Project.`,
].join(eol);
export function license(_options: any): Rule {
  return chain([
    (tree: Tree, _context: SchematicContext) => {
      if (typeof _options.sourceDir !== 'string') {
        console.error('--sourceDir argument is missing');
        return;
      }
      tree.getDir(_options.sourceDir)
        .visit(filePath => {
          if (!filePath.endsWith('.ts') && !filePath.endsWith('.css') && !filePath.endsWith('.scss') && !filePath.endsWith('.html')) {
            return;
          }
          const content = tree.read(filePath);
          if (!content) {
            return;
          } else {
          }
          let beginComment = '/*'
          let endComment = '*/'
          // Prevent from writing license to files that already have one.
          if (content.indexOf(licenseText) == -1 && content.indexOf(license2Text) == -1) {
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
        });
      return tree;
    },
  ]);
}
