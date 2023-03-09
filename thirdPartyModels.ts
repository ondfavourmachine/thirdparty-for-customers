

export interface PreSelectedClaimGarages{
    id: number, garageName: string
}

export interface BaseResponse<T>{
    responseCode: string,
    responseData: T,
    responseMessage: string
}

export interface AppraisalReturnDS{
  vendorId: number,
  claimKey: any,
  userId: string,
  answervalue: 
    {
      appraisalQuestionId: number,
      score: number
    }[]
}

export interface memoHistory{
  id: number,
        claimsId: number,
        policyCoverage: null | string,
        causeOfLoss: string,
        recommendation: null | string,
        beneficiaryMail: null | string,
        beneficiaryName: null | string,
        isDvSentImmediately: boolean
        justificationMemoReference: string,
        riderBenefitId: string,
        dateApproved: string,
        reinsuranceRecovery: null | string,
        percentageToBeRecovered: number,
        amountToBeRecovered: number,
        totalBenefit: number,
        isApproved: boolean,
        rejectionReason: null | string,
        approvedBy: string,
        rejectedBy: string | null,
        lifeClaimBeneficiaries: ABeneficiary[]
}

 export interface ABeneficiary{
  
    id: number,
    claimJustificationMemoId: number,
    beneficiaryMail: string,
    beneficiaryName: string,
    beneficiaryShare: number
  
 }
 export interface Benefit {riderName: string, riderId: number, estimate: number, reserveEstimate: number}[]

export enum IsAccepted{
    Yes="Yes",No="No"
}

export interface LookUp{
  bankCode: '044', id: number, name: string
}

export enum Answer {
    Poor = '20',
    Fair = '40',
    Good = '60',
    VeryGood = '80',
    Excellent = '100'
  }

export interface IClaimEstimateFormat{

        vendorId: number,
        claimsKey: string,
        repairDueDate: string,
        garageEstimateValues: 
          {
            itemName: string,
            itemEstimate: number
          }[]
        

}

export interface IClaimantReply{
    isAccepted: boolean,
    autoGarageId: number,
    claimsKey: string
}



export interface AQuestion{
    question: string,
    questionId: number,
    categoryName: string,
    categoryId: number, 
    answer: any,
  }