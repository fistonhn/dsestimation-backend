import { onError } from "../utils/response";
import {
  validateIdParamas,
  validateProjectIdParamas,
} from "../validators";

class ValidateParams {
  static async isIdPresentAndValid(req, res, next) {
    const { error } = validateIdParamas(req.params.id);
    if (error) {
      return onError(res, 400, error.message);
    }
    next();
  }

  static async isProjectIdPresentAndValid(req, res, next) {
    const { error } = validateProjectIdParamas(req.params.projectId);
    if (error) {
      return onError(res, 400, error.message);
    }
    next();
  }
}

export default ValidateParams;
