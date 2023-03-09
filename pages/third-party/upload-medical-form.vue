<template>
  <div v-if="!hasFilledForm" class="w-full h-screen flex justify-center main_bg">
     <div class="w-7/12 h-auto bg-transparent ">
        <h3 class="w-full  font-dmSansBold">Upload Medical Report</h3>
        <div class="content_container">
            <div v-if="customerData.data" class="tags_house mb-3 px-4 pt-3 pb-3" style="width: 100%;background-color: #FBFBFB;">
                <h5>Customer Details</h5>
                <div class="flex flex-row" style="margin-bottom: 3rem;">
                    <div class="m-r">
                        <span class="text-[#a4a4a4]" for="">Patient</span>
                        <p>{{customerData.data.patientFullName}}</p>
                    </div>
                    <div class="">
                        <span class="text-[#a4a4a4]" for="">Medical Test</span>
                        <p>{{customerData.data.medicalTest}}</p>
                    </div>
                </div>
                <h5>Click the button below to upload a File:</h5>
                <div class="uploadContainer">
                    <label :class="{'w-32': fileUploadedName.length > 2}" class="label_for_upload" for="upload_file">Upload File</label>
                    <input id="upload_file" @change="handleFileUploaded($event)" accept=".pdf" type="file" hidden>
                    <div class="file_uploaded_container" v-if="fileUploadedName.length > 2">
                    <div class="file_icon">
                        <img src="../../assets/images/pdf_icon.svg" alt="">
                    </div>
                    <div class="file_name"> {{ fileUploadedName }} </div>
                    <div @click="deleteFile" class="delete_file">
                        <img src="../../assets/images/trash_can.svg" alt="">
                    </div>

                    </div>
                </div>
                <div class="text-left">
                    <button @click="submitResponse($event)" class="submit_btn" :class="{'disabled' : fileUploadedName.length < 1}">
                        Upload Report
                    </button>
                </div>
            </div>
            <div v-else class="tags_house mb-3 px-4 pt-3 pb-3" style="width: 100%;background-color: #FBFBFB;">
                <h5 v-if="!inavlidToken">Fetching Customer Data</h5>
                <h5 v-else>Unable to fetch customer data. </h5>
            </div>
        </div>  
     </div> 
  </div>
  <div v-else class="w-full h-screen flex justify-center main_bg">
     <div class="w-7/12 h-auto bg-transparent ">
          <div class="content_container">
            <h5 class="!text-green-400 !text-2xl !font-dmSansMedium">Document Uploaded Successfully!!!</h5>
            <div class="">
              <h6 class="title">
                The Medical Report was uploaded successfully.
              </h6>

              <div class="form w-full flex gap-4">
              </div>
            </div>
          </div>  
     </div> 
  </div>
</template>

<style scoped>
.uploadContainer{
    @apply w-full flex gap-3 border border-dashed border-[#a4a4a4] py-3 px-2;
}

h5{
  @apply font-dmSansMedium font-semibold mb-2 text-xl text-[#a4a4a4]
}

.m-r{
  margin-right: 50%;
}

.label_for_upload{
    @apply transition-all hover:rounded-sm font-dmSansMedium cursor-pointer border  text-[#4976ba] py-2 shadow-sm hover:bg-[#4976ba] hover:text-white hover:shadow-md rounded-md px-2;
 }

 .file_uploaded_container{
  @apply flex gap-3 items-center w-full relative pl-3;
 }

 .file_name::before{
  content: '';
  position: absolute;
  height: 100%;
  width: 1px;
  border: 1px solid rgba(71, 71, 71, .22);
  background-color: rgba(71, 71, 71, .22);
  left: 0;
 }
 .file_icon, .delete_file, .file_name{
  @apply h-10 flex justify-center items-center;
 }

 .file_name{
   flex-grow: 3;
   @apply flex justify-start items-center font-dmSansRegular text-xl;
 }

 .file_icon img, .delete_file img{
  @apply max-h-[70%] object-cover flex;
 }

 .delete_file{
  @apply cursor-pointer;
 }

 .submit_btn.disabled{
  @apply opacity-30 pointer-events-none
 }
</style>

<script lang="ts">
import { useRoute } from '#imports';
import { onBeforeMount } from 'vue';
import   apiStrings  from '../../apiStrings';
  export default{
    setup(){
        const route = useRoute();
        const { token } = route.query;
        let customerData = ref<any>('');
        let policyId
        let inavlidToken 

        onBeforeMount(() => verifyData());
        async function verifyData() {
            try {
                const preInit: RequestInit = {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                    }
                    let res = await fetch(`${apiStrings.baseApi}${apiStrings.verifyMedicalToken}/${token}`, preInit);
                    customerData.value = await res.json();
                    policyId = customerData.value.data.policyId
                    console.log('===>>>', customerData, policyId)
            } catch (error) {
                console.log('error', error);
                inavlidToken = true
            }
        }
       
      const hasFilledForm = ref<boolean>(false);
      const base64String = ref<string | null>(null);
      const fileUploadedName = ref<string>('');
      const fileRepo = ref<FileList | null>(null); 
      const  deleteFile = () => {
        fileUploadedName.value = '';
      }
      const submitResponse = async (event: PointerEvent) => {
              const button = event.target as HTMLButtonElement;
              const prevText = button.textContent;
              button.textContent = 'Sending...';
              button.classList.add('disabled');
              const objToSubmit = [{
                file: base64String.value,
                id: customerData.value.data.id,
              }]
              try {
              const init: RequestInit = {
                method: 'POST',
                body: JSON.stringify(objToSubmit),
                headers: {
                  'content-type': 'application/json'
                }
              }
              let response = await fetch(`${apiStrings.baseApi}${apiStrings.uploadMedicalForm}/${policyId}`, init);
              response = await response.json();
              button.textContent = prevText;
              console.log(response);
              hasFilledForm.value = true;
              button.classList.remove('disabled');
            } catch (error) {
              console.log(error);
              button.classList.remove('disabled');
            }
      }
       const handleFileUploaded = (event: Event) => {
       const fileList: FileList =  (event.target as HTMLInputElement).files;
       fileRepo.value = fileList;
       fileUploadedName.value = fileList.item(0).name;
       const fileReader: FileReader = new FileReader();
        fileReader.onload = async (ev: ProgressEvent<FileReader>) => {
          base64String.value = await ev.target.result as string;
          console.log(base64String.value);
        }
        fileReader.readAsDataURL(fileList.item(0));
      }
      return {handleFileUploaded, fileUploadedName, hasFilledForm, deleteFile, submitResponse, customerData}
    }
  }
</script>