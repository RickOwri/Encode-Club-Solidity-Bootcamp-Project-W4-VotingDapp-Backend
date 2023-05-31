import { Injectable } from '@nestjs/common';
import {BigNumber, ethers} from 'ethers';
import { ConfigService } from '@nestjs/config';
import * as tokenJson from './assets/MyToken.json';
import * as tokenizedBallotJson from './assets/TokenizedBallot.json';


const contractAddressToken = "0x35a24F28f846DB57F13B534799659824A81f31FF"

const contractAddressBallot = "0x9267611856783B54c2d296F3594519bb37BFc63c"
@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;
  TokenizedBallotContract: ethers.Contract;
  

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    this.provider = new ethers.providers.InfuraProvider('sepolia', apiKey); // Instantiate InfuraProvider using the 'new' keyword
    const contractAddressToken = this.configService.get<string>('TOKEN_ADDRESS')
    const contractAddressTokenizedBallot = this.configService.get<string>('TOKENIZEDBALLOT_ADDRESS')

    this.tokenContract = new ethers.Contract(
      contractAddressToken,
      tokenJson.abi,
      this.provider
    )
    this.TokenizedBallotContract = new ethers.Contract(
      contractAddressTokenizedBallot,
      tokenizedBallotJson.abi,      
      this.provider
    );
  }

  async awaitTx(tx: ethers.providers.TransactionResponse)
    {
      return await tx.wait();
    }

  formatVotingRight(BN: BigNumber) {
    const BNString = BN.toString();
    const nonBN = ethers.utils.formatUnits(BNString);
    return nonBN
  }

  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock() : Promise<ethers.providers.Block> {
    // const provider = ethers.getDefaultProvider('sepolia');
    return this.provider.getBlock("latest");
  }

  getTokenContractAddress() {
    const contractAddressToken = this.configService.get<string>('TOKEN_ADDRESS')
    return contractAddressToken
  }

  getTokenizedBallotAddress() {
    const contractAddressTokenizedBallot = this.configService.get<string>('TOKENIZEDBALLOT_ADDRESS')
    return contractAddressTokenizedBallot
  }

  async getTotalSupply() {  
    const totalSupplyTx = await this.tokenContract.totalSupply();

    const totalSupply = this.formatVotingRight(totalSupplyTx);

    return totalSupply;
  }

  getBalance(address: string) {
    const balanceTx= this.tokenContract.balanceOf(address);

    return balanceTx;
  }

  async votingRight(address: string) {

    const nextSignerVotingPower2 = await this.TokenizedBallotContract.votingPower(address);
    const votingRight = this.formatVotingRight(nextSignerVotingPower2)
    return votingRight;
  }

  

  async getReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const receipt = await this.awaitTx(tx);
    return receipt;
  }


  requestTokens(address: string, MINT_VALUE:string) {

    const pKey = this.configService.get<string>('PRIVATE_KEY_SANGOKU');

    const wallet = new ethers.Wallet(pKey);

    const signer = wallet.connect(this.provider);
    
    // mint the contract by signer 1
    // self delegate the voting right
    const mintValue = ethers.utils.parseUnits(MINT_VALUE)
    const requestTx = this.tokenContract.connect(signer).mint(address, mintValue);

    return requestTx
  }

  async getTokenNumber(address: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY_SANGOKU');
  
    const wallet = new ethers.Wallet(pKey);
   
    const VotingRightTx = await this.tokenContract.getVotes(address);
    
    const VotingRight =  this.formatVotingRight(VotingRightTx);
    
    return VotingRight;
  }

  async delegateTokens(addressRECEIVER: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY_SANGOKU');
  
    const wallet = new ethers.Wallet(pKey);

    const signer = wallet.connect(this.provider);

    const delegateTx = this.tokenContract.connect(signer).delegate(addressRECEIVER);

    // this.awaitTx(delegateTx);

    return delegateTx

  }

  
  async transfertToken(addressRECEIVER: string, transfertUnits: string) {
    const pKey0 = this.configService.get<string>('PRIVATE_KEY_SANGOKU');
    // const pKey1 = this.configService.get<string>('PRIVATE_KEY_VEGETA');
    
    const wallet = new ethers.Wallet(pKey0);
    // const signer1 = new ethers.Wallet(pKey1);
    const signer0 = wallet.connect(this.provider);
    const transferTxSigner = await this.tokenContract
      .connect(signer0)
      .transfer(
        addressRECEIVER, 
        ethers.utils.parseUnits(transfertUnits)
        );
    const transferTxReceipt = await transferTxSigner.wait();
    const votesAfterTransfer0 = await this.tokenContract.getVotes(signer0.address);
    const votesAfterTransfer1 = await this.tokenContract.getVotes(addressRECEIVER);

    return `vote emiter : ${votesAfterTransfer0}, vote receiver : ${votesAfterTransfer1}`
    // return transferTxReceipt
  }


  async CastVote(PROPOSAL: string, VOTED_AMOUNT: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY_SANGOKU');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider);
    // PROPOSAL string to ethers.utils.parseunit
    const VOTED_AMOUNT_PARSED = ethers.utils.parseUnits(VOTED_AMOUNT)
    const castVote = await this.TokenizedBallotContract.connect(signer).vote(PROPOSAL, VOTED_AMOUNT_PARSED);
    const castVoteReceiptTx = await castVote.wait();
    return castVoteReceiptTx
   }



}
