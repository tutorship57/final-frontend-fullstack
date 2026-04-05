export interface Board {
  id: string;
  title: string;
  // Don't forget the new field we just created in the backend!
  taskCount: number; 
  
  // Looking at your ERD, you might also want these eventually:
  background_url?: string; 
  workspace_id?: string;
}