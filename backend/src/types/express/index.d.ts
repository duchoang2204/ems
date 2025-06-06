import { User } from "../nvien.interface";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
