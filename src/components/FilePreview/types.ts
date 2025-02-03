export type FileType = 
  | 'image'
  | 'video'
  | 'pdf'
  | 'doc'
  | 'xls'
  | 'ppt'
  | 'txt'
  | 'default';

export interface FileTypeConfig {
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
} 