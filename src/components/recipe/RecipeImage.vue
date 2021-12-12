<script setup lang="ts">
  import { reactive } from 'vue'
  import { useStore } from '@/store'

  import { isImgUploaded, uploadImage } from '@/utils'

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
        <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
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