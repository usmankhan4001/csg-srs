export interface TreeNode {
  name: string;
  path?: string;
  type: "dir" | "file";
  children?: TreeNode[];
  title?: string;
}

export interface SearchHit {
  id: string;
  filePath: string;
  part: string;
  heading: string;
  headingAnchor: string;
  matchType: "id" | "text";
  snippet: string;
}

export interface LookupResult {
  id: string;
  chunkId: string;
  filePath: string;
  heading: string;
  headingAnchor: string;
  part: string;
}

export interface Requirement {
  id: string;
  module: string;
  priority: string;
  statement: string;
  source: string;
  serviceComponent: string;
  screenPrefix: string;
  testCaseId: string;
  chunkId: string;
}

export interface ChatSource {
  id: string;
  filePath: string;
  part: string;
  heading: string;
  headingAnchor: string;
}

export interface Product {
  id: string;
  name: string;
}

export interface AppConfig {
  products: Product[];
  editingEnabled: boolean;
  defaultProduct: string;
}

export interface FileCommit {
  hash: string;
  author: string;
  date: string;
  subject: string;
}

export interface FileResponse {
  path: string;
  content: string;
  history?: FileCommit[];
}

// A request to navigate the center panel.
export interface NavTarget {
  filePath: string;
  anchor?: string;
  highlight?: string;
  idTarget?: string; // exact SRS id to scroll to + flash (e.g. LMS-FR-057)
  nonce?: number;
}
