export type ContentKind = 'lesson' | 'question' | 'round' | 'machine-coding' | 'communication';
export type Difficulty = 'foundational' | 'intermediate' | 'advanced' | 'senior';
export interface ContentMeta { id:string; slug:string; title:string; kind:ContentKind; track:string; difficulty:Difficulty; tags:string[]; estimatedMinutes?:number; description?:string; }
export interface StudyItem extends ContentMeta { icon:string; summary:string; sections?:{heading:string; body:string; code?:string}[]; }
export interface StudyState { version:1; completed:Record<string,string>; bookmarked:string[]; notes:Record<string,string>; lastVisited?:string; editorDrafts:Record<string,Record<string,string>>; }
