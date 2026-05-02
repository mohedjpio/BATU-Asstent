import { Router } from 'express';
import { handleChat, getBranding } from '../controllers/chat.controller.js';
import { asyncWrap } from '../utils/errorHandler.js';

export const chatRouter = Router();

chatRouter.post('/', asyncWrap(handleChat));
chatRouter.get('/branding', getBranding);
