<script setup lang="ts">
  import { reactive } from 'vue'
  import { useStore } from '@/store'
  import { isImgUploaded, uploadImage } from '@/utils/useCloudinary'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'

  const props = defineProps<{
    currentImage: string,
    recipe: string
  }>()

  const emit = defineEmits<{
    (e: 'update:image', val?: string): void
  }>()

  const store = useStore()

  const imageStatus = reactive({
    type: '',
    body: ''
  })

  const events = {
    onAddImage(evt: Event) {
      const eTarget = evt.target as HTMLInputElement
      const selectedImage = eTarget.files?.length ? eTarget.files[0] : null //get the first file

      //cancel if there's no image or if the image is removed
      if (!selectedImage) return

      const reader = new FileReader()

      reader.onload = e => {
        if (e.target) {
          emit('update:image', e.target.result?.toString())
          imageStatus.type = 'info'
          imageStatus.body = 'Image received, please press "Upload Image" now.'
        }
      }

      reader.readAsDataURL(selectedImage)
    },

    onRemoveImage() {
      emit('update:image', '')
      imageStatus.type = 'info'
      imageStatus.body = 'Image removed.'
    },

    async onUploadImage() {
      const uPreset = store.getters['app/cdnryUpreset']
      const uploadUrl = store.getters['app/cdnryURL']

      if (isImgUploaded(props.currentImage)) {
        imageStatus.type = 'error'
        imageStatus.body = 'This image was uploaded already. Please remove it if you want to change it.'
        return
      }

      imageStatus.type = 'info'
      imageStatus.body = `<img src="/img/loading.svg" class="w-6 inline-block"><span class="inline-block ml-2">Uploading...</span>`

      let uData = new FormData()
        uData.append('upload_preset', uPreset)
        uData.append('tags', props.recipe)
        uData.append('file', props.currentImage)

      let uploaded = await uploadImage(uploadUrl, uData)

      uploaded.data ? emit('update:image', uploaded.data) : imageStatus.type = 'error'

      imageStatus.body = uploaded.message
    }
  }
</script>

<template>
  <section id="edit-image">
    <div v-if="!currentImage" class="border border-gray-600 border-dashed rounded-lg p-8 px-12 mb-4">
      <label class="flex flex-col w-full md:w-3/4 items-center btn btn-gray cursor-pointer shadow-sm hover:shadow-none px-4 py-6 mx-auto">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 200 200">
          <path d="M104.61,84.78c-2.05-3.55-7.17-3.55-9.22,0l-10.08,17.47c-2.05,3.55.51,7.98,4.61,7.98h7.58v34.76c0,1.38,1.12,2.5,2.5,2.5s2.5-1.12,2.5-2.5v-34.76h7.58c4.1,0,6.66-4.44,4.61-7.98l-10.08-17.47ZM135.04,77.12h-2.31c.65-6.16-.88-12.34-4.42-17.69-4.62-6.98-12.31-11.89-21.1-13.49-16.52-3-32.69,6.22-37.08,20.75-14.09.96-25.24,12.28-25.24,26.05s12.2,26.11,27.19,26.11c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5c-12.23,0-22.19-9.47-22.19-21.11s9.95-21.11,22.19-21.11c1.17,0,2.18-.81,2.44-1.95,2.93-13.03,17.19-21.47,31.8-18.82,7.46,1.36,13.96,5.49,17.83,11.33,3.37,5.09,4.51,11.09,3.21,16.88-.17.74.01,1.52.49,2.11.47.59,1.19.94,1.95.94h5.25c8.75,0,15.87,7.12,15.87,15.87s-7.12,15.87-15.87,15.87h-5.25c-1.38,0-2.5,1.12-2.5,2.5s1.12,2.5,2.5,2.5h5.25c11.51,0,20.87-9.36,20.87-20.87s-9.36-20.87-20.87-20.87Z" fill="currentColor" stroke-width="5" stroke="currentColor" />
        </svg>
        <span class="mt-2 text-base leading-normal">Select Image</span>
        <input class="hidden" type="file" accept="image/*" @change="events.onAddImage" />
      </label>
    </div>
    <transition name="fade">
      <p
        v-if="imageStatus.type !== ''"
        v-html="imageStatus.body"
        class="text-sm text-center mb-4"
        :class="{
          'error': imageStatus.type === 'error',
          'text-blue-500': imageStatus.type === 'info',
        }"
      />
    </transition>
    <div v-if="currentImage" class="flex flex-row items-center justify-center">
      <ButtonDefault v-click-blur class="text-sm mr-4" @click="events.onUploadImage">Upload Image</ButtonDefault>
      <ButtonDefault v-click-blur class="opacity-50 hover:opacity-100 text-sm" @click="events.onRemoveImage">Remove Image</ButtonDefault>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
  .error {
    @apply font-semibold;
    color: salmon;
  }
</style>