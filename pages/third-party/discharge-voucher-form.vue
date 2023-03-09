<template>
    <div v-if="!hasFilledForm" class="w-full h-screen flex justify-center main_bg">
       <div class="w-7/12 h-auto bg-transparent ">
            <h3 class="w-full  font-dmSansBold">Discharge Voucher</h3>
            <div class="content_container">
              <h5>Discharge Voucher</h5>
              <div class="mb-6">
                <div class="beneficiary_details">
                    <div class="beneficiary_name">
                        <span class="heading">
                            Beneficiary
                        </span>
                        <span class="text">
                          {{ beneficiaryName }}
                        </span>
                    </div>
                    <div class="beneficiary_total">
                        <span class="heading">
                            Total Benefit To Be Paid
                        </span>
                        <span class="text amount">
                            N{{ beneficiaryInfo?.totalBenefit}}
                        </span>
                    </div>

                    <div class="beneficiary_name">
                        <span class="heading">
                            Benefits
                        </span>
                        <span class="text flex gap-3">
                            <small v-for="(benefit, index) in benefits" :key="index">{{ benefit.riderName }}</small>
                        </span>
                    </div>
                </div>
              </div>
              <h5>Bank Details(Local)</h5>
              <div class="mb-6 flex justify-between gap-3">
                
                <div class="duplicated_forms_container w-full h-44">
                <div class="forms_content flex flex-col gap-5">
                    <div class="a_form odd flex flex-col gap-3">
                        <label class="font-dmSansMedium text-[#999999]">BVN</label>
                        <input v-model="formContents.bvn" name="bvn" class="text-black bg-[#f6f6f6] border border-[#f6f6f6]" placeholder="Enter BVN" type="text">
                    </div>
                    <div class="a_form even flex flex-col gap-3">
                        <label class="font-dmSansMedium text-[#999999]">Account Name</label>
                        <input v-model="formContents.accountName" name="accountName" class="text-black bg-[#f6f6f6] border border-[#f6f6f6]" placeholder="Enter Amount" type="text">
                        
                    </div>
                </div>
               </div>

               <div class="duplicated_forms_container w-full h-44">
                <div  class="forms_content flex flex-col gap-5">
                    <div class="a_form odd flex flex-col gap-3">
                        <label class="font-dmSansMedium text-[#999999]">Bank </label>
                        <select v-model="formContents.bankName" name="bankname" class="text-black bg-[#f6f6f6] border border-[#f6f6f6]"  type="text" >
                            <option value="" selected>Select Bank</option>
                            <option :value="bank.name" v-for="(bank, index) in banks" :key="index"> {{ bank.name }} </option>
                        </select>
                    </div>
                    <div class="a_form even flex flex-col gap-3">
                        <label class="font-dmSansMedium text-[#999999]">Account Number</label>
                        <input v-model="formContents.accountNo" name="accountNo" class="text-black bg-[#f6f6f6] border border-[#f6f6f6]" placeholder="Enter Amount" type="text" >
                        
                    </div>
                </div>
              </div>

                  
              </div>

              <h5>Acknowledgement of Voucher</h5>
               <div class="acknowledgement_text">
                 <p>
                    I <input v-model="formContents.fullName" name="fullName" type="text" class="w-30 text-black bg-[#f6f6f6] border border-[#f6f6f6]">  hereby agree to be paid the amount of N{{beneficiaryInfo?.totalBenefit}}
                    naira only into the bank details supplied by me. I hereby agree with the terms and condition of this payment. I will not be liable for any I will not be liable for any unforseen circumstances. 
                 </p>
               </div>
            </div>
            <div class="text-right">
                 <button 
                  @click="submitResponse($event)"
                 :disabled="formContents.fullName.length < 2 && formContents.bankName.length < 2 && formContents.accountNo.length < 10 && formContents.accountName.length < 2 && formContents.bvn.length < 11"  class="submit_btn">
                    Submit 
                 </button>
           </div>
       </div>  
         <div :style="isLoading ? { display: 'block' } : {display : 'none'}" class="loading_screen">
          <LoadingScreen />
         </div> 
    </div>
    <div v-else class="w-full h-screen flex justify-center success main_bg">
       <div class="w-7/12 h-auto bg-transparent ">
            <!-- <h3 class="w-full  font-dmSansBold">Garage Request</h3> -->
            <div class="content_container">
              <h5 class="!text-green-400 !text-2xl !font-dmSansMedium">Submission was successful!!</h5>
              <div class="">
                <h6 class="title">
                  Your choice of vendor has been recorded. Thank you for your time.
                </h6>
  
                <div class="form w-full flex gap-4">
                </div>
              </div>
            </div>
            
       </div> 
    </div>
  </template>
  
  <style scoped>

  .main_bg{
    @apply h-auto;
  }

  .success.main_bg{
    @apply h-screen;
  }

h5{
    font-size: 1.35em;
    @apply leading-7 font-dmSansMedium text-[#5f5f5f] border-b-2 border-b-[#dfdfdf] mb-4;
}
      .beneficiary_details{
        @apply flex gap-20;
      }
      .beneficiary_name, .beneficiary_total{
        @apply flex  flex-col;
      }

      .heading{
        font-size: .89rem;
        @apply leading-7 font-dmSansMedium text-[#999999];

      }

      .text{
        font-size: 1.2rem;
        @apply font-semibold text-[#5F5F5F];
      }

      .text.amount{
        @apply text-red-400;
      }

      button:disabled{
        @apply pointer-events-none opacity-40
      }
  </style>
  
  <script lang="ts">
  import { useRoute } from '#imports';
  import { LoadingScreen } from '#components';
  import   apiStrings  from '../../apiStrings';
  import { Benefit, IsAccepted, LookUp, memoHistory } from '~~/thirdPartyModels';
  export default{
    setup(){
      const route = useRoute();
      const formContents = ref({
        bankName: '',
        accountNo: '',
        accountName: '',
        bvn: '',
        fullName: '',
        claimsKey: '',
        isFromThirdParyApp: true
      })
      const beneficiaryName = ref<string>('');
      const beneficiaryInfo = ref<Partial<memoHistory>>({});
      const benefits = ref<Array<Benefit>>([]);
      const isLoading = ref<boolean>(true);
      const hasFilledForm = ref<boolean>(false);
      const banks = ref<LookUp[]>([]);
      const { claimsTrackingNo } = route.query;
      formContents.value.claimsKey = claimsTrackingNo as string;
      const isAccepted = ref<IsAccepted>(IsAccepted.Yes);
      const getBanks = async () => {
        try {
        let res = await fetch(`${apiStrings.baseApi}${apiStrings.lookUps.banks}`);
         res = await res.json();
        banks.value = (res as any).data as LookUp[];
         isLoading.value = false;
        } catch (error) {
          console.log(error);
          isLoading.value = false;
        } 
      };
      const getBeneficiaryInfo = async () => {
        const url = new URL(`${apiStrings.baseApi}${apiStrings.getBeneficiaryInfo}`);
        url.searchParams.append('claimsKey', formContents.value.claimsKey)
        try {
        let res = await fetch(url);
         res = await res.json();
          beneficiaryInfo.value = (res as any).responseData.memoInfo.memo as Partial<memoHistory>;
          benefits.value = (res as any).responseData.memoInfo.benefits as Benefit[];
          beneficiaryName.value = beneficiaryInfo.value.lifeClaimBeneficiaries[0].beneficiaryName;
        } catch (error) {
          console.log(error);
        } 
        finally{
          isLoading.value = false;
        }
      }
      onMounted(async () => {
        formContents.value.claimsKey = claimsTrackingNo as string;
        getBanks();
        getBeneficiaryInfo();
      })
      const submitResponse = async (event: MouseEvent) => {
        const button = event.target as HTMLButtonElement;
        const prevText = button.textContent;
        button.textContent = 'Submitting...';
        isLoading.value = true;
        const url = new URL(`${apiStrings.baseApi}${apiStrings.beneficiaryPaymentDetails}`);
        try {
        const res = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formContents.value)});
        const result = await res.json();
        button.textContent = prevText;
        hasFilledForm.value = true;
        console.log(result);
        } catch (error) {
          console.log(error);
        }
        finally{
          isLoading.value = false;
          
        }
      }
      return{ route, isLoading, banks, submitResponse, beneficiaryName, beneficiaryInfo, benefits, formContents, isAccepted, hasFilledForm };
    },
  
    components: {
      LoadingScreen,
    }
    
  }
  </script>