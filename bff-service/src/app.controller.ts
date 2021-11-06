import {All, BadGatewayException, Controller, Get, HttpStatus, Req, Res} from '@nestjs/common';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly configService: ConfigService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @All('products')
  async processProductRequests(@Req() request: Request, @Res() response: Response): Promise<void> {
    await this.processRequest(request, response, 'products');
  }

  async processRequest(request: Request, response: Response, targetService: string): Promise<void> {
    console.log(`Request ${request.method} to ${request.originalUrl}`);

    const redirectUrl = this.configService.get(`${targetService.toUpperCase()}_SERVICE`);
    console.log(`Redirect url: ${redirectUrl}`);

    if (!redirectUrl) {
      console.error(`No redirect url found for ${targetService}`);
      throw new BadGatewayException('Cannot process request');
    }

    try {
      const serviceResponse = await this.executeRequest(request, redirectUrl);
      console.log(`Service response status code: [${serviceResponse.status}]`);
      response.status(serviceResponse.status).json(serviceResponse.data);
    } catch (e) {
      this.processResponseError(e);
    }
  }

  private async executeRequest(request: Request, redirectUrl) {
    const {body, method, originalUrl} = request;
    const config = {
      method,
      url: `${redirectUrl}${originalUrl}`,
      ...(Object.keys(body).length > 0 && {data: body}),
    } as AxiosRequestConfig;

    return await axios(config);
  }

  private processResponseError(e) {
    if (e.response) {
      e.response.status(e.response.status).json(e.response.data);
    } else {
      e.response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: e.message});
    }
    console.error(`Error response:${e.message}`);
  }
}
