<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { showWindow } from '@/utils'

  import ButtonX from '@/components/button/ButtonX.vue'

  const props = defineProps<{
    show: boolean
  }>()

  const route = useRoute()

  const url: string = route.fullPath

  const eml: string = `mailto:?subject=Check%20out%20this%20recipe&body=https://recept0r.com${url}`
  const fb: string = `https://facebook.com/sharer/sharer.php?u=https://recept0r.com${url}`
  const tw: string = `https://twitter.com/intent/tweet/?text=Check%20out%20this%20recipe&url=https://recept0r.com${url}`

  const closeShare = () => showWindow(0)
</script>

<template>
  <transition name="share">
    <div v-if="show" class="share-modal" v-click-outside="closeShare" v-esc="closeShare">
      <div class="flex items-center justify-end leading-none">
        <ButtonX class="rounded-full p-1 mt-2 mx-2" @click="closeShare" />
      </div>
      <div class="flex items-center justify-center text-xs px-12 pb-8">
        <!-- from: https://sharingbuttons.io -->
        <!-- Sharingbutton E-Mail -->
        <a class="resp-sharing-button__link" :href="eml" target="_self" rel="noopener" aria-label="E-Mail">
          <div class="resp-sharing-button resp-sharing-button--email resp-sharing-button--medium">
            <div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z"/>
              </svg>
            </div>
            E-Mail
          </div>
        </a>
        <!-- Sharingbutton Facebook -->
        <a class="resp-sharing-button__link" :href="fb" target="_blank" rel="noopener" aria-label="Facebook">
          <div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--medium">
            <div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
              </svg>
            </div>
            Facebook
          </div>
        </a>
        <!-- Sharingbutton Twitter -->
        <a class="resp-sharing-button__link" :href="tw" target="_blank" rel="noopener" aria-label="Twitter">
          <div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--medium">
            <div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
              </svg>
            </div>
            Twitter
          </div>
        </a>
      </div>
    </div>
  </transition>
</template>

<style lang="postcss" scoped>
  .share-modal {
    @apply absolute bg-gray-500 rounded-lg shadow-lg;
  }

  .resp-sharing-button__link,
  .resp-sharing-button__icon {
    display: inline-block;
  }

  .resp-sharing-button__link {
    @apply shadow-none;
    text-decoration: none;
    color: #fff;
    margin: 0.5em
  }

  .resp-sharing-button {
    @apply flex items-center outline-none;
    border-radius: 5px;
    transition: 25ms ease-out;
    padding: 0.5em 0.75em;
  }

  .resp-sharing-button__icon svg {
    width: 1em;
    height: 1em;
    margin-right: 0.4em;
  }

  .resp-sharing-button__icon--solid,
  .resp-sharing-button__icon--solidcircle {
    fill: #fff;
    stroke: none
  }

  .resp-sharing-button--twitter {
    background-color: #55acee
  }

  .resp-sharing-button--twitter:hover {
    background-color: #2795e9
  }

  .resp-sharing-button--facebook {
    background-color: #3b5998
  }

  .resp-sharing-button--facebook:hover {
    background-color: #2d4373
  }

  .resp-sharing-button--email {
    background-color: #777
  }

  .resp-sharing-button--email:hover {
    background-color: #5e5e5e
  }

  .resp-sharing-button--facebook {
    background-color: #3b5998;
    border-color: #3b5998;
  }

  .resp-sharing-button--facebook:hover,
  .resp-sharing-button--facebook:active {
    background-color: #2d4373;
    border-color: #2d4373;
  }

  .resp-sharing-button--twitter {
    background-color: #55acee;
    border-color: #55acee;
  }

  .resp-sharing-button--twitter:hover,
  .resp-sharing-button--twitter:active {
    background-color: #2795e9;
    border-color: #2795e9;
  }

  .resp-sharing-button--email {
    background-color: #777777;
    border-color: #777777;
  }

  .resp-sharing-button--email:hover,
  .resp-sharing-button--email:active {
    background-color: #5e5e5e;
    border-color: #5e5e5e;
  }

  .share-enter-active,
  .share-leave-active {
    transition: all 0.5s;
  }

  .share-enter-from,
  .share-leave-to {
    transform: translateX(-150px);
    opacity: 0;
  }
</style>