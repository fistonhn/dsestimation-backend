import { onError } from "../utils/response";

export default class Role {
  static isOwner(req, res, next) {
    const role = req.user.role;
    // check if user is owner
    if (role !== "owner") {
      return onError(res, 403, "Forbidden");
    }
    next();
  }
  static isManager(req, res, next) {
    const role = req.user.role;
    // check if user is manager
    if (role !== "manager") {
      return onError(res, 403, "Forbidden");
    }
    next();
  }
  static isAdmin(req, res, next) {
    const role = req.user.role;
    // check if user is admin
    if (role !== "admin" && role !== "manager") {
      return onError(res, 403, "Forbidden");
    }
    next();
  }
}
