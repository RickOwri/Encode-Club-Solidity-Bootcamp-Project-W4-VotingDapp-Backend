import { Controller, Get, Param, Post, Body, Query, ForbiddenException } from '@nestjs/common';
import { AppService } from './app.service';
import { DelegateTokenDto, RequestTokenDto, TransferTokenDto, CastVoteDto } from './dtos/requestToken.dto';

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

  @Get('tokenContract-address')
  getTokenContractAddress() {
    return this.appService.getTokenContractAddress();
  }

  @Get('tokenizedBallot-address')
  getTokenizedBallotAddress() {
    return this.appService.getTokenizedBallotAddress();
  }

  @Get('total-supply')
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('balance/:address')
  getBalance(@Param('address') address: string) {
    return this.appService.getBalance(address)
  }

  @Get("receipt")
  getReceipt(@Query('hash') hash: string) {
    return this.appService.getReceipt(hash);
  }

  a: number = 0;

  @Post('transfert-token')
  transfertToken(@Body() body: TransferTokenDto) {
    return this.appService.transfertToken(body.addressReceiver, body.transferedUnits);
  }


  @Get('get-token-number/:address')
  getTokenNumber(@Param('address') address: string) {
    return this.appService.getTokenNumber(address);
  }

  @Post('delegate-tokens')
  delegateTokens(@Body() body: DelegateTokenDto) {
    return this.appService.delegateTokens(body.addressReceiver);
  }

  @Post('request-tokens')
  requestTokens(@Body() body: RequestTokenDto) {
    return this.appService.requestTokens(body.address, body.mintValue);
  }

  @Post('voting-right/:address')
  votingRight(@Param('address') address: string) {
    return this.appService.votingRight(address);
  }


  @Post('cast-vote')
  CastVote(@Body() body: CastVoteDto) {
    return this.appService.CastVote(body.PROPOSAL, body.VOTED_AMOUNT);
  }

}
