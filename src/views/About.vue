<template>
  <section id="about" class="w-full md:w-2/3 lg:w-3/5 mx-auto">
    <h1 class="h2">About This Website</h1>
    <p>
      If you're into cooking, you might find some inspiration here 😁
    </p>
    <p>recept0r is a minimal <a href="https://codeberg.org/ttntm/recept0r" target="_blank">open source</a> recipes app built with vue.js. It's a serverless web application making use of Netlify functions to handle all backend functionality like database access and user authentication.</p>
    <p>It's designed to scale well while keeping operational costs at a bare minimum; all platforms and services used offer generous free tiers that are enough to host and operate the application you see here for zero runtime cost.</p>
    <p>At the moment, recept0r is a semi-public personal/family service. That means that even though public signup is in the code, it's currently disabled.</p>
    <h3 class="mb-0">Credits</h3>
    <div class="flex flex-col sm:flex-row">
      <div class="flex flex-row items-center justify-start my-4 sm:mr-12">
        <div class="w-12 h-12 flex flex-col justify-center">
          <img src="/img/sahar.svg" class="h-10 block mx-auto" alt="sahar.design">
        </div>
        <p class="ml-6 mb-0">
          <strong class="text-sm">Design</strong><br>
          Sahar&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://sahar.design" target="_blank">website</a>
        </p>
      </div>
      <div class="flex flex-row items-center justify-start my-4 sm:ml-12">
        <div class="w-12 h-12 flex flex-col justify-center">
          <img src="/img/tom.svg" class="h-10 block mx-auto" alt="ttntm.me">
        </div>
        <p class="ml-6 mb-0">
          <strong class="text-sm">Code</strong><br>
          Tom&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://ttntm.me" target="_blank">website</a>
        </p>
      </div>
    </div>
    <h2 class="h3">More Information</h2>
    <p>This is FOSS, feel free to fork the project and deploy your own instance!</p>
    <p>Re-written from scratch in summer 2021, a year after its initial release; using Vite and Vue 3 with TypeScript now.</p>
  </section>
</template>

<style lang="postcss" scoped>
  a {
    @apply text-blue-500 font-bold underline;
  }
  a:hover {
    @apply no-underline;
  }
</style>