import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';

const licenseText = `
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
`
export function license(_options: any): Rule {
  return chain([
    (tree: Tree, _context: SchematicContext) => {
      tree.getDir(_options.sourceDir)
        .visit(filePath => {
          if (!filePath.endsWith('.ts') || !filePath.endsWith('.css') || !filePath.endsWith('.html')) {
            return;
          }
          const content = tree.read(filePath);
          if (!content) {
            return;
          }
          let beginComment = '/*'
          let endComment = '*/'
          // Prevent from writing license to files that already have one.
          if (content.indexOf(licenseText) == -1) {
            if (filePath.endsWith('.html')) {
              beginComment = '<!--';
              endComment = '-->';
            }
            tree.overwrite(filePath, beginComment + licenseText + content + licenseText + endComment + '\n');
          }
        });
      return tree;
    },
  ]);
}
