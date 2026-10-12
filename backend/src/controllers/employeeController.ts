import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employeeService';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  listEmployeesQuerySchema,
  employeeIdParamSchema,
} from '../schemas/employeeSchema';

export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  listEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = listEmployeesQuerySchema.parse(req.query);
      const result = await this.employeeService.listEmployees(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = employeeIdParamSchema.parse(req.params);
      const employee = await this.employeeService.getEmployeeById(id);
      res.status(200).json({ data: employee });
    } catch (err) {
      next(err);
    }
  };

  createEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = createEmployeeSchema.parse(req.body);
      const created = await this.employeeService.createEmployee(input);
      res.status(201).json({ data: created });
    } catch (err) {
      next(err);
    }
  };

  updateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = employeeIdParamSchema.parse(req.params);
      const input = updateEmployeeSchema.parse(req.body);
      const updated = await this.employeeService.updateEmployee(id, input);
      res.status(200).json({ data: updated });
    } catch (err) {
      next(err);
    }
  };

  deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = employeeIdParamSchema.parse(req.params);
      await this.employeeService.deleteEmployee(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  getFilters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = await this.employeeService.getFilterOptions();
      res.status(200).json({ data: filters });
    } catch (err) {
      next(err);
    }
  };
}
