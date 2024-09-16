export interface User {
    password: string;
    email: string;
    Id: number
  }
    
export interface UserDocument extends User, Document {}
 