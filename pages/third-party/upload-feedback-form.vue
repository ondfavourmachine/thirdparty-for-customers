<template>
  <div v-if="!hasFilledForm" class="w-full h-screen flex justify-center main_bg">
     <div class="w-7/12 h-auto bg-transparent ">
          <h3 class="w-full  font-dmSansBold">Upload Feedback Form</h3>
          <div class="content_container">
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
                  Send Form
               </button>
         </div>
          </div>
          
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
.uploadContainer{
    @apply w-full flex gap-3 border border-dashed border-[#a4a4a4] py-3 px-2;
}

h5{
  @apply font-dmSansMedium font-semibold mb-2 text-xl text-[#a4a4a4]
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
import   apiStrings  from '../../apiStrings';
  export default{
    setup(){
      const route = useRoute();
      const { VendorId, claimTrackingNumber } = route.query;
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
              const objToSubmit = {
                base64String: base64String.value,
                claimDocumentId: 0,
                documentName: fileUploadedName.value,
                extension: fileRepo.value.item(0).type,
                vendorId: VendorId,
                claimsKey: claimTrackingNumber
              }
              try {
              const init: RequestInit = {
                method: 'POST',
                body: JSON.stringify(objToSubmit),
                headers: {
                  'content-type': 'application/json'
                }
              }
              let response = await fetch(`${apiStrings.baseApi}${apiStrings.uploadFeedbackForm}`, init);
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
      return {handleFileUploaded, fileUploadedName, hasFilledForm, deleteFile, submitResponse}
    }
  }
</script>