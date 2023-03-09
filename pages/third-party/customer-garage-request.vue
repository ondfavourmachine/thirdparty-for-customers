<template>
  <div v-if="!hasFilledForm" class="w-full h-screen flex justify-center main_bg">
     <div class="w-7/12 h-auto bg-transparent ">
          <h3 class="w-full  font-dmSansBold">Garage Request</h3>
          <div class="content_container">
            <h5>Auto Garage Request</h5>
            <div class="">
              <h6 class="title">
                Does Customer Require Axa Registerd Auto Garage?
              </h6>

              <div class="form w-full flex gap-4">
                <div class="first_half flex-shrink pt-5">
                   <div class="flex gap-2 items-center ">
                        <input 
                          v-model="isAccepted" 
                          value="Yes" 
                          id="default-radio-1" type="radio"  
                          name="default-radio" 
                         class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                        <label for="default-radio-1" class=" text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                    </div>
                    <div class="flex items-center gap-2 mt-3">
                        <input 
                          v-model="isAccepted"  
                          value="No"
                          id="default-radio-2" type="radio" 
                          name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                        <label for="default-radio-2" class=" text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                    </div>
                </div>
                <div class="second_half flex-auto">
                     <label for="drop_down_for_garages" class="">Select Auto Garage(s)</label>
                     <select class="bg-[#d5d5d5]" name="" v-model="selectedGarage" id="drop_down_for_garages">
                       <option value="" selected> Choose your preferred garage</option>
                       <option v-for="(garage, index) in preSelectedGarages" :key="index" :value="garage.id"> {{ garage.garageName }} </option>
                     </select>
                </div>
              </div>
            </div>
          </div>
          <div class="text-right">
               <button @click="submitResponse($event)" class="submit_btn">
                  Submit
               </button>
         </div>
     </div>  
       <div :style="isLoading ? { display: 'block' } : {display : 'none'}" class="loading_screen">
        <LoadingScreen />
       </div> 
  </div>
  <div v-else class="w-full h-screen flex justify-center main_bg">
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

  h3{
    font-size: 2.8rem;
    @apply leading-8 mt-9;
  }

  h5{
    font-size: 1.35em;
    @apply leading-7 font-dmSansMedium text-[#5f5f5f] border-b-2 border-b-[#dfdfdf] mb-4;
  }

  .title{
    font-size: 0.9em;
    @apply leading-8 font-dmSansMedium text-[#5f5f5f];
  }


  .first_half{
    width: 3em;
  }

  .second_half{
    @apply flex gap-4 pt-2
  }
  

  .second_half label{
    font-size: 0.9em;
    color: #a4a4a4;
    @apply flex-auto text-right mt-3
  }

  .second_half select{
    color: #4976ba;
    @apply flex-auto border h-12 border-[#a4a4a4] focus:border-[#a4a4a4] focus:border-2 focus:ring-0;
  }

  

  
</style>

<script lang="ts">
import { useRoute } from '#imports';
import { LoadingScreen } from '#components';
import   apiStrings  from '../../apiStrings';
import { PreSelectedClaimGarages, IsAccepted, IClaimantReply, BaseResponse } from '~~/thirdPartyModels';
export default{
  setup(){
    const route = useRoute();
    const isLoading = ref<boolean>(true);
    const hasFilledForm = ref<boolean>(false);
    const preSelectedGarages = ref<PreSelectedClaimGarages[]>([]);
    const { claimTrackingNumber } = route.query;
    const selectedGarage = ref<any>();
    const isAccepted = ref<IsAccepted>(IsAccepted.Yes);
    onMounted(async () => {
      try {
      let res = await fetch(`${apiStrings.baseApi}${apiStrings.fetchPreselectedClaimGarages}?claimsKey=${claimTrackingNumber}`);
       res = await res.json();
     preSelectedGarages.value = (res as any).responseData.garageLists as PreSelectedClaimGarages[];
     isLoading.value = false;
      } catch (error) {
        console.log(error);
        isLoading.value = false;
      } 
    })
    const submitResponse = async (event: PointerEvent) => {
      const button = event.target as HTMLButtonElement;
      const prevText = button.textContent;
      button.textContent = 'Submitting...';
      isLoading.value = true;
      const objToSubmit: Partial<IClaimantReply> = {
        isAccepted: isAccepted.value == 'Yes' ? true : false,
        autoGarageId: selectedGarage.value,
        claimsKey: claimTrackingNumber as string,
      }
      console.log(objToSubmit);
      try {
        const init: RequestInit = {
          method: 'POST',
          body: JSON.stringify(objToSubmit),
          headers: {
            'content-type': 'application/json'
          }
        }
        let response = await fetch(`${apiStrings.baseApi}${apiStrings.sendUpCustomerSelectedAutoGarageVendor}`, init);
        response = await response.json();
        isLoading.value = false;
        button.textContent = prevText;
        console.log((response as unknown as  BaseResponse<Record<string, any>>).responseData)
        hasFilledForm.value = true;
      } catch (error) {
        console.log(error);
      }
    }
    return{ route, isLoading, preSelectedGarages, selectedGarage, submitResponse, isAccepted, hasFilledForm };
  },

  components: {
    LoadingScreen,
  }
  
}
</script>