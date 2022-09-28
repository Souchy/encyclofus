import {RawSourceMap} from 'source-map';
declare function modifyCode(code: string, filePath?: string): ModifyCode;
export default modifyCode;

interface ModifyCode {
  prepend(str: string): ModifyCode;
  append(str: string): ModifyCode;
  insert(start: number, str: string): ModifyCode;
  replace(start: number, end: number, str: string): ModifyCode;
  delete(start: number, end: number): ModifyCode;
  transform(): ModifyCodeResult;
  transformCodeOnly(): string;
}

export interface ModifyCodeResult {
  code: string;
  map: RawSourceMap;
}
