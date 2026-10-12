import { Router } from 'express';
import { EmployeeController } from '../controllers/employeeController';

export function createEmployeeRouter(controller: EmployeeController): Router {
  const router = Router();

  router.get('/', controller.listEmployees);
  router.post('/', controller.createEmployee);
  router.get('/:id', controller.getEmployee);
  router.put('/:id', controller.updateEmployee);
  router.delete('/:id', controller.deleteEmployee);

  return router;
}
