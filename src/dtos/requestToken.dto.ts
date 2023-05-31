import { ApiProperty } from "@nestjs/swagger";
import { BigNumber } from "ethers";


export class RequestTokenDto {
    @ApiProperty()
    readonly address:string;
    @ApiProperty()
    readonly mintValue:string;
    @ApiProperty()
    readonly signature:string;
    
}

export class DelegateTokenDto {
    @ApiProperty()
    readonly addressReceiver:string;;
}


export class TransferTokenDto {
    @ApiProperty()
    readonly addressReceiver:string;
    @ApiProperty()
    readonly transferedUnits:string;
}

export class CastVoteDto {
    @ApiProperty()
    readonly PROPOSAL:string;
    @ApiProperty()
    readonly VOTED_AMOUNT:string;
}

// export class MintTokenDto {
//     @ApiProperty()
//     readonly TOKEN_NUMBER:string;
// }





