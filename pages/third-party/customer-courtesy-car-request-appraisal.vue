<template>
  <div v-if="!hasFilledForm"  class="w-full h-screen flex justify-center main_bg">
     <div class="w-9/12 h-auto bg-transparent ">
          <h3 class="w-full  font-dmSansBold">Courtesy Car Appraisal Form</h3>
          <div class="content_container">
            
                <div class="overflow-x-auto relative">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs border-b text-gray-700 uppercase font-dmSansBold dark:text-gray-400">
                            <tr>
                                <th scope="col" class="py-3 px-6">
                                CLAIM JOBS
                                </th>
                                <th scope="col" class="py-3 px-6">
                                METRIC SCALE
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(question, index) in questionsToDisplay" :key="index" class="bg-white">
                                <th scope="row" class="py-4 px-6 font-dmSansRegular text-gray-900 whitespace-nowrap dark:text-white">
                                    {{question.question}}
                                </th>
                                <td class="py-4 px-6 font-dmSansRegular">
                                    <form  class="radio_buttons flex justify-between w-full items-center ">
                                            <div  class="flex gap-2 items-center justify-center">
                                                <span>1</span>
                                                <input  
                                                name="answer"
                                                value="20"
                                                v-model="question.answer"
                                                class="form-check-input" type="radio" id="poor">
                                                <label class="form-check-label mx-1" for="poor">
                                                Poor
                                                </label>
                                            </div>
                                            <div  class="flex gap-2 items-center justify-center">
                                                <span>2</span>
                                                <input 
                                                name="answer"
                                                v-model="question.answer"
                                                value="40"
                                                class="form-check-input" type="radio" id="fair">
                                                <label class="form-check-label mx-1" for="fair">
                                                Fair
                                                </label>
                                            </div>
                                            <div  class="flex gap-2 items-center justify-center">
                                                <span>3</span>
                                                <input 
                                                name="answer"
                                                v-model="question.answer"
                                                value="60"
                                                class="form-check-input" type="radio" id="good">
                                                <label class="form-check-label mx-1" for="good">
                                                Good
                                                </label>
                                            </div>
                                            <div  class="flex gap-2 items-center justify-center">
                                                <span>4</span>
                                                <input 
                                                name="answer"
                                                v-model="question.answer"
                                                value="80"
                                                class="form-check-input" type="radio" id="very_good">
                                                <label class="form-check-label mx-1" for="very_good">
                                                Very Good
                                                </label>
                                            </div>
                                            <div  class="flex gap-2 items-center justify-center">
                                                <span>5</span>
                                                <input 
                                                name="answer"
                                                value="100"
                                                v-model="question.answer"
                                                class="form-check-input" type="radio" id="excellent">
                                                <label class="form-check-label mx-1" for="excellent">
                                                Excellent
                                                </label>
                                            </div>
                                        </form>
                                </td>
                                
                            </tr>
                            
                        </tbody>
                    </table>
                </div>

          </div>
          <div class="text-right">
               <button @click="submit($event)" class="submit_btn">
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
          <div class="content_container">
            <h5 class="!text-green-400 !text-2xl !font-dmSansMedium">Submission was successful!!</h5>
            <div class="">
              <h6 class="title">
                Your feedback form was uploaded successfully.
              </h6>

              <div class="form w-full flex gap-4">
              </div>
            </div>
          </div>  
     </div> 
  </div>
  
</template>

<style scoped>
  
</style>

<script lang="ts">
import { useRoute } from '#imports';
import { LoadingScreen } from '#components';
import { onBeforeMount } from 'vue';
import   apiStrings  from '../../apiStrings';
import { BaseResponse, AQuestion, Answer, AppraisalReturnDS } from '~~/thirdPartyModels';
export default{
  setup(){
    const route = useRoute();
    const {VendorId, claimTrackingNumber } = route.query;
    console.log(VendorId, claimTrackingNumber);
    const isLoading = ref<boolean>(true);
    const questionsToDisplay = ref<AQuestion[]>([]);
    const hasFilledForm = ref<boolean>(false);
    onBeforeMount(async () => {
      try {
      let res = await fetch(`${apiStrings.baseApi}${apiStrings.fetchAppriasalFormValues}`);
       res = await res.json();
       questionsToDisplay.value = (res as unknown as BaseResponse<{list: AQuestion[]}>).responseData.list;
       questionsToDisplay.value = questionsToDisplay.value.filter(elem => elem.categoryName.includes('Car'));
       console.log(questionsToDisplay.value);
       isLoading.value = false;
       console.log(res)
      } catch (error) {
        console.log(error);
        isLoading.value = false;
      } 
    })
    
    const submit =async (event: PointerEvent) => {
        const button = event.target as HTMLButtonElement;
        const prevText = button.textContent;
        button.textContent = 'Submitting...';
        isLoading.value = true;
        console.log(questionsToDisplay.value);
        const formToSubmit: AppraisalReturnDS = {
            vendorId: parseInt(VendorId as string),
            claimKey: claimTrackingNumber as any,
            userId: '',
            answervalue: questionsToDisplay.value.map(elem => ({appraisalQuestionId: elem.questionId, score: parseInt(elem.answer)}))
        }
        console.log(formToSubmit);
         try {
              const init: RequestInit = {
                method: 'POST',
                body: JSON.stringify(formToSubmit),
                headers: {
                  'content-type': 'application/json'
                }
              }
              let response = await fetch(`${apiStrings.baseApi}${apiStrings.appraiseAVendor}`, init);
              response = await response.json();
              button.textContent = prevText;
              isLoading.value = false;
              hasFilledForm.value = true;
              button.classList.remove('disabled');
            } catch (error) {
              console.log(error);
              button.classList.remove('disabled');
            }
    }
    
    return{ isLoading, questionsToDisplay, submit, hasFilledForm };
  },

  components: {
    LoadingScreen,
  }
  
}

</script>