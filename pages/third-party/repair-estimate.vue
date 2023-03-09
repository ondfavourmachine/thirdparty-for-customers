
<style scoped>
 
.claim-details_repair-date{
    @apply w-full flex gap-44 items-center;
}

.claim-details_repair-date h5{
    @apply w-5/12 flex justify-between py-1 items-center pr-2;
}

.claim-details_repair-date .repair-date{
    @apply w-7/12;
}

.add_more_claims_details{
    font-size: .8em;
    @apply bg-[#d5d5d5] text-[#333333] flex gap-2 items-center rounded px-2 py-1;
}

.repair-date{
    @apply self-start flex items-center justify-between;
}

.repair-date input{
    @apply w-[54.5%] h-full rounded-sm;
}

.repair-date label{
    font-size: .95em;
    @apply font-dmSansRegular text-[#999999];
}

.duplicated_forms_container{
 @apply mt-5;
}

.forms_content{
    @apply w-full flex gap-6 my-3;
}

.a_form{
    @apply flex flex-col gap-3;
}

.odd{
    @apply w-9/12;
}
.even{
    @apply w-3/12 relative;
}

.even img{
    @apply transition-all absolute top-12 -right-6 cursor-pointer hover:scale-110;
}
.a_form label{
    @apply text-[#999999];
}
.a_form input{
    @apply w-full h-full rounded-sm border border-[#d5d5d5] bg-[#f6f6f6]
}

</style>


<template>
   <div v-if="!hasFilledForm" class="w-full h-screen flex justify-center main_bg">
     <div class="w-7/12 h-auto bg-transparent ">
          <h3 class="w-full  font-dmSansBold">Claim Estimate</h3>
          <div class="content_container !pl-8 !pr-12"> 
            <div class="claim-details_repair-date">
                 <h5 class="">Input Claim Details   <button @click="addToForms" class="add_more_claims_details"> <img src="../../assets/images/add_btn.svg" alt=""> Add</button></h5>
                 <div class="repair-date">
                        <label for="default-text" class=" text-sm font-medium text-gray-900 dark:text-gray-300">Repair Due Date</label>
                        <input  v-model="defaultDate" :min="todaysDate"  id="default-text" :placeholder="defaultDate" type="date"  
                         name="default-text" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">         
                </div>
            </div>
            <div class="duplicated_forms_container">
                <div v-for="(item, index) in forms" :key="index" class="forms_content">
                    <div class="a_form odd">
                        <label :for="'item_name' + index">Item Name</label>
                        <input placeholder="Enter Item Name" type="text" v-model="item.item_name" name="" :id="'item_name' + index">
                    </div>
                    <div class="a_form even">
                        <label :for="'estimate' + index">Estimate</label>
                        <input placeholder="Enter Amount" type="text" v-model="item.cost_estimate" name="" :id="'estimate' + index">
                        <img @click="deleteAnItem(index)" v-if="index > 0" src="../../assets/images/cancel_button.svg" alt="">
                    </div>
                </div>
            </div>
          </div>

          <div class="text-right">
               <button @click="submitClaimEstimate($event)" class="submit_btn">
                  Submit
               </button>
          </div>
     </div>   
  </div>
  <div v-else class="w-full h-screen flex justify-center main_bg">
     <div class="w-7/12 h-auto bg-transparent ">
          <!-- <h3 class="w-full  font-dmSansBold">Garage Request</h3> -->
          <div class="content_container">
            <h5 class="!text-green-400 !text-2xl !font-dmSansMedium">Submission was successful!!</h5>
            <div class="">
              <h6 class="title">
                Your claim estimate has been sent. You will receive a notification in your registered email.
              </h6>

              <div class="form w-full flex gap-4">
              </div>
            </div>
          </div>
          
     </div> 
  </div>

</template>



<script lang="ts">
import {ref} from 'vue';
import { useRoute } from '#imports';
import { IClaimEstimateFormat } from '~~/thirdPartyModels';
import   apiStrings  from '../../apiStrings';
interface FormContents {
    item_name: string, cost_estimate: string
}
  export default{
    setup(){
     const route = useRoute();
     const hasFilledForm = ref<boolean>(false);
     const defaultDate = ref<Date | string>( new Date().toISOString().split('T')[0]);
     const todaysDate = ref<string>(new Date().toISOString().split('T')[0]);
     const forms = ref<Array<FormContents>>([{item_name: '', cost_estimate: ''}]);
     const { VendorId, claimTrackingNumber } = route.query;
    //  console.log(route.query);
     const addToForms = () => {
        forms.value.push({item_name: '', cost_estimate: ''});
     }

     const deleteAnItem = (index: number) => {
        forms.value.splice(index, 1);
     }
     const submitClaimEstimate = async (event: PointerEvent) =>{
        const button = event.target as HTMLButtonElement;
        const prevText = button.textContent;
        button.textContent = 'Submitting...';
        button.disabled = true;
        const garageEstimateValues = forms.value.map(elem => {
            return {
                itemName: elem.item_name,
                itemEstimate: parseInt(elem.cost_estimate)
            }
        });
        const formToSubmit: IClaimEstimateFormat = {
            vendorId: parseInt(VendorId as string),
            claimsKey: claimTrackingNumber as string,
            repairDueDate: defaultDate.value as string,
            garageEstimateValues,
        };
        console.log(formToSubmit);
        try {
        const init: RequestInit = {
          method: 'POST',
          body: JSON.stringify(formToSubmit),
          headers: {
            'content-type': 'application/json'
          }
        }
        let response = await fetch(`${apiStrings.baseApi}${apiStrings.sendClaimsEstimateToAxa}`, init);
        response = await response.json();
        console.log(response);
        button.textContent = prevText;
        button.disabled = false;
        hasFilledForm.value = true;
      } catch (error) {
        console.log(error);
        button.disabled = false;
      }
     }
    return{ defaultDate, todaysDate, forms, addToForms, deleteAnItem, submitClaimEstimate, hasFilledForm}
    }
  }
</script>