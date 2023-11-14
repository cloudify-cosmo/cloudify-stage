import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'cloudify-ui-common-backend';
import type { AllowedRequestMethod } from '../types';
import type { ManagerService } from './services/ManagerService.types';

interface Helper {
    Logger(): Logger;
    Manager: ManagerService;
}

export type BackendService = (req: Request, res: Response, next: NextFunction, helper: Helper) => void;

export interface BackendServiceRegistrator {
    register: (serviceName: string, method: AllowedRequestMethod, service?: string) => void;
}
