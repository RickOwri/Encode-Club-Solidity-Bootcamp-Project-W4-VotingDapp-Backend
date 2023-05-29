import { Controller, Get, Param, Post, Body, Query, ForbiddenException } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokenDto } from './dtos/requestToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('last-block')
  getLastBlock() {
    return this.appService.getLastBlock();
  }

  @Get('contract-address')
  getContractAddress() {
    return this.appService.getContractAddress();
  }

  @Get('total-supply')
  geTotalSupply() {
    return this.appService.getTotalSupply();
  }

  
  @Get('balance/:address')
  getBalance(@Param('address') address: string) {
    return this.appService.getBalance(address)
  }

  @Get("receipt")
  getReceipt(@Query('hash') hash: string) {
    this.appService.getReceipt(hash);
  }

  a: number = 0;

  @Post('request-tokens')
  requestTokens(@Body() body: RequestTokenDto) {
    // if (!this.appService.checkSig(body.address, body.signature)) throw new ForbiddenException();
    return this.appService.requestTokens(body.address);
  }

}
