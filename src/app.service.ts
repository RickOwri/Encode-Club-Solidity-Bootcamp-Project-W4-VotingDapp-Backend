import { Injectable } from '@nestjs/common';
import {ethers} from 'ethers';
import { ConfigService } from '@nestjs/config';
import * as tokenJson from './assets/MyToken.json';
import * as tokenizedBallotJson from './assets/TokenizedBallot.json';


const contractAddressToken = "0x35a24F28f846DB57F13B534799659824A81f31FF"

const contractAddressBallot = "0x9267611856783B54c2d296F3594519bb37BFc63c"
@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    this.provider = new ethers.providers.InfuraProvider('sepolia', apiKey); // Instantiate InfuraProvider using the 'new' keyword

    this.contractBallot = new ethers.Contract(
      tokenJson
    )
    this.contract = new ethers.Contract(
      tokenJson.contractAddress,
      tokenJson.abi,
      this.provider
    );
  }

  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock() : Promise<ethers.providers.Block> {
    // const provider = ethers.getDefaultProvider('sepolia');
    return this.provider.getBlock("latest");
  }

  getContractAddress() {
    const contractAddressToken = this.configService.get<string>('TOKEN_ADDRESS')
    return contractAddressToken
  }

  getTotalSupply() {  
    return this.contract.totalSupply();
  }

  getBalance(address: string) {
    return this.contract.balanceOf(address);
  }

  async getReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const receipt = await tx.wait();
    return receipt;
  }

  async awaitTx(tx: ethers.providers.TransactionResponse)
    {
      return await tx.wait();
    }

  requestTokens(address: string) {

    const pKey = this.configService.get<string>('PRIVATE_KEY_SANGOKU');

    const wallet = new ethers.Wallet(pKey);

    const signer = wallet.connect(this.provider);
    
    return this.contract.connect(signer).mint(address, ethers.utils.parseUnits("1"));
  
  }

}
