
const apiStrings = {
    baseApi: 'http://172.20.5.27/rubypilot/api/v1/',
    fetchPreselectedClaimGarages: 'nonlife/fetch-preSelected-claim-garages',
    sendUpCustomerSelectedAutoGarageVendor: 'nonlife/set-up-claimant-selected-auto-garage',
    sendClaimsEstimateToAxa: 'nonlife/set-up-vendor-claims-estimate',
    uploadFeedbackForm: 'nonlife/upload-auto-garage-feed-back-form',
    verifyMedicalToken: 'policy/validate-medical',
    uploadMedicalForm: 'policy/upload-medicals',
    fetchAppriasalFormValues: 'nonlife/fetch-appraisal-types-values',
    beneficiaryPaymentDetails: 'life/thirdparty/beneficiary-payment-info',
    appraiseAVendor: 'nonlife/appraise-claim-vendor',
    getBeneficiaryInfo: 'life/thirdparty/fetch-info', 
    lookUps: {
        banks: 'banks'
    }
}


export default apiStrings;