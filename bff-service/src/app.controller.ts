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

  @All('products')
  async processProductRequests(@Req() request: Request, @Res() response: Response): Promise<void> {
    let isCachable = request.method === 'GET';
    const cachedResponse = this.appService.getDataFromCache();
    if (cachedResponse && isCachable) {
      console.log(`Products response from cache: ${JSON.stringify(cachedResponse)}`);
      response.json(cachedResponse);
      return;
    }
    await this.processRequest(request, response, 'products', isCachable);
  }

  @All('cart')
  async handleCartRequests(@Req() request: Request, @Res() response: Response): Promise<void> {
    await this.processRequest(request, response, 'cart', false);
  }

  @All(['/:recipient', '/:recipient/:id'])
  handleRestRequests(@Req() request: Request): void {
    console.warn(`Service request not supported: ${request.originalUrl}`);
    throw new BadGatewayException('Cannot process request');
  }

  async processRequest(request: Request, response: Response, targetService: string, isCachable: boolean): Promise<void> {
    console.log(`Request ${request.method} to ${request.originalUrl}`);

    const redirectUrl = this.configService.get(`${targetService.toUpperCase()}_SERVICE`);
    console.log(`Redirect url: ${redirectUrl}`);

    if (!redirectUrl) {
      console.error(`No redirect url found for ${targetService}`);
      throw new BadGatewayException('Cannot process request');
    }

    try {
      const serviceResponse = await this.executeRequest(request, redirectUrl);
      if (isCachable) {
        this.appService.setCacheForData(serviceResponse.data);
      }
      console.log(`Service response status code: [${serviceResponse.status}]`);
      response.status(serviceResponse.status).json(serviceResponse.data);
    } catch (e) {
      this.processResponseError(e, response);
    }
  }

  private async executeRequest(request: Request, redirectUrl: String) {
    const {body, method, originalUrl} = request;
    const config = {
      method,
      url: `${redirectUrl}${originalUrl}`,
      ...(Object.keys(body).length > 0 && {data: body}),
    } as AxiosRequestConfig;
    console.log(`Request config: ${JSON.stringify(config)}`);

    return await axios(config);
  }

  private processResponseError(e, response: Response) {
    console.error(`Error response:${e.message}`);
    if (e.response) {
      response.status(e.response.status).json(e.response.data);
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: e.message});
    }
  }
}
